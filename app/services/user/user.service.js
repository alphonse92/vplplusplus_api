import * as GoogleService from './google/google.service'

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
Service.AuthTypeMap = {
	single: AuthSingle,
	google: AuthGoogle
}

Service.authByType = authByType
async function authByType(authType, data) {
	return Service.AuthTypeMap[authType](data)
}

async function AuthGoogle({ token }) {
	const { client_id } = Config.google
	const TokenInformation = await GoogleService.verifyAuthToken(token, client_id)
	const MoodleAuthStrategy = require("./moodle/auth/" + Config.moodle.auth.type);
	const MoodleUserData = await MoodleAuthStrategy(TokenInformation.email, undefined, false)
	if (MoodleUserData.suspended) throw new Error(UserErrors.user_suspended);
	const type = User.getUserTypes().person
	const query = { $or: [{ id: MoodleUserData.id }, { email: MoodleUserData.email }] }
	const data = { ...MoodleUserData, type }
	const UserDoc = await updateOrCreate(query, data)
	await addGroupsToUser(UserDoc)
	const UserWithPolicies = await getUserWithPolicies(UserDoc)
	return addTokenToUserObject(UserWithPolicies, getJWTConfig())
}

async function AuthSingle({ username, email, password }) {
	const usernameOrEmail = username || email
	const MoodleAuthStrategy = require("./moodle/auth/" + Config.moodle.auth.type);
	const MoodleUserData = await MoodleAuthStrategy(usernameOrEmail, password)
	if (MoodleUserData.suspended) throw new Error(UserErrors.user_suspended);

	const type = User.getUserTypes().person
	const query = { $or: [{ id: MoodleUserData.id }, { email: MoodleUserData.email }] }
	const data = { ...MoodleUserData, type }
	const UserDoc = await updateOrCreate(query, data)
	await addGroupsToUser(UserDoc)
	const UserWithPolicies = await getUserWithPolicies(UserDoc)
	return addTokenToUserObject(UserWithPolicies, getJWTConfig())
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
	const currentUser = await User.findOne(query).exec()
	return !currentUser
		? User.create(data)
		: User.findByIdAndUpdate({ _id: currentUser._id }, data, { new: true })
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
			data.id = Date.now() * -1
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
		[User.getUserTypes().api_client]: payload => User.findById(payload._id),
		[User.getUserTypes().runner_client]: payload => User.findOne({ _id: payload._id, token_counter: payload.token_counter }),
	}

	return types[type]
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
			}).then(payload => getUserFromTokenByUserType(payload.type)(payload))
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
async function create(CurrentUser, client, tokenOpts) {
	let data = require("./fixtures/runner");
	data = Object.assign(data, _.pick(client, User.getFillableFields()))
	data.id = -1 * Date.now();
	data.email = data.username + "@" + Config.web.host;
	data.type = User.getUserTypes().api_client;
	data.base_path = getBasePath(CurrentUser);
	const UserDoc = await User.create(data)
	const UserWithToken = addTokenToUserObject(UserDoc.toObject(), tokenOpts)
	return UserWithToken
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
	return Util.mongoose.paginate(User, id, query, paginator)
}
/**
 * This function doesnt lists the moodle users. The vpl API isnt a moodle client.
 * This function only list moodle's users for vpl api clients, and it api roles.
 */
Service.delete = _delete;
function _delete(UserDoc, client_id) {
	let query = { _id: client_id, base_path: { $regex: "^" + getBasePath(UserDoc) }, type: User.getUserTypes().api_client }
	return User.findOneAndRemove(query)
		.then(UserDoc => Promise.resolve(_.pick(UserDoc, User.getPublicFields())));
}

Service.getToken = getToken;
function getToken(UserDoc, client_id) {
	let query = { _id: client_id, base_path: { $regex: "^" + getBasePath(UserDoc) }, type: User.getUserTypes().api_client }
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

Service.getJWTConfig = getJWTConfig
function getJWTConfig() {
	const opts = {}
	const { expiration_minutes } = Config.security
	const getExp = (minutes) => Math.floor(Date.now() / 1000) + minutes
	if (expiration_minutes !== 'NEVER' && !Number.isNaN(expiration_minutes)) opts.exp = getExp(expiration_minutes)
	else if (Number.isNaN(expiration_minutes)) opts.exp = getExp(60 * 60 * 24)
	return opts
}

Service.getUserFromResponse = getUserFromResponse
function getUserFromResponse(res) {
	return res.locals.__mv__.user
}


Service.getUserTypes = getUserTypes
function getUserTypes() {
	return User.getUserTypes()
}

module.exports = Service