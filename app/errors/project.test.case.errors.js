const LANG = require('../lang/es')
module.exports = {
	test_case_does_not_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: LANG.TEST_CASES_DOES_NOT_EXIST
		}
	},

}