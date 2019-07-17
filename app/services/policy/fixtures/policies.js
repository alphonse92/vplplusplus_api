const Config = global.Config;
const DefaultPolicyService = require("./../policy.access-manager.service");
const WebClientFixtures = require('./policies/webclient')

const fixtures = { ...WebClientFixtures };


/**
 * API Policy
 * 
 * The policy defines an object that controle the access to some resources in some instances.
 * It could be granular or monolitic. You can define a policy (A) with an action for a single endpoint, or 
 * you can create another Policy(B) thats extends policy A, and B could add itselft actions.
 * 
 * Resource:
 * 
 * Resource name policy is a string compose with some usefull and unique information, 
 * each part is separe with a ":"
 * 1:2:3:4:5
 * 
 * 1. Component type: for example "microservice", "core", etc
 * 2. Component name: for example "api"
 * 3. Policy Owner: Owner for this Policy, system is by default
 * 4. Resource name: it can be a model, table, document, etc
 * 5. Operation name: can be created, remove, removeOne, whatever operation that you want to implement
 * 
 * Name:
 * Single name for the policy, it shouldn't visible tu regular user.
 * 
 * Slug:
 * Its a label user friendly
 * 
 * Default:
 * A boolean value thats which indicates if its a default policy. This policy 
 * cant be removed from system.
 * 
 * Description:
 * User friendly description for regular user
 * 
 * Extends:
 * Is an string array composed for policy resource. 
 * 
 * Action:
 * 
 * TODO
 * 
 */

fixtures.public = {
	resource: "service:api:system:public",
	name: "public",
	slug: "Public Resources",
	type: DefaultPolicyService.types.default,
	description: "Policy for public resources. Take care.",
	extends: [], depends: [],
	actions: [
		{ path: "POST/api/v1/users/auth", scopes: ["login"], query: "" } //this an example of a public path
	]
};


fixtures.userRead = {
	resource: "service:api:system:user.read",
	name: "user.read",
	slug: "Read Users",
	type: DefaultPolicyService.types.default,
	description: "Policy for Read. This will read only api user. If you want to know more information about some user in moodle, pelase go to Moodle administration",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/users/:id?", scopes: ["readUser"] }
	]
};

fixtures.createRunnerClient = {
	resource: "service:api:system:user.create",
	name: "user.read",
	slug: "Create User",
	type: DefaultPolicyService.types.default,
	description: "Policy for create an user manually. If you want add a Moodle user please go to Moodle administration instead",
	extends: [], depends: [],
	actions: [
		{ path: "POST/api/v1/users", scopes: ["createClientRunner"], query: "" }
	]
};
fixtures.updateRunnerClient = {
	resource: "service:api:system:user.update",
	name: "user.update",
	slug: "Update User",
	type: DefaultPolicyService.types.default,
	description: "Policy for update an user manually. If you want update a Moodle user please go to Moodle administration instead",
	extends: [], depends: [],
	actions: [
		{ path: "PUT/api/v1/users/:id", scopes: ["updateClientRunner"], query: "" }
	]
};
fixtures.deleteRunnerClient = {
	resource: "service:api:system:user.delete",
	name: "user.delete",
	slug: "Delete User",
	type: DefaultPolicyService.types.default,
	description: "Policy for delete an user manually. If you want delete a Moodle user please go to Moodle administration instead",
	extends: [], depends: [],
	actions: [
		{ path: "DELETE/api/v1/users/:id", scopes: ["deleteClientRunner"], query: "" }
	]
};
fixtures.createClientRunnerToken = {
	resource: "service:api:system:user.token",
	name: "user.token",
	slug: "Get User Client Token",
	type: DefaultPolicyService.types.default,
	description: "Policy for get auth token for a client user",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/users/token/:id", scopes: ["createClientRunnerToken"] }
	]
};

fixtures.policyCreate = {
	resource: "service:api:system:policy.create",
	name: "policy.create",
	slug: "Create Policy",
	type: DefaultPolicyService.types.default,
	description: "Policy for create an API policy manually.",
	extends: [], depends: [],
	actions: [
		{ path: "POST/api/v1/policies", scopes: ["createPolicy"], query: "" }
	]
};

fixtures.policyRead = {
	resource: "service:api:system:policy.read",
	name: "policy.read",
	slug: "Read Policys",
	type: DefaultPolicyService.types.default,
	description: "Policy for read an API policy manually.",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/policies", scopes: ["readPolicy"], query: "" }
	]
};
fixtures.policyUpdate = {
	resource: "service:api:system:policy.update",
	name: "policy.update",
	slug: "Update Policy",
	type: DefaultPolicyService.types.default,
	description: "Policy for update an API policy manually.",
	extends: [], depends: [],
	actions: [
		{ path: "PUT/api/v1/policies", scopes: ["updatePolicy"], query: "" }
	]
};
fixtures.policyDelete = {
	resource: "service:api:system:policy.delete",
	name: "policy.delete",
	slug: "Delete Policy",
	type: DefaultPolicyService.types.default,
	description: "Delete for update an API policy manually.",
	extends: [], depends: [],
	actions: [
		{ path: "DELETE/api/v1/policies", scopes: ["deletePolicy"], query: "" }
	]
};
fixtures.configurationRead = {
	resource: "service:api:system:configuration.read",
	name: "configuration.read",
	slug: "Read Configurations",
	type: DefaultPolicyService.types.default,
	description: "Configuration for read an API configuration manually.",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/configurations", scopes: ["readConfiguration"], query: "" }
	]
};
fixtures.configurationUpdate = {
	resource: "service:api:system:configuration.update",
	name: "configuration.update",
	slug: "Update Configuration",
	type: DefaultPolicyService.types.default,
	description: "Configuration for update an API configuration manually.",
	extends: [], depends: [],
	actions: [
		{ path: "PUT/api/v1/configurations", scopes: ["updateConfiguration"], query: "" }
	]
};

// project
fixtures.listProjects = {
	resource: "service:api:system:project.list",
	name: "project.list",
	slug: "List current project",
	type: DefaultPolicyService.types.default,
	description: "Policy for list projects for a person",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id?", scopes: ["listProject"] }
	]
};

fixtures.compileProject = {
	resource: "service:api:system:project.compile",
	name: "project.compile",
	slug: "Compile project current project",
	type: DefaultPolicyService.types.default,
	description: "Policy for compile project",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/compile", scopes: ["compileProject"] }
	]
};


fixtures.createProjects = {
	resource: "service:api:system:project.create",
	name: "project.create",
	slug: "Create current project",
	type: DefaultPolicyService.types.default,
	description: "Policy for list projects for a person",
	extends: [], depends: [],
	actions: [
		{ path: "POST/api/v1/project/", scopes: ["createProject"] }
	]
};

fixtures.updateProjects = {
	resource: "service:api:system:project.update",
	name: "project.update",
	slug: "Update current project",
	type: DefaultPolicyService.types.default,
	description: "Policy for list projects for a person",
	extends: [], depends: [],
	actions: [
		{ path: "PATCH/api/v1/project/:id", scopes: ["updateProject"] }
	]
};

fixtures.deleteProjects = {
	resource: "service:api:system:project.delete",
	name: "project.delete",
	slug: "Delete current project",
	type: DefaultPolicyService.types.default,
	description: "Policy for list projects for a person",
	extends: [], depends: [],
	actions: [
		{ path: "DELETE/api/v1/project/:id", scopes: ["deleteProject"] }
	]
};


// tests
fixtures.listTest = {
	resource: "service:api:system:test.list",
	name: "test.list",
	slug: "List current test",
	type: DefaultPolicyService.types.default,
	description: "Policy for list projects for a person",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/test/:id?", scopes: ["listTest"] }
	]
};

fixtures.compileTest = {
	resource: "service:api:system:test.compile",
	name: "test.compile",
	slug: "Compile test",
	type: DefaultPolicyService.types.default,
	description: "Policy for compile test",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/test/:id/compile", scopes: ["compileTest"] }
	]
};


fixtures.createTest = {
	resource: "service:api:system:test.create",
	name: "test.create",
	slug: "Create current project",
	type: DefaultPolicyService.types.default,
	description: "Policy for list projects for a person",
	extends: [], depends: [],
	actions: [
		{ path: "POST/api/v1/project/:id/test", scopes: ["createTest"] }
	]
};

fixtures.updateTest = {
	resource: "service:api:system:test.update",
	name: "test.update",
	slug: "Update current test",
	type: DefaultPolicyService.types.default,
	description: "Policy for update test in a project",
	extends: [], depends: [],
	actions: [
		{ path: "PATCH/api/v1/project/:id/test/:id", scopes: ["updateTest"] }
	]
};

fixtures.deleteTest = {
	resource: "service:api:system:test.delete",
	name: "test.delete",
	slug: "Delete current test",
	type: DefaultPolicyService.types.default,
	description: "Policy to delete test in a project",
	extends: [], depends: [],
	actions: [
		{ path: "PATCH/api/v1/project/:id/test/:id", scopes: ["deleteTest"] }
	]
};


// test cases
fixtures.listTestCase = {
	resource: "service:api:system:test.case.list",
	name: "test.list",
	slug: "List current test",
	type: DefaultPolicyService.types.default,
	description: "Policy to get test cases from project",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/test/:id/case/:id?", scopes: ["listTestCase"] }
	]
};

fixtures.createTestCase = {
	resource: "service:api:system:test.case.create",
	name: "test.create",
	slug: "Create current project",
	type: DefaultPolicyService.types.default,
	description: "Policy to create a test case to a project",
	extends: [], depends: [],
	actions: [
		{ path: "POST/api/v1/project/:id/test/:id/case/:id", scopes: ["createTestCase"] }
	]
};

fixtures.updateTestCase = {
	resource: "service:api:system:test.case.update",
	name: "test.update",
	slug: "Update current test",
	type: DefaultPolicyService.types.default,
	description: "Policy for update test case in a project",
	extends: [], depends: [],
	actions: [
		{ path: "PATCH/api/v1/project/:id/test/:id/case/:id", scopes: ["updateTestCase"] }
	]
};

fixtures.deleteTestCase = {
	resource: "service:api:system:test.case.delete",
	name: "test.delete",
	slug: "Delete current test",
	type: DefaultPolicyService.types.default,
	description: "Policy to delete test case from a project",
	extends: [], depends: [],
	actions: [
		{ path: "PATCH/api/v1/project/:id/test/:id/case/:id", scopes: ["deleteTestCase"] }
	]
};



// courses
fixtures.listCourses = {
	resource: "service:api:system:course.list",
	name: "course.list",
	slug: "List current courses",
	type: DefaultPolicyService.types.default,
	description: "Policy for list courses for a person",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/course/", scopes: ["listCourse"] }
	]
};

//activities
fixtures.listActivities = {
	resource: "service:api:system:activity.list",
	name: "activity.list",
	slug: "List current course activities",
	type: DefaultPolicyService.types.default,
	description: "Policy for list activities for a course",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/course/:course_id/activity", scopes: ["listActivities"] }
	]
};

module.exports = fixtures;