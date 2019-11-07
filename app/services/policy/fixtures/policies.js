import { Admin } from './policies/index'

const DefaultPolicyService = require("./../policy.access-manager.service");
const WebClientFixtures = require('./policies/webclient')
const fixtures = { ...WebClientFixtures, ...Admin };


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
		{ path: "POST/api/v1/users/auth", scopes: ["login", "logout"], query: "" } //this an example of a public path
	]
};

if (Config.app.open_development_endpoint) {
	fixtures.public.actions.push(
		{ path: "POST/api/v1/dev/:action/", scopes: ["devEndpoint"], query: "" }
	)
}


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
	description: "Policy for list projects for a person. The main differece between it and project.get, is b/c this endpoint return all projects, just name and _id",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/list/", scopes: ["listProject"] }
	]
};
fixtures.listProjects = {
	resource: "service:api:system:project.get",
	name: "project.get",
	slug: "Get current projects",
	type: DefaultPolicyService.types.default,
	description: "Policy for get projects for a person",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id?", scopes: ["getProjects"] }
	]
};

fixtures.compileProject = {
	resource: "service:api:system:project.compile",
	name: "project.compile",
	slug: "Compile current project",
	type: DefaultPolicyService.types.default,
	description: "Policy for compile project",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/compile", scopes: ["compileProject"] }
	]
};

fixtures.exportProject = {
	resource: "service:api:system:project.export",
	name: "project.export",
	slug: "Export current project",
	type: DefaultPolicyService.types.default,
	description: "Policy for compile project",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/export/:type", scopes: ["exportProject"] }
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
		{ path: "DELETE/api/v1/project/:id/test/:id", scopes: ["deleteTest"] }
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
		{ path: "DELETE/api/v1/project/:id/test/:id/case/:id", scopes: ["deleteTestCase"] }
	]
};

// project reports

fixtures.getReportProjects = {
	resource: "service:api:system:projects.report.list",
	name: "project.report.user",
	slug: "Create a user report from summaries",
	type: DefaultPolicyService.types.default,
	description: "Create user report from the all projects",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/report/", scopes: ["getReportProjects"] }
	]
};
fixtures.getReportProjectsUsers = {
	resource: "service:api:system:projects.report.user.list",
	name: "project.report.user",
	slug: "Create a user report from summaries",
	type: DefaultPolicyService.types.default,
	description: "Create user report from the all projects",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/report/user/", scopes: ["getReportProjectsUsers"] }
	]
};

fixtures.getReportProjectsUser = {
	resource: "service:api:system:projects.report.user.get",
	name: "project.report.user",
	slug: "Create a user report from summaries",
	type: DefaultPolicyService.types.default,
	description: "Create user report from the all projects",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/report/user/:moodle_student_id/", scopes: ["getReportProjectsUser"] }
	]
};
fixtures.getReportProjectsUsersEvolution = {
	resource: "service:api:system:projects.report.user.evolution.list",
	name: "project.report.user",
	slug: "Create a user report from summaries",
	type: DefaultPolicyService.types.default,
	description: "Create user report from the all projects",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/report/user/evolution/", scopes: ["getReportProjectsUsersEvolution"] }
	]
};
fixtures.getReportProjectsUserEvolution = {
	resource: "service:api:system:projects.report.user.evolution.get",
	name: "project.report.user",
	slug: "Create a user report from summaries",
	type: DefaultPolicyService.types.default,
	description: "Create user report from the all projects",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/report/user/:moodle_student_id/evolution/", scopes: ["getReportProjectsUserEvolution"] }
	]
};


fixtures.getReportProject = {
	resource: "service:api:system:project.report.get",
	name: "project.report.user",
	slug: "Create a user report from summaries",
	type: DefaultPolicyService.types.default,
	description: "Create user report from the all projects",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/report/", scopes: ["getReportProject"] }
	]
};
fixtures.getReportProjectTimeline = {
	resource: "service:api:system:project.report.timeline",
	name: "project.report.user",
	slug: "Get report project timeline",
	type: DefaultPolicyService.types.default,
	description: "Can create the timeline dataset for a project",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/report/timeline/", scopes: ["getReportProjectTimeline"] }
	]
};
fixtures.getReportStudentTimeline = {
	resource: "service:api:system:student.report.timeline",
	name: "student.report.timeline",
	slug: "Get student report timeline",
	type: DefaultPolicyService.types.default,
	description: "Can create the timeline dataset for a student",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/report/user/:moodle_student_id/timeline/", scopes: ["getReportStudentTimeline"] }
	]
};
fixtures.getReportTopicTimeline = {
	resource: "service:api:system:topic.report.timeline",
	name: "topic.report.timeline",
	slug: "Get topic report timeline",
	type: DefaultPolicyService.types.default,
	description: "Can create the timeline dataset for all topics",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/report/topic/timeline/", scopes: ["getReportTopicTimeline"] }
	]
};
fixtures.topicGet = {
	resource: "service:api:system:topic.get",
	name: "topic.report.timeline",
	slug: "Get topic report timeline",
	type: DefaultPolicyService.types.default,
	description: "Can create the timeline dataset for all topics",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/topic/", scopes: ["getTopics"] }
	]
};

fixtures.getReportProjectUsers = {
	resource: "service:api:system:project.report.user.list",
	name: "project.report.user",
	slug: "Create a user report from summaries",
	type: DefaultPolicyService.types.default,
	description: "Create user report from the all projects",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/report/user/", scopes: ["getReportProjectUsers"] }
	]
};
fixtures.getReportProjectUser = {
	resource: "service:api:system:project.report.user.get",
	name: "project.report.user",
	slug: "Create a user report from summaries",
	type: DefaultPolicyService.types.default,
	description: "Create user report from the all projects",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/project/:id/report/user/:moodle_student_id", scopes: ["getReportProjectUser"] }
	]
};

// test summaries

fixtures.createTestSummary = {
	resource: "service:api:system:test.case.summary.create",
	name: "test.case.summary.create",
	slug: "Create a user summary for a test case resolution",
	type: DefaultPolicyService.types.default,
	description: "Policy for create a user summary for a test case resolution",
	extends: [], depends: [],
	actions: [
		{ path: "POST/api/v1/project/test/case/summary/", scopes: ["createSummary"] }
	]
};

//activities

fixtures.listActivities = {
	resource: "service:api:system:course.activity.list",
	name: "activity.list",
	slug: "List current course activities",
	type: DefaultPolicyService.types.default,
	description: "Policy for list activities",
	extends: [], depends: [],
	actions: [
		{ path: "GET/api/v1/course/activities", scopes: ["listMoodleActivities"] }
	]
};

module.exports = fixtures;