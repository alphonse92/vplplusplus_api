const Config = global.Config;
const Util = require(Config.paths.utils);
const PolicyService = require(Config.paths.services + "/policy/policy.service");

module.exports.create = create;
function create(req, res, next){
	let multiple = Array.isArray(req.body);
	req.body = multiple ? req.body : [req.body]

	Promise.all(req.body.map(policyData => {
		return PolicyService.create(req.body).create()
	})).then(PolicyDoc => res.send(multiple ? PolicyDoc : PolicyDoc[0]))
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


