const LANG = require('../lang/es')
module.exports = {
	blocked: {
		http_code: 400,
		error: {
			code: -1,
			message: LANG.SUMMARY_BLOCKED
		}
	},
	user_is_not_enroled_in_the_activity: {
		http_code: 400,
		error: {
			code: -1,
			message: LANG.SUMMARY_USER_NOT_ENROLED
		}
	},
	teacher_cant_create_summary_for_him_projects: {
		http_code: 202,
		error: {
			code: -1,
			message: LANG.SUMMARY_TEACHER_CANT_SEND_SUMMARIES_TO_HIMSELF
		}
	},
	teacher_activity_no_setted: {
		http_code: 400,
		error: {
			code: -1,
			message: LANG.SUMMARY_ACTIVITY_WASNT_SETTED_TEACHER
		}
	},
	student_activity_no_setted: {
		http_code: 400,
		error: {
			code: -1,
			message: LANG.SUMMARY_ACTIVITY_WASNT_SETTED_STUDENT
		}
	},
}