const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const errors = require(Config.paths.errors + "/user.errors");
const validators = require(Config.paths.utils).validators;
const enums = {
	user_type:["person", "api_client"]
}
module.exports = {
	name:"User",
	publicFields:["_id", "id", "username", "firstname", "lastname", "description", "email"],
	types:{
		person:enums.user_type[0],
		api_client:enums.user_type[1],
	},
	schema:{
		cursor:{
			type:"String"
		},
		type:{
			type:"String",
			enums:enums.user_type
		},
		id:{
			type:"Number",
			required:true,
			index:true,
			min:-1,
			unique:true
		},
		username:{
			type:"String",
			required:true,
			index:true,
			maxlength:64
		},
		firstname:{
			type:"String",
			required:true,
			maxlength:64
		},
		lastname:{
			type:"String",
			required:true,
			maxlength:64
		},
		description:{
			type:"String",
			maxlength:4096
		},
		email:{
			type:"String",
			trim:true,
			index:true,
			validate:{
				validator:validators.email,
				message:"errors.invalid_email.error.userMessage"
			},
			required:true,
			unique:true,
			maxlength:125
		},
		is_site_admin:{
			type:"Boolean",
			default:false
		},
		tokens:[{
				client:{
					type:"String",
					trim:true,
					maxlength:64
				},
				token:{
					type:"String",
					trim:true,
				},
			}],
		roles:[{}],
		groups:[{type:"String"}]
	},
	token:{
		type:"String"
	}
}