const LANG = require('../lang/es')
module.exports = {
	test_does_not_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: LANG.PROJECT_DOES_NOT_EXIST
		}
	},

}