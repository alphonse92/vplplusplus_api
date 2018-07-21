const Config = global.Config;
const Util = require(Config.paths.utils);
const User = require(Config.paths.models + "/user.model");

module.exports.create = create;
function create(req, res, next){

}
module.exports.auth = auth;
function auth(req, res, next){
	User.auth(req.body.email, req.body.password)
		.then((result) => res.send(result))
		.catch(err => Util.response.handleError(err, res))
}
module.exports.find = find;
function find(req, res, next){

}
module.exports.update = update;
function update(req, res, next){

}
module.exports.delete = _delete;
function _delete(req, res, next){

}


