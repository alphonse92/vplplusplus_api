const Config = global.Config;
const Util = require(Config.paths.utils);
const User = require(Config.paths.models + "/user/user.mongo");
const UserErrors = require(Config.paths.errors + "/user.errors");
const Policy = require(Config.paths.models + "/policy/policy.mongo");
const PolicyService = require(Config.paths.services + "/policy/policy.service");
const jwt = require('jsonwebtoken');
const _ = require("lodash");

module.exports.User = User;
module.exports.auth = auth;
function auth(email, password){
	const AuthStrategy = require("./moodle/auth/" + Config.moodle.auth.type);
	return AuthStrategy(email, password)
		.then(result => {
			MoodleUserData = result;
			if(MoodleUserData.suspended === 1)
				return Promise.reject(UserErrors.user_suspended);
			return findOneOrCreate({$or:[{id:MoodleUserData.id}, {email:MoodleUserData.email}]}, MoodleUserData)
		})
		.then(UserDoc => {
			UserDoc.type = User.getUserTypes.person;
			return User.findByIdAndUpdate(UserDoc._id, MoodleUserData, {new :true})
		})
		.then(formatAuthResponse)
		.then(getAuthToken)
}

module.exports.getAuthToken = getAuthToken;
function getAuthToken(UserDoc){
	let token = _.pick(UserDoc, ["_id", "id", "username"]);
	token.exp = Math.floor(Date.now() / 1000) + (Config.security.expiration_minutes);
	token = jwt.sign(token, Config.security.token);
	UserDoc.token = token;
	return Promise.resolve(UserDoc);
}

module.exports.findOneOrCreate = findOneOrCreate;
function findOneOrCreate(query, data){
	return User.findOne(query)
		.then(UserDocument => {
			if(UserDocument)
				return UserDocument;
			return User.create(data);
		})
		.then(addPolicies)
}

function addPolicies(UserDoc){
	UserDoc.policies = getUserPolicies(UserDoc);
	return UserDoc.save();
}

module.exports.getUserPolicies = getUserPolicies;
function getUserPolicies(UserDoc){
	let policies = [];
	let archetypesAdded = [];

	if(UserDoc.is_site_admin)
		policies = policies.concat(getPoliciesByArchetype("siteadministrator"));

	UserDoc.roles.forEach(role => {
		let archetype = role.archetype;
		if(!archetypesAdded.includes(archetype)){
			policies = policies.concat(getPoliciesByArchetype(archetype));
			archetypesAdded.push(archetype)
		}
	})

	return policies;
}

module.exports.getPoliciesByArchetype = getPoliciesByArchetype;
function getPoliciesByArchetype(archetype){
	return Config.moodle.archetypes[archetype];
}

function formatAuthResponse(UserDoc){
	return PolicyService.getPolicies(UserDoc.policies)
		.then(PolicyList => {
			UserDoc = UserDoc.toObject();
			UserDoc.scopes = PolicyList.reduce((scopes, policy) => {
				policy.actions.forEach(Action => {
					scopes = scopes.concat(Action.scopes);
				})
				return scopes;
			}, [])
			return Promise.resolve(UserDoc)
		})
		.then((UserData) => {
			return Promise.resolve(_.pick(UserData, User.getPublicFields().concat(["scopes"])))
		})
}



module.exports.createDefaultUserIfNotExist = createDefaultUserIfNotExist;
function createDefaultUserIfNotExist(){
	return User.findOne({email:Config.client.email})
		.then(UserDoc => {
			if(UserDoc)
				return Promise.resolve(UserDoc);

			let data = require("./fixtures/client");
			data.username = Config.client.username;
			data.email = Config.client.email;
			data.type = User.getUserTypes().api_client;
			return User.create(data);
		})
}


module.exports.getGetUserMiddleware = getGetUserMiddleware;
function getGetUserMiddleware(){
	return (req, res, next) => {
		let token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
		let userFindPromise = null;
		if(!token){
			userFindPromise = User.findOne({email:Config.client.email})
		}else{
			try{
				token = jwt.verify(req.headers.authorization.split(" ")[1], Config.security.token);
				userFindPromise = User.findById(token._id)
			}catch(e){
				userFindPromise = Promise.reject(UserErrors.token_not_valid)
			}
		}

		userFindPromise
			.then(User => {
				if(!User)
					return Promise.reject(UserErrors.token_not_valid);
				res.locals.__mv__ = res.locals.__mv__ || {};
				res.locals.__mv__.user = User;
				next();
			})
			.catch(err => Util.response.handleError(err, res))
	}


}

module.exports.list = list;
function list(req){
	let id = req.params.id;
	let paginator = Util.mongoose.getPaginatorFromRequest(req, Config.app.paginator);
	let query = Util.mongoose.getQueryFromRequest(req);
	return Util.mongoose.list(User, id, query, paginator);
}