const Config = global.Config;
const Policy = require(Config.paths.models + "/policy/policy.mongo");
const Group = require(Config.paths.models + "/policy/policy.group.mongo");
const Util = require(Config.paths.utils)
const GroupFixtures = require("./fixtures/groups");

module.exports.getDefaultGroups = getDefaultGroups;
function getDefaultGroups(){
	return GroupFixtures;
}

module.exports.create = create;
function create(data){
	return Policy.create(data);
}

module.exports.getGroupByArchetype = getGroupByArchetype;
function getGroupByArchetype(archetype){
	return GroupFixtures[archetype];
}

module.exports.createDefaultPoliciesIfNotExist = createDefaultPoliciesIfNotExist;
function createDefaultPoliciesIfNotExist(){
	const env = Config.env;
	const type = Config.app.init.policy;

	let fixtures = require("./fixtures/policies");
	fixtures = Object.keys(fixtures).map(name => fixtures[name]);
	let resources = fixtures.map(p => p.resource);
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


module.exports.createDefaultGroupsIfNotExist = createDefaultGroupsIfNotExist;
function createDefaultGroupsIfNotExist(){
	const env = Config.env;
	const type = Config.app.init.policy;

	let group_fixtures = require("./fixtures/groups");
	group_fixtures = Object.keys(group_fixtures).map(name => group_fixtures[name]);
	let groupNames = group_fixtures.map(group => group.name);
	if(type === "reset"){
		return reset_groups(group_fixtures, groupNames);
	}else if(type === "sync"){
		return sync_groups(group_fixtures, groupNames)
	}

	return add_groups_first_time(group_fixtures, groupNames);
}

function add_groups_first_time(group_fixtures, groupNames){
	Util.log("Adding Groups by first time");
	return Group.find({name:{$in:groupNames}})
		.then(Groups => {
			if(Groups.length !== groupNames.length){
				return reset_groups(group_fixtures, groupNames);
			}
			return Promise.resolve(Groups);
		})
}

function reset_groups(group_fixtures, groupNames){
	Util.log("Reset Groups");
	return Group.remove({name:{$in:groupNames}})
		.then(() => Promise.all(group_fixtures.map(fixture => Group.create(fixture))))
}

function sync_groups(group_fixtures, groupNames){
	Util.log("Syncronicing  Groups");
	return Group.find({name:{$in:groupNames}})
		.then(Groups => {
			let resource_map = Groups.reduce((map, current_group) => {
				map[current_group.name] = true;
				return map;
			}, {})

			let promises = group_fixtures.map(fix => {
				if(!resource_map[fix.name])
					return Group.create(fix)
				return fix;
			})

			return Promise.all(promises);
		})
}

module.exports.getLoadUserPoliciesMiddleware = getLoadUserPoliciesMiddleware;
function getLoadUserPoliciesMiddleware(){
	return (req, res, next) => {
		getPolicies(res.locals.__mv__.user)
			.then(Policies => {
				res.locals.__mv__.policies = Policies || [];
				res.locals.__mv__.capabilities = Policies.reduce((caps, p) => {
					caps[p.name] = true;
					return caps;
				}, {})
				next();
			})
	}
}

module.exports.getPolicies = getPolicies;
function getPolicies(UserDoc){
	return getGroups(UserDoc.groups)
		.then(getPoliciesFromGroups)
		.then(PolicyList => {
			return getPolicy(PolicyList.map(p => p.resource), []);
		});
}

module.exports.getGroups = getGroups;
function getGroups(groups){
	groups = groups || [];
	groups = Array.isArray(groups) ? groups : [groups];
	return Group.find({name:{$in:groups}})
}

module.exports.getPoliciesFromGroups = getPoliciesFromGroups;
function getPoliciesFromGroups(groups){
	let resources = groups.reduce((groupsOut, groups) => {
		groupsOut = groupsOut.concat(groups.policies.map(p => p.resource));
		return groupsOut;
	}, []);
	return Policy.find({resource:{$in:resources}});
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