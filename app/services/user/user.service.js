const Config = global.Config;
const Util = require(Config.paths.utils);
const User = require(Config.paths.models + "/user/user.mongo");
const UserErrors = require(Config.paths.errors + "/user.errors");
const Policy = require(Config.paths.models + "/policy/policy.mongo");
const PolicyService = require(Config.paths.services + "/policy/policy.service");
const MoodleWebservice = require(Config.paths.webservices + "/moodle.client");
const jwt = require('jsonwebtoken');
const _ = require("lodash");

module.exports.User = User;
module.exports.auth = auth;
function auth(usernameOrEmail, password){
	const AuthStrategy = require("./moodle/auth/" + Config.moodle.auth.type);
	let MoodleUserData = null;
	let UserDoc = null;
	return AuthStrategy(usernameOrEmail, password)
		.then(result => {
			MoodleUserData = result;
			if(MoodleUserData.suspended === 1)
				return Promise.reject(UserErrors.user_suspended);
			return findOneOrCreate({$or:[{id:MoodleUserData.id}, {email:MoodleUserData.email}]}, MoodleUserData)
		})
		.then((UserDoc) => User.findByIdAndUpdate(UserDoc._id, MoodleUserData, {new :true}))
		.then((userdoc) => {
			UserDoc = userdoc;
			return getTokenWebservice(userdoc, password)
		})
		.then(TokenMoodle => {
			let token = {client:MoodleWebservice.name, token:TokenMoodle};
			UserDoc.tokens = UserDoc.tokens.filter(t => t.client !== token.client) //remove the last token
			UserDoc.tokens.push(token) //add the new token
			UserDoc.type = User.getUserTypes().person;
			return UserDoc.save();
		})
		.then(formatAuthResponse)
		.then(UserDoc => getAuthToken(UserDoc, {exp:Math.floor(Date.now() / 1000) + (Config.security.expiration_minutes)}))

}

module.exports.getAuthToken = getAuthToken;
function getAuthToken(UserDoc, opt){
	opt = opt || {};
	let token = _.pick(UserDoc, ["_id", "id", "username", "type"]);
	if(opt.exp)
		token.exp = opt.exp;
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
		.then(addGroupsToUser)
}

function addGroupsToUser(UserDoc){
	UserDoc.groups = getUserGroups(UserDoc);
	return UserDoc.save();
}

module.exports.getUserGroups = getUserGroups;
function getUserGroups(UserDoc){
	let groups = [];
	if(UserDoc.is_site_admin)
		groups.push(getGroupByArchetype("siteadministrator").name);

	UserDoc.roles.forEach(role => {
		let archetype = role.archetype;
		if(!groups.includes(archetype)){
			groups.push(getGroupByArchetype(archetype).name)
		}
	})
	return groups;
}

module.exports.getGroupByArchetype = getGroupByArchetype;
function getGroupByArchetype(archetype){
	return PolicyService.getGroupByArchetype(archetype);
}

module.exports.getTokenWebservice = getTokenWebservice;
function getTokenWebservice(UserDoc, password){
	let Host = Config.moodle.web.protocol + "://" + Config.moodle.web.host + ":" + Config.moodle.web.port;
	let path = "/login/token.php?"
	let query = [
		"username=" + UserDoc.username,
		"password=" + password,
		"service=" + Config.moodle.web.service
	].join("&");
	let url = Host + path + query;
	Util.log(url)
	return Util.request("get", {url})
		.then(result => {
			return Promise.resolve(JSON.parse(result.body).token);
		})
}

function formatAuthResponse(UserDoc){
	return PolicyService.getPolicies(UserDoc)
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
			data.groups = [PolicyService.getDefaultGroups().frontpage.name];
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
			userFindPromise = new Promise((resolve, reject) => {
				jwt.verify(req.headers.authorization.split(" ")[1], Config.security.token, function(err, decoded){
					return err ? reject(err) : resolve(decoded)
				});
			}).then(decoded => User.findById(decoded._id))
		}

		userFindPromise
			.then(User => {
				if(!User)
					return Promise.reject(UserErrors.token_not_valid);

				Util.log("HEADERS", req.headers)
				Util.log("QUERY", "email:", User.email)

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
	query.createdBy = {$exists:false}
	return Util.mongoose.list(User, id, query, paginator);
}

/**
 * This function doesnt create a moodle user. The vpl API isnt a moodle client.
 * This function only creates a user for vpl api clients, and it api roles,
 * for example, you can add a user for vpl-jlib.
 * 
 *
 */
module.exports.createClient = createClient;
function createClient(UserDoc, client){
	let data = require("./fixtures/runner");
	data._id = Util.mongoose.createObjectId();
	data.id = -1 * Date.now();
	data.username = client.username;
	data.email = data.username + "@" + Config.web.host;
	data.type = User.getUserTypes().runner_client;
	data.groups = [PolicyService.getDefaultGroups().runner.name];
	data.createdBy = UserDoc._id;
	return User.create(data)
		.then((result) => getAuthToken(result.toObject()))
}


module.exports.listClient = listClient;
function listClient(req){
	let id = req.params.id;
	let paginator = Util.mongoose.getPaginatorFromRequest(req, Config.app.paginator);
	let query = Util.mongoose.getQueryFromRequest(req);
	query.type = User.getUserTypes().runner_client;
	return Util.mongoose.list(User, id, query, paginator);
}