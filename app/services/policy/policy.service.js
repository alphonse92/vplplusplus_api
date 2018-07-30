const Config = global.Config;
const Policy = require(Config.paths.models + "/policy/policy.mongo");
const Util = require(Config.paths.utils)
module.exports.create = create;
function create(data){
	return Policy.create(data);
}

module.exports.createDefaultPoliciesIfNotExist = createDefaultPoliciesIfNotExist;
function createDefaultPoliciesIfNotExist(){
	const env = Config.env;
	const type = Config.app.init.policy;

	let fixtures = require("./fixtures/policies");
	fixtures = Object.keys(fixtures).map(name => fixtures[name]);
	let resources = fixtures.map(p => p.resource);
	console.log(type)
	if(type === "reset"){
		return reset_policies(fixtures, resources);
	}else if(type === "sync"){
		return sync_policies(fixtures, resources)
	}

	return add_policies_first_time(fixtures, resources);
}

function add_policies_first_time(fixtures, resources){
	Util.log("Adding policies by first time");
	return Policy.find({resource:{$in:resources}})
		.then(Policies => {
			if(Policies.length !== resources.length){
				return reset_policies(fixtures, resources);
			}
			return Promise.resolve(Policies);
		})
}

function reset_policies(fixtures, resources){
	Util.log("Reset Policies");
	return Policy.remove({resource:{$in:resources}})
		.then(() => Promise.all(fixtures.map(fixture => Policy.create(fixture))))
}

function sync_policies(fixtures, resources){
	Util.log("Syncronicing  Policies");
	return Policy.find({resource:{$in:resources}})
		.then(Policies => {
			let resource_map = Policies.reduce((map, curr) => {
				map[curr.resource] = true;
				return map;
			}, {})

			let promises = fixtures.map(fix => {
				if(!resource_map[fix.resource])
					return Policy.create(fix)
				return fix;
			})

			return Promise.all(promises);
		})
}

module.exports.getLoadUserPoliciesMiddleware = getLoadUserPoliciesMiddleware;
function getLoadUserPoliciesMiddleware(){
	return (req, res, next) => {
		const user = res.locals.__mv__.user;
		getPolicies(user.policies)
			.then(Policies => {
				res.locals.__mv__.policies = Policies || [];
				next();
			})
	}
}

module.exports.getPolicies = getPolicies;
function getPolicies(srnArray){
	return getPolicy(srnArray, []);
}

function getPolicy(srnArray){
	let policySrnToVisit = Array.isArray(srnArray) ? srnArray : [srnArray];
	return new Promise((resolve, reject) => {
		findRecursiveExtendedPolicy(resolve, reject, policySrnToVisit);
	})

}

function findRecursiveExtendedPolicy(resolve, reject, resourceToVisit, policyVisited, policies){
	policyVisited = policyVisited || [];
	policies = policies || [];
	Policy.find(getPolicyQuery(resourceToVisit, policyVisited))
		.then(Policies => {
			if(Policies.length === 0 || !Policies){
				return resolve(policies);
			}
			resourceToVisit = [];
			Policies.forEach((PolicyDoc) => {
				policyVisited.push(PolicyDoc._id);
				resourceToVisit = resourceToVisit.concat(PolicyDoc.extends);
				policies.push(PolicyDoc);
			});
			findRecursiveExtendedPolicy(resolve, reject, resourceToVisit, policyVisited, policies);
		})
		.catch(err => reject(err));
}

function getPolicyQuery(resourceArray, policyVisited){
	let query = {
		$and:[
			{$or:[{resource:{$in:resourceArray}}]},
			{_id:{$nin:policyVisited}}
		]};

	return query;
}