const Config = global.Config;
const Util = require(Config.paths.utils);
const User = require(Config.paths.models + "/user/user.mongo");
const UserErrors = require(Config.paths.errors + "/user.errors");
const Policy = require(Config.paths.models + "/policy/policy.mongo");
const PolicyService = require(Config.paths.services + "/policy/policy.service");
const MoodleWebservice = require(Config.paths.webservices + "/moodle.client");
const jwt = require('jsonwebtoken');
const _ = require("lodash");


const Service = {}
Service.User = User;

Service.auth = auth;
async function auth(usernameOrEmail, password) {
	const AuthStrategy = require("./moodle/auth/" + Config.moodle.auth.type);

	const MoodleUserData = await AuthStrategy(usernameOrEmail, password)
	if (MoodleUserData.suspended) throw new Error(UserErrors.user_suspended);

	const type = User.getUserTypes().person
	const query = { $or: [{ id: MoodleUserData.id }, { email: MoodleUserData.email }] }
	const data = { ...MoodleUserData, type }
	const UserDoc = await updateOrCreate(query, data)
	const UserWithPolicies = await getUserWithPolicies(UserDoc)
	return addTokenToUserObject(UserWithPolicies, getApplicationJWTToken())
}

Service.addTokenToUserObject = addTokenToUserObject;
function addTokenToUserObject(UserDoc, opt) {
	UserDoc.token = getAuthTokenFromUser(UserDoc, opt);
	return Promise.resolve(UserDoc);
}

Service.getAuthTokenFromUser = getAuthTokenFromUser
function getAuthTokenFromUser(UserDoc, opt) {
	opt = opt || {};
	let token = _.pick(UserDoc, User.getTokenizerFields());
	if (opt.exp)
		token.exp = opt.exp;
	token = jwt.sign(token, Config.security.token);
	return token;
}

Service.updateOrCreate = updateOrCreate;
async function updateOrCreate(query, data) {
	return User.findOneAndUpdate(query, { ...data }, { upsert: true, new: true }).exec()
}

function addGroupsToUser(UserDoc) {
	UserDoc.groups = getUserGroups(UserDoc);
	return UserDoc.save();
}

Service.getUserGroups = getUserGroups;
function getUserGroups(UserDoc) {
	let groups = [];
	if (UserDoc.is_site_admin)
		groups.push(getGroupByArchetype("siteadministrator").name);

	UserDoc.roles.forEach(role => {
		let archetype = role.archetype;
		if (!groups.includes(archetype)) {
			groups.push(getGroupByArchetype(archetype).name)
		}
	})
	return groups;
}

Service.getGroupByArchetype = getGroupByArchetype;
function getGroupByArchetype(archetype) {
	return PolicyService.getGroupByArchetype(archetype);
}

Service.getTokenVPLWebService = getTokenVPLWebService;
function getTokenVPLWebService(UserDoc, password) {
	let Host = Config.moodle.web.protocol + "://" + Config.moodle.web.host + ":" + Config.moodle.web.port;
	let path = "/login/token.php?"
	let query = [
		"username=" + UserDoc.username,
		"password=" + password,
		"service=" + Config.moodle.web.VPLservice
	].join("&");
	let url = Host + path + query;
	Util.log(url)
	return Util.request("get", { url })
		.then(result => {
			return Promise.resolve(JSON.parse(result.body).token);
		})
}

Service.getTokenWebservice = getTokenWebservice;
function getTokenWebservice(UserDoc, password) {
	let Host = Config.moodle.web.protocol + "://" + Config.moodle.web.host + ":" + Config.moodle.web.port;
	let path = "/login/token.php?"
	let query = [
		"username=" + UserDoc.username,
		"password=" + password,
		"service=" + Config.moodle.web.service
	].join("&");
	let url = Host + path + query;
	Util.log(url)
	return Util.request("get", { url })
		.then(result => {
			return Promise.resolve(JSON.parse(result.body).token);
		})
}

function getUserWithPolicies(UserDoc) {
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



Service.createDefaultUserIfNotExist = createDefaultUserIfNotExist;
function createDefaultUserIfNotExist() {
	return User.findOne({ email: Config.client.email })
		.then(UserDoc => {
			if (UserDoc)
				return Promise.resolve(UserDoc);
			let data = require("./fixtures/client");
			data.username = Config.client.username;
			data.email = Config.client.email;
			data.type = User.getUserTypes().api_client;
			data.groups = [PolicyService.getDefaultGroups().frontpage.name];
			return User.create(data);
		})
}

function getUserFromTokenByUserType(type) {
	let types = {
		[User.getUserTypes().person]: payload => User.findById(payload._id),
		[User.getUserTypes().runner_client]: payload => User.findOne({ _id: payload._id, token_counter: payload.token_counter }),
	}
	type = types[type] || types[User.getUserTypes().person]
	return type
}

Service.getGetUserMiddleware = getGetUserMiddleware;
function getGetUserMiddleware() {
	return (req, res, next) => {
		let token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
		let userFindPromise = null;

		if (!token) {
			userFindPromise = User.findOne({ email: Config.client.email })
		} else {
			userFindPromise = new Promise((resolve, reject) => {
				jwt.verify(req.headers.authorization.split(" ")[1], Config.security.token, function (err, payload) {
					return err ? reject(err) : resolve(payload)
				});
			})
				.then(payload => getUserFromTokenByUserType(payload.type)(payload))
		}


		userFindPromise
			.then(User => {
				if (!User)
					return Promise.reject(UserErrors.token_not_valid);

				Util.log("HEADERS", req.headers)
				Util.log("QUERY email:", User.email)

				res.locals.__mv__ = res.locals.__mv__ || {};
				res.locals.__mv__.user = User;

				next();
			})
			.catch(err => Util.response.handleError(err, res))
	}
}

/**
 * This function doesnt create a moodle user. The vpl API isnt a moodle client.
 * This function only creates a user for vpl api clients, and it api roles,
 * for example, you can add a user for vpl-jlib.
 * 
 *
 */
Service.create = create;
function create(UserDoc, client) {
	let data = require("./fixtures/runner");
	data = Object.assign(data, _.pick(client, User.getFillableFields()))
	data.id = -1 * Date.now();
	data.email = data.username + "@" + Config.web.host;
	data.type = User.getUserTypes().runner_client;
	data.groups = [PolicyService.getDefaultGroups().runner.name];
	data.base_path = getBasePath(UserDoc);
	return User.create(data)
		.then((result) => addTokenToUserObject(result.toObject()))
}

/**
 * This function doesnt lists the moodle users. The vpl API isnt a moodle client.
 * This function only list moodle's users for vpl api clients, and it api roles.
 */
Service.list = list;
function list(UserDoc, req) {
	let id = req.params.id;
	let paginator = Util.mongoose.getPaginatorFromRequest(req, Config.app.paginator);
	let query = Util.mongoose.getQueryFromRequest(req);
	query.base_path = { $regex: "^" + getBasePath(UserDoc) };
	return Util.mongoose.list(User, id, query, paginator)
}
/**
 * This function doesnt lists the moodle users. The vpl API isnt a moodle client.
 * This function only list moodle's users for vpl api clients, and it api roles.
 */
Service.delete = _delete;
function _delete(UserDoc, client_id) {
	let query = { _id: client_id, base_path: { $regex: "^" + getBasePath(UserDoc) }, type: User.getUserTypes().runner_client }
	return User.findOneAndRemove(query)
		.then(UserDoc => Promise.resolve(_.pick(UserDoc, User.getPublicFields())));
}

Service.getToken = getToken;
function getToken(UserDoc, client_id) {
	let query = { _id: client_id, base_path: { $regex: "^" + getBasePath(UserDoc) }, type: User.getUserTypes().runner_client }
	return User.findOne(query)
		.then(UserClientDoc => {
			if (!UserClientDoc)
				return Promise.reject(UserErrors.client_doesnt_exist);

			UserClientDoc.token_counter += 1;
			return UserClientDoc.save();
		})
		.then(UserClientDoc => Promise.resolve({ token: addTokenToUserObject(UserClientDoc) }))
}


Service.getBasePath = getBasePath;
function getBasePath(UserDoc) {
	return UserDoc.base_path ? [
		UserDoc.base_path,
		UserDoc.cursor
	].join(".") : UserDoc.cursor;
}

Service.getApplicationJWTToken
function getApplicationJWTToken() {
	return { exp: Math.floor(Date.now() / 1000) + (Config.security.expiration_minutes) }
}

module.exports = Service