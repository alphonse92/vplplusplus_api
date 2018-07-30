const pathToRegexp = require('path-to-regexp');
const types = {
	default:"default",
	custom:"custom",
}
const pathSeparator = "/"
const resourceNameSeparator = ":";

module.exports.getMiddleware = getMiddleware;
function getMiddleware(opt){
	opt.service = opt.service || "";
	opt.error = opt.error || {http_code:401, error:"Unauthorized"};
	return function(req, res, next){
		let policies = res.locals.__mv__.policies;
		let method = req.method.toUpperCase();
		let url = method + req.originalUrl;
		url = url.replace(/%20/g, "?").split("?")[0];
		let result = getPoliciesAllowed(opt.service, url, policies)
		if(result.allow){
			res.locals.__mv__.policies = result.policies;
			return next();
		}
		res.status(opt.error.http_code, ).send(opt.error.error)
	}

}

module.exports.getPoliciesAllowed = getPoliciesAllowed;
function getPoliciesAllowed(service, action, policies){
	let policiesAllowed = policies.filter(Policy => {
		let resource = Policy.getResource();
		Policy.actions = Policy.actions.filter(Action => {
			let matchWithService = resource.service === service;
			let matchWithAction = pathToRegexp(Action.path).exec(action);
			return matchWithService && matchWithAction;
		})
		return !!Policy.actions.length;
	})

	return {
		allow:!!policiesAllowed.length,
		policies:policiesAllowed
	};
}






module.exports.types = types;