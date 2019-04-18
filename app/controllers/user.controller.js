const Config = global.Config;
const Util = require(Config.paths.utils);
const UserService = require(Config.paths.services + "/user/user.service")
const controller = {};

controller.auth = auth;
async function auth(req, res, next) {
	try {
		const authType = Object.keys(req.body)[0]
		const data = req.body[authType]
		const response = await UserService.authByType(authType, data)
		res.send(response)
	} catch (err) {
		Util.response.handleError(err, res)
	}
}

controller.list = list;
function list(req, res, next) {
	UserService.list(res.locals.__mv__.user, req)
		.then(Users => res.send(Users))
		.catch(err => Util.response.handleError(err, res))
}

controller.getToken = getToken;
function getToken(req, res, next) {
	UserService.getToken(res.locals.__mv__.user, req.params.id)
		.then(Token => res.send(Token))
		.catch(err => Util.response.handleError(err, res))
}

// controller.create.capabilities = UserService.create.capabilities;
controller.create = create;
function create(req, res, next) {
	UserService.create(res.locals.__mv__.user, req.body)
		.then(User => res.send(User))
		.catch(err => Util.response.handleError(err, res))
}


controller.delete = _delete;
function _delete(req, res, next) {
	UserService.delete(res.locals.__mv__.user, req.params.id)
		.then(User => res.send(User))
		.catch(err => Util.response.handleError(err, res))
}

//@TODO
//module.exports = Util.mv.createController(controller)
// it will fetch the policies groups and etc to valide access to the controllers
// module.exports = createController(controller)

module.exports = controller


