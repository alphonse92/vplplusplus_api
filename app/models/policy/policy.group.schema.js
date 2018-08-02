const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const validators = require(Config.paths.utils).validators;
module.exports = {
	name:"PolicyGroup",
	schema:{
		cursor:{
			type:"String"
		},
		default:{
			type:"Boolean",
			required:true,
			default:false,
		},
		name:{
			type:"String",
			required:true,
			unique:true
		},
		policies:[{type:"String"}]
	}
}