const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const errors = require(Config.paths.errors + "/token.errors");
const validators = require(Config.paths.utils).validators;
module.exports = {
	name:"Token",
	schema:{
		cursor:{
			type:"String"
		},
		user:{
			type:Schema.Types.ObjectId,
			ref:"User",
			required:true
		},
		token:{
			type:"String",
			required:true,
		}
	},
}
