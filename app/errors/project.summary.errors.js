module.exports = {
	blocked: {
		http_code: 400,
		error: {
			code: -1,
			message: "Summary cant be updated or deleted because it was executed before"
		}
	},
	user_is_not_enroled_in_the_activity: {
		http_code: 400,
		error: {
			code: -1,
			message: "Cant create the summary because the user is not enroled to the activity related to the project"
		}
	},

}