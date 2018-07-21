const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const errors = require(Config.paths.errors + "/user.errors");
const validators = require(Config.paths.utils).validators;
module.exports = {
	name:"User",
	schema:{
		cursor:{
			type:"String"
		},
		id:{
			type:"Number",
			required:true,
		},
		username:{
			type:"String",
			required:true,
			maxlength:64
		},
		email:{
			type:"String",
			trim:true,
			validate:{
				validator:validators.email,
				message:"errors.invalid_email.error.userMessage"
			},
			index:true,
			required:true,
			unique:true,
			maxlength:125
		}
	}
}