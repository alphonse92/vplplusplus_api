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
	token_doesnt_exist: {
		http_code: 404,
		error: {
			code: -6,
			message: "Token doesnt exist"
		}
	},
	user_clients_already_exists: {
		http_code: 401,
		error: {
			code: -7,
			message: "Cant create the token because the token name is the same than a username of a user."
		}
	},
	required_fields: {
		http_code: 400,
		error: {
			code: -8,
			message: "Please set a name and description"
		}
	}
}
