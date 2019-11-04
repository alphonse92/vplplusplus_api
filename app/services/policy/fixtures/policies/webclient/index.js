const DefaultPolicyService = require("./../../../policy.access-manager.service");
const fixtures = {}

fixtures.showDashboardPage = {
	resource: "client:web:system:webclient.dashboard.show",
	name: "client",
	slug: "See dashboard page",
	type: DefaultPolicyService.types.default,
	description: "Policy for show dashboard page.",
	extends: [], depends: [],
	actions: [
		{ scopes: ["showDashboardPage"] }
	]
}

fixtures.showLabPage = {
	resource: "client:web:system:webclient.lab.show",
	name: "client",
	slug: "See lab page",
	type: DefaultPolicyService.types.default,
	description: "Policy for show lab page.",
	extends: [], depends: [],
	actions: [
		{ scopes: ["showLabPage"] }
	]
}

fixtures.showStudentsPage = {
	resource: "client:web:system:webclient.students.show",
	name: "client",
	slug: "See students page",
	type: DefaultPolicyService.types.default,
	description: "Policy for show students page.",
	extends: [], depends: [],
	actions: [
		{ scopes: ["showStudentPage"] }
	]
}

fixtures.showConfigurationPage = {
	resource: "client:web:system:webclient.configuration.show",
	name: "client",
	slug: "See configuration page",
	type: DefaultPolicyService.types.default,
	description: "Policy for show configuration page.",
	extends: [], depends: [],
	actions: [
		{ scopes: ["showConfigurationPage"] }
	]
}

fixtures.showHelpPage = {
	resource: "client:web:system:webclient.help.show",
	name: "client",
	slug: "See help page",
	type: DefaultPolicyService.types.default,
	description: "Policy for show help page.",
	extends: [], depends: [],
	actions: [
		{ scopes: ["showHelpPage"] }
	]
}

fixtures.showLogoutPage = {
	resource: "client:web:system:webclient.logout.show",
	name: "client",
	slug: "See logout page",
	type: DefaultPolicyService.types.default,
	description: "Policy for show logout page.",
	extends: [], depends: [],
	actions: [
		{ scopes: ["showLogoutPage"] }
	]
}

fixtures.showTopicsPage = {
	resource: "client:web:system:webclient.topics.show",
	name: "client",
	slug: "See topics page to manage the topics",
	type: DefaultPolicyService.types.default,
	description: "Policy for show topics page.",
	extends: [], depends: [],
	actions: [
		{ scopes: ["showTopicsPage"] }
	]
}

fixtures.showApplicationsPage = {
	resource: "client:web:system:webclient.applications.show",
	name: "client",
	slug: "See applications page",
	type: DefaultPolicyService.types.default,
	description: "Policy for show applications page.",
	extends: [], depends: [],
	actions: [
		{ scopes: ["showApplicationsPage"] }
	]
}




module.exports = fixtures