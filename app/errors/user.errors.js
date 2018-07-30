module.exports = {
	user_doesnt_exist:{
		http_code:404,
		error:{
			code:-1,
			message:"User does not exist"
		}
	},
	user_suspended:{
		http_code:401,
		error:{
			code:-1,
			message:"You are suspended. Please contact with your teacher or the system administrator"
		}
	},
	token_not_valid:{
		http_code:400,
		error:{
			code:-4,
			message:"token isnt valid"
		}
	},
}