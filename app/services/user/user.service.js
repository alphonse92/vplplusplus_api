const Config = global.Config;
const Util = require(Config.paths.utils);
const User = require(Config.paths.models + "/user/user.mongo");
const Policy = require(Config.paths.models + "/policy/policy.mongo");
const jwt = require('jsonwebtoken');
const _ = require("lodash");

module.exports.findOneOrCreate = findOneOrCreate;
function findOneOrCreate(query, data){
	return User.findOne(query)
		.then(UserDocument => {
			if(UserDocument)
				return UserDocument;
			return User.create(data);
		})
}

module.exports.auth = auth;
function auth(email, password){
	const AuthStrategy = require("./strategies/auth/" + Config.moodle.auth.type);
	return AuthStrategy(email, password)
		.then(result => {
			MoodleUserData = result;
			return findOneOrCreate({$or:[{id:MoodleUserData.id}, {email:MoodleUserData.email}]}, MoodleUserData)
		})
		.then(UserDoc => {
			if(UserDoc.id !== MoodleUserData.id){
				UserDoc.id = MoodleUserData.id;
				return UserDoc.save();
			}
			return Promise.resolve(UserDoc);
		})
		.then(UserDoc => {
			let token = _.pick(UserDoc, ["_id", "id", "username"]);
			token.exp = Math.floor(Date.now() / 1000) + (Config.security.expiration_minutes);
			token = jwt.sign(token, Config.security.token);
			UserDoc = UserDoc.toObject();
			UserDoc.token = token;
			return Promise.resolve(UserDoc);
		})
}

module.exports.find = find;
function find(){

}



exports.getPolicies = getPolicies;
function getPolicies(uid){
	let UserDocument = null;
	let Policies = null;
	let Groups = null;

	return User.findById(uid)
		.then(UserDoc => {
			UserDocument = UserDoc;
			let srnArray = UserDoc.policies.map((policy) => policy.srn || policy);
			let groupsArray = UserDoc.groups;
			return getPolicy(srnArray, groupsArray);
		})
		.then(PoliciesDocs => {
			let groupsObject = {};
			PoliciesDocs.forEach(PolicyDoc => {
				PolicyDoc.groups.forEach(PolicyGroup => {
					groupsObject[PolicyGroup] = null; //isnt necesary store something
				});
			});
			Groups = Object.keys(groupsObject)
			Policies = PoliciesDocs;
			return processDynamicPolicies(Policies, UserDocument);
		})
		.then(dynamicPolicies => {
			dynamicPolicies = dynamicPolicies.filter(policy => policy.statements && policy.statements.length > 0)
			let payload = {uid:UserDocument._id, policies:dynamicPolicies, groups:Groups}
			return Promise.resolve(payload);
		})


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
					{srn:{$in:srnArray}}, {groups:{$in:groupArray}}
				]
			},
			{
				_id:{$nin:policyVisited}
			}
		]};

	return query;
}

