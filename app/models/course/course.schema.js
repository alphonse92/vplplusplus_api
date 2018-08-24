const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
//const errors = require(Config.paths.errors + "/course.errors");
const validators = require(Config.paths.utils).validators;

module.exports = {
	name:"Course",
	schema:{
		cursor:{
			type:"String"
		},
		id:{
			type:"Number",
			required:true,
			index:true,
			unique:true
		},
		shortname:{
			type:"String",
			required:true,
		},
		fullname:{
			type:"String",
			required:true,
		},
		displayname:{
			type:"String",
			required:true,
		},
		summary:{
			type:"String",
			default:"Summary was not provided"
		},
		timemodified:{
			type:"string",
			default:null
		}
	},
}