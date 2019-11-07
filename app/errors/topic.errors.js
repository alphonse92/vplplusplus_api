module.exports = {
	topic_does_not_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: "Topic does not exist"
		}
	},
	topic_already_exists: {
		http_code: 401,
		error: {
			code: -1,
			message: "Topic already exist"
		}
	},
	password_is_required: {
		http_code: 401,
		error: {
			code: -1,
			message: "Password is required"
		}
	},
	topic_has_summaries: {
		http_code: 401,
		error: {
			code: -1,
			message: "Topic has summaries. Please request to the teachers to delete all projects that are using this topic"
		}
	},
}