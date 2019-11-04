const TeacherPoliciesGroup = require('./groups/teacher');
const AdminPoliciesGroup = require('./groups/admin');
const RunnerPoliciesGroup = require('./groups/runner');
const StudentPoliciesGroup = require('./groups/student');

module.exports = {
	runner: {
		name: "default/runner",
		default: true,
		policies: RunnerPoliciesGroup
	},
	siteadministrator: {
		name: "default/siteadministrator",
		default: true,
		policies: AdminPoliciesGroup
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
		]
	},
	editingteacher: {
		name: "default/editingteacher",
		default: true,
		policies: TeacherPoliciesGroup
	},
	teacher: {
		name: "default/teacher",
		default: true,
		policies: TeacherPoliciesGroup
	},
	student: {
		name: "default/student",
		default: true,
		policies: StudentPoliciesGroup
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