module.exports = {

	user_doesnt_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: "User does not exist"
		}
	},
	user_suspended: {
		http_code: 401,
		error: {
			code: -2,
			message: "You are suspended. Please contact with your teacher or the system administrator"
		}
	},
	token_not_valid: {
		http_code: 400,
		error: {
			code: -3,
			message: "token isnt valid"
		}
	},
	login_fail: {
		http_code: 400,
		error: {
			code: -4,
			message: "Wrong username, email or password"
		}
	},
	client_doesnt_exist: {
		http_code: 404,
		error: {
			code: -5,
			message: "Client doesnt exist"
		}
	},
	user_does_not_exist_in_moodle: {
		http_code: 400,
		error: {
			code: -6,
			message: "There is not a user with the related moodle id"
		}
	},
}