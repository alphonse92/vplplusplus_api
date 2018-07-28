const Config = global.Config;
const Policy = require(Config.paths.models + "/policy/policy.mongo");
module.exports.create = create;
function create(data){
	return Policy.create(data);
}
