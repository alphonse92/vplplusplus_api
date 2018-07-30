const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const errors = require(Config.paths.errors + "/user.errors");
const validators = require(Config.paths.utils).validators;
module.exports = {
	name:"Policy",
	resourceNameSeparator:":",
	schema:{
		cursor:{
			type:"String"
		},
		resource:{
			type:"String",
			unique:true,
			index:true,
			required:true
		},
		slug:{
			type:"String",
			required:true
		},
		description:{
			type:"String",
			required:true
		},
		extends:[{type:"String"}],
		actions:[{
				path:{
					type:"String",
				},
				scopes:[{type:"String"}],
				query:{
					type:"String"
				}
			}
		]
	}
}