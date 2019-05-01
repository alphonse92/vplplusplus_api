module.exports = {
	siteadministrator: {
		name: "default/siteadministrator",
		default: true,
		policies: [
			//this is the resource for public actions
			{ resource: "service:api:system:all.all" },
			//site administor can change the users
			{ resource: "service:api:system:user.create" },
			{ resource: "service:api:system:user.read" },
			{ resource: "service:api:system:user.update" },
			{ resource: "service:api:system:user.delete" },
			//site administor can change the policies
			{ resource: "service:api:system:policy.create" },
			{ resource: "service:api:system:policy.read" },
			{ resource: "service:api:system:policy.update" },
			{ resource: "service:api:system:policy.delete" },
			//site administor can update and read the api configuration
			{ resource: "service:api:system:configuration.read" },
			{ resource: "service:api:system:configuration.update" },
			{ resource: "service:api:system:user.token" },
			//courses
			{ resource: "service:api:system:course.list" },
			{ resource: "service:api:system:activity.list" },
		]
	},
	manager: {
		name: "default/manager",
		default: true,
		policies: [
			{ resource: "service:api:system:all.all" },
		]
	},
	coursecreator: {
		name: "default/coursecreator",
		default: true,
		policies: [
			{ resource: "service:api:system:all.all" },
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
			{ resource: "service:api:system:all.all" },
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
	teacher: {
		name: "default/teacher",
		default: true,
		policies: [
		{ resource: "service:api:system:all.all" },
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
	student: {
		name: "default/student",
		default: true,
		policies: [
			{ resource: "service:api:system:all.all" },
			{ resource: "service:api:system:course.list" },
			{ resource: "service:api:system:activity.list" },
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
			{ resource: "service:api:system:all.all" },
		]
	},
	user: {
		name: "default/user",
		default: true,
		policies: [
			{ resource: "service:api:system:all.all" },
		]
	},
	frontpage: {
		name: "default/frontpage",
		default: true,
		policies: [
			{ resource: "service:api:system:all.all" },
		]
	},
	runner: {
		name: "default/runner",
		default: true,
		policies: [
			{ resource: "service:api:system:all.all" },
		]
	}
};