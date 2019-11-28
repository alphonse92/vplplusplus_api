const LANG = require('../lang/es')

module.exports = {
	user_doesnt_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: LANG.USER_DOES_NOT_EXIST_IN_MOODLE
		}
	}
}