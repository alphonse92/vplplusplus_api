module.exports = {
	runner: {
		name: "default/runner",
		default: true,
		policies: [
			{ resource: "service:api:system:test.case.summary.create" }
		]
	},
	siteadministrator: {
		name: "default/siteadministrator",
		default: true,
		policies: [
			//this is the resource for public actions
			{ resource: "service:api:system:public" },
			//site administor can change the users,
			{ resource: "service:api:system:user.read" },
			// site administrator can manage the application tokens
			{ resource: "service:api:system:token.list" },
			{ resource: "service:api:system:token.create" },
			{ resource: "service:api:system:token.delete" },
			// site administrator can manage the application tokens
			{ resource: "service:api:system:topic.list" },
			{ resource: "service:api:system:topic.create" },
			{ resource: "service:api:system:topic.delete" },
			//site administor can change the policies
			{ resource: "service:api:system:policy.create" },
			{ resource: "service:api:system:policy.read" },
			{ resource: "service:api:system:policy.update" },
			{ resource: "service:api:system:policy.delete" },
			//site administor can update and read the api configuration
			{ resource: "service:api:system:configuration.read" },
			{ resource: "service:api:system:configuration.update" },
			{ resource: "service:api:system:user.token" },

		]
	},
	manager: {
		name: "default/manager",
		default: true,
		policies: [
			{ resource: "service:api:system:public" },
		]
	},
	coursecreator: {
		name: "default/coursecreator",
		default: true,
		policies: [
			{ resource: "service:api:system:public" },
			{ resource: "service:api:system:course.list" },
			{ resource: "service:api:system:activity.list" },
			{ resource: "client:web:system:webclient.dashboard:show" },
			{ resource: "client:web:system:webclient.lab:show" },
			{ resource: "client:web:system:webclient.students:show" },
			{ resource: "client:web:system:webclient.configuration:show" },
			{ resource: "client:web:system:webclient.help:show" },
			{ resource: "client:web:system:webclient.logout:show" },
		]
	},
	editingteacher: {
		name: "default/editingteacher",
		default: true,
		policies: [
			{ resource: "service:api:system:public" },
			// students
			{ resource: "service:api:system:user.student.list" },
			// projects
			{ resource: "service:api:system:project.list" },
			{ resource: "service:api:system:project.compile" },
			{ resource: "service:api:system:project.export" },
			{ resource: "service:api:system:project.create" },
			{ resource: "service:api:system:project.update" },
			{ resource: "service:api:system:project.delete" },
			// tests
			{ resource: "service:api:system:test.list" },
			{ resource: "service:api:system:test.compile" },
			{ resource: "service:api:system:test.create" },
			{ resource: "service:api:system:test.update" },
			{ resource: "service:api:system:test.delete" },
			// tests cases
			{ resource: "service:api:system:test.case.list" },
			{ resource: "service:api:system:test.case.compile" },
			{ resource: "service:api:system:test.case.create" },
			{ resource: "service:api:system:test.case.update" },
			{ resource: "service:api:system:test.case.delete" },
			// summaries
			{ resource: "service:api:system:test.case.summary.list" },
			// Topics
			{ resource: "service:api:system:topic.list" },
			//activities
			{ resource: "service:api:system:course.activity.list" },
			// web client
			{ resource: "client:web:system:webclient.dashboard:show" },
			{ resource: "client:web:system:webclient.lab:show" },
			{ resource: "client:web:system:webclient.students:show" },
			{ resource: "client:web:system:webclient.configuration:show" },
			{ resource: "client:web:system:webclient.help:show" },
			{ resource: "client:web:system:webclient.logout:show" },

		]
	},
	teacher: {
		name: "default/teacher",
		default: true,
		policies: [
			{ resource: "service:api:system:public" },
			// students
			{ resource: "service:api:system:user.student.list" },
			// projects
			{ resource: "service:api:system:project.list" },
			{ resource: "service:api:system:project.compile" },
			{ resource: "service:api:system:project.export" },
			{ resource: "service:api:system:project.create" },
			{ resource: "service:api:system:project.update" },
			{ resource: "service:api:system:project.delete" },
			// tests
			{ resource: "service:api:system:test.list" },
			{ resource: "service:api:system:test.compile" },
			{ resource: "service:api:system:test.create" },
			{ resource: "service:api:system:test.update" },
			{ resource: "service:api:system:test.delete" },
			// tests cases
			{ resource: "service:api:system:test.case.list" },
			{ resource: "service:api:system:test.case.compile" },
			{ resource: "service:api:system:test.case.create" },
			{ resource: "service:api:system:test.case.update" },
			{ resource: "service:api:system:test.case.delete" },
			// summaries
			{ resource: "service:api:system:test.case.summary.list" },
			// Topics
			{ resource: "service:api:system:topic.list" },
			//activities
			{ resource: "service:api:system:course.activity.list" },
			// web client
			{ resource: "client:web:system:webclient.dashboard:show" },
			{ resource: "client:web:system:webclient.lab:show" },
			{ resource: "client:web:system:webclient.students:show" },
			{ resource: "client:web:system:webclient.configuration:show" },
			{ resource: "client:web:system:webclient.help:show" },
			{ resource: "client:web:system:webclient.logout:show" },
		]
	},
	student: {
		name: "default/student",
		default: true,
		policies: [
			{ resource: "service:api:system:public" },
			// students
			{ resource: "service:api:system:user.teacher.list" },
			// projects
			{ resource: "service:api:system:project.list" },
			// tests cases
			{ resource: "service:api:system:test.case.list" },
			// summaries
			{ resource: "service:api:system:test.case.summary.list" },
			// Topics
			{ resource: "service:api:system:topic.list" },
			//activities
			{ resource: "service:api:system:course.activity.list" },
			// web client
			{ resource: "client:web:system:webclient.dashboard:show" },
			{ resource: "client:web:system:webclient.configuration:show" },
			{ resource: "client:web:system:webclient.help:show" },
			{ resource: "client:web:system:webclient.logout:show" },
		]
	},
	guest: {
		name: "default/guest",
		default: true,
		policies: [
			{ resource: "service:api:system:public" },
		]
	},
	user: {
		name: "default/user",
		default: true,
		policies: [
			{ resource: "service:api:system:public" },
		]
	},
	frontpage: {
		name: "default/frontpage",
		default: true,
		policies: [
			{ resource: "service:api:system:public" },
		]
	}
};