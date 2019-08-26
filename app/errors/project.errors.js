const ERROR = require('./constants')
module.exports = {
	project_doesnt_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: "Project does not exist"
		}
	},
	project_blocked: {
		http_code: 404,
		error: {
			code: -2,
			error: { resource: 'project', message: "Project cant be updated or deleted because it was executed before" },
		}
	},
	exporter_does_not_exist: {
		http_code: 404,
		error: {
			code: -3,
			message: "Exporter type does not exist"
		}
	},
	activity_does_not_exist: {
		http_code: 400,
		error: {
			code: -4,
			message: "Cant create the project because the activity does not exist"
		}
	},
	activity_does_selected: {
		http_code: 404,
		error: {
			code: -5,
			error: { resource: 'project.activity', message: "Please set the vpl moodle activity" },
			type: ERROR.TYPE.NOT_FOUND
		}
	},

}