const Config = global.Config;
const Util = require(Config.paths.utils);
const UserService = require(Config.paths.services + "/user/user.service")
module.exports.auth = auth;
function auth(req, res, next){
	UserService.auth(req.body.email, req.body.password)
		.then((result) => res.send(result))
		.catch(err => Util.response.handleError(err, res))
}
module.exports.list = list;
function list(req, res, next){
	Util.log(res.locals.__mv__.policies)
	UserService.list(req)
		.then(Users => res.send(Users))
		.catch(err => Util.response.handleError(err, res))
}

module.exports.createClient = createClient;
function createClient(req, res, next){
	UserService.createClient(res.locals.__mv__.user, req.body)
		.then(User => res.send(User))
		.catch(err => Util.response.handleError(err, res))
}

module.exports.listClient = listClient;
function listClient(req, res, next){
	UserService.listClient(req)
		.then(Users => res.send(Users))
		.catch(err => Util.response.handleError(err, res))
}