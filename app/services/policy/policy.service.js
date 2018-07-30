const Config = global.Config;
const Policy = require(Config.paths.models + "/policy/policy.mongo");

module.exports.create = create;
function create(data){
	return Policy.create(data);
}

module.exports.createDefaultPoliciesIfNotExist = createDefaultPoliciesIfNotExist;
function createDefaultPoliciesIfNotExist(){
	const env = Config.env;
	const type = Config.app.init.policies;
	const fixtures = require("./fixtures/policies");
	const resources = fixtures.map(p => p.resource);

	if(type === "every_time"){
		return reset_policies(fixtures, resources);
	}else if(type === "sync"){
		sync_policies(fixtures, resources)
	}

	return add_policies_first_time(fixtures, resources);
}

function add_policies_first_time(fixtures, resources){
	return Policy.find({resource:{$in:resources}})
		.then(Policies => {
			if(Policies.length !== resources.length){
				return reset_policies(fixtures, resources);
			}
			return Promise.resolve(Policies);
		})
}

function reset_policies(fixtures, resources){
	return Policy.findAndRemove({resource:{$in:resources}})
		.then(() => {
			return new Promise((resolve, reject) => {
				Policy.collection.insert(fixtures, (err, docs) => {
					if(err)
						return reject(err);
					return resolve(docs);
				})
			})
		})
}

function sync_policies(fixtures, resources){

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
		getPolicies(res.locals.__mv__.user.policies)
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

function getPolicy(srnArray, groupArray){
	groupArray = groupArray || [];
	let policySrnToVisit = Array.isArray(srnArray) ? srnArray : [srnArray];
	let policyGroupsToVisit = Array.isArray(groupArray) ? groupArray : [groupArray];
	return new Promise((resolve, reject) => {
		findRecursiveExtendedPolicy(resolve, reject, policySrnToVisit, policyGroupsToVisit);
	})

}

function findRecursiveExtendedPolicy(resolve, reject, policySrnToVisit, policyGroupsToVisit, policyVisited, policies){
	policyVisited = policyVisited || [];
	policies = policies || [];
	Policy.find(getPolicyQuery(policySrnToVisit, policyGroupsToVisit, policyVisited))
		.then(Policies => {
			if(Policies.length === 0 || !Policies){
				return resolve(policies);
			}
			policySrnToVisit = [];
			policyGroupsToVisit = [];
			Policies.forEach((PolicyDoc) => {
				policyVisited.push(PolicyDoc._id);
				policySrnToVisit = policySrnToVisit.concat(PolicyDoc.extends);
				policies.push(PolicyDoc);
			});
			findRecursiveExtendedPolicy(resolve, reject, policySrnToVisit, policyGroupsToVisit, policyVisited, policies);
		})
		.catch(err => reject(err));
}

function getPolicyQuery(srnArray, groupArray, policyVisited){
	let query = {$and:[
			{
				$or:[
					{resource:{$in:srnArray}}, {groups:{$in:groupArray}}
				]
			},
			{
				_id:{$nin:policyVisited}
			}
		]};

	return query;
}