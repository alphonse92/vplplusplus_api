const LANG = require('../lang/es')
module.exports = {
	topic_does_not_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: LANG.TOPIC_DOES_NOT_EXIST
		}
	},
	topic_already_exists: {
		http_code: 401,
		error: {
			code: -1,
			message: LANG.TOPIC_ALREADY_EXIST
		}
	},
	topic_has_summaries: {
		http_code: 401,
		error: {
			code: -1,
			message: LANG.TOPIC_HAS_SUMMARIES
		}
	},
}