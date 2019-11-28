const LANG = require('../lang/es')

module.exports = {
	user_doesnt_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: LANG.USER_DOES_NOT_EXIST_IN_MOODLE
		}
	},
	user_suspended: {
		http_code: 401,
		error: {
			code: -2,
			message: LANG.LOGIN_USER_SUSPENDED
		}
	},
	token_not_valid: {
		http_code: 400,
		error: {
			code: -3,
			message: LANG.LOGIN_TOKEN_INVALID
		}
	},
	login_fail: {
		http_code: 400,
		error: {
			code: -4,
			message: LANG.LOGIN_WRONG
		}
	},
	client_doesnt_exist: {
		http_code: 404,
		error: {
			code: -5,
			message: LANG.LOGIN_CLIENT_DOES_NOT_EXIST
		}
	},
	user_does_not_exist_in_moodle: {
		http_code: 400,
		error: {
			code: -6,
			message: LANG.USER_DOES_NOT_EXIST_IN_MOODLE
		}
	},
}
