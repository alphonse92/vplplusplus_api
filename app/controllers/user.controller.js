const Config = global.Config;
const Util = require(Config.paths.utils);
const UserService = require(Config.paths.services + "/user/user.service")
let controller = {};
let decorator = {}

controller.auth = auth;
function auth(req, res, next){
	UserService.auth(req.body.email, req.body.password)
		.then((result) => res.send(result))
		.catch(err => Util.response.handleError(err, res))
}

controller.list = list;
function list(req, res, next){
	UserService.list(res.locals.__mv__.user, req)
		.then(Users => res.send(Users))
		.catch(err => Util.response.handleError(err, res))
}

controller.getToken = getToken;
function getToken(req, res, next){
	UserService.getToken(res.locals.__mv__.user, req.params.id)
		.then(Token => res.send(Token))
		.catch(err => Util.response.handleError(err, res))
}

controller.create = create;
controller.create.capabilities = UserService.create.capabilities;
function create(req, res, next){
	UserService.create(res.locals.__mv__.user, req.body)
		.then(User => res.send(User))
		.catch(err => Util.response.handleError(err, res))
}

//@TODO
//module.exports = Util.mv.createController(controller)
module.exports = createController(controller)
//module.exports = controller



function secureCall(UserCaller, func, args){
	return func.apply(args);
}

function valideCapabilities(){

}

function createController(controller){
	return controller;
}