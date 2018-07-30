const Config = global.Config;
const DefaultPolicyService = require("./policy.access-manager.service");


module.exports.public = {
	resource:"service:api:system:all:all",
	name:"public",
	slug:"Public Resources",
	type:DefaultPolicyService.types.default,
	description:"Policy for public resources. Take care.",
	extends:[],
	actions:[
		//{path:"POST/api/v1/city/", scopes:["readCities"], query:""} //this an example of a public path
	]
};

module.exports.userCreate = {
	resource:"service:api:system:user:create",
	name:"createUser",
	slug:"Create User",
	type:DefaultPolicyService.types.default,
	description:"Policy for create an user manually. If you want add a Moodle user please go to Moodle administration instead",
	extends:[],
	actions:[
		{path:"POST/api/v1/users", scopes:["createUser"], query:""}
	]
};
module.exports.userRead = {
	resource:"service:api:system:user:read",
	name:"readUser",
	slug:"Read Users",
	type:DefaultPolicyService.types.default,
	description:"Policy for Read. This will read only api user. If you want to know more information about some user in moodle, pelase go to Moodle administration",
	extends:[],
	actions:[
		{path:"GET/api/v1/users", scopes:["createUser"], query:""}
	]
};
module.exports.userUpdate = {
	resource:"service:api:system:user:update",
	name:"updateUser",
	slug:"Update User",
	type:DefaultPolicyService.types.default,
	description:"Policy for update an user manually. If you want update a Moodle user please go to Moodle administration instead",
	extends:[],
	actions:[
		{path:"PUT/api/v1/users", scopes:["createUser"], query:""}
	]
};
module.exports.userDelete = {
	resource:"service:api:system:user:delete",
	name:"deleteUser",
	slug:"Delete User",
	type:DefaultPolicyService.types.default,
	description:"Policy for delete an user manually. If you want delete a Moodle user please go to Moodle administration instead",
	extends:[],
	actions:[
		{path:"DELETE/api/v1/users", scopes:["createUser"], query:""}
	]
};
module.exports.policyCreate = {
	resource:"service:api:system:policy:create",
	name:"createPolicy",
	slug:"Create Policy",
	type:DefaultPolicyService.types.default,
	description:"Policy for create an API policy manually.",
	extends:[],
	actions:[
		{path:"POST/api/v1/policies", scopes:["createPolicy"], query:""}
	]
};
module.exports.policyRead = {
	resource:"service:api:system:policy:read",
	name:"readPolicy",
	slug:"Read Policys",
	type:DefaultPolicyService.types.default,
	description:"Policy for read an API policy manually.",
	extends:[],
	actions:[
		{path:"GET/api/v1/policies", scopes:["createPolicy"], query:""}
	]
};
module.exports.policyUpdate = {
	resource:"service:api:system:policy:update",
	name:"updatePolicy",
	slug:"Update Policy",
	type:DefaultPolicyService.types.default,
	description:"Policy for update an API policy manually.",
	extends:[],
	actions:[
		{path:"PUT/api/v1/policies", scopes:["createPolicy"], query:""}
	]
};
module.exports.policyDelete = {
	resource:"service:api:system:policy:delete",
	name:"deletePolicy",
	slug:"Delete Policy",
	type:DefaultPolicyService.types.default,
	description:"Delete for update an API policy manually.",
	extends:[],
	actions:[
		{path:"DELETE/api/v1/policies", scopes:["createPolicy"], query:""}
	]
};
module.exports.configurationRead = {
	resource:"service:api:system:configuration:read",
	name:"readConfiguration",
	slug:"Read Configurations",
	type:DefaultPolicyService.types.default,
	description:"Configuration for read an API configuration manually.",
	extends:[],
	actions:[
		{path:"GET/api/v1/configurations", scopes:["createConfiguration"], query:""}
	]
};
module.exports.configurationUpdate = {
	resource:"service:api:system:configuration:update",
	name:"updateConfiguration",
	slug:"Update Configuration",
	type:DefaultPolicyService.types.default,
	description:"Configuration for update an API configuration manually.",
	extends:[],
	actions:[
		{path:"PUT/api/v1/configurations", scopes:["createConfiguration"], query:""}
	]
};
