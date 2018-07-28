const Config = global.Config;
const Util = require(Config.paths.utils);
const UserService = require(Config.paths.services + "/user/user.service")
module.exports.auth = auth;
function auth(req, res, next){
	UserService.auth(req.body.email, req.body.password)
		.then((result) => res.send(result))
		.catch(err => Util.response.handleError(err, res))
}
module.exports.find = find;
function find(req, res, next){

}