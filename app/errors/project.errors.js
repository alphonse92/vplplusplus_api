const ERROR = require('./constants')
const LANG = require('../lang/es')

module.exports = {
	project_doesnt_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: LANG.PROJECT_DOES_NOT_EXIST
		}
	},
	project_blocked: {
		http_code: 400,
		error: {
			code: -2,
			error: { resource: 'project', message: LANG.PROJECT_BLOCKED },
			type: ERROR.TYPE.ACTION_CANT_PERFORM
		}
	},
	exporter_does_not_exist: {
		http_code: 404,
		error: {
			code: -3,
			message: LANG.PROJECT_EXPORTER_DOES_NOT_EXIST
		}
	},
	activity_does_not_exist: {
		http_code: 400,
		error: {
			code: -4,
			message: LANG.PROJECT_ACTIVITY_DOES_NOT_EXIST
		}
	},
	activity_does_selected: {
		http_code: 404,
		error: {
			code: -5,
			error: { resource: 'project.activity', message: LANG.PROJECT_ACTIVITY_HAS_NOT_BEEN_SELECTED },
			type: ERROR.TYPE.NOT_FOUND
		}
	},

}