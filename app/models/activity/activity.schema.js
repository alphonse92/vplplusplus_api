const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
//const errors = require(Config.paths.errors + "/course.errors");
const validators = require(Config.paths.utils).validators;

module.exports = {
	name:"Activity",
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
		section_id:{
			type:"Number",
			required:true,
		},
		section_name:{
			type:"String",
			required:true,
		},
		section_visible:{
			type:"Boolean",
			default:true
		},
		section_uservisible:{
			type:"Boolean",
			default:true
		},
		course_id:{
			type:Schema.Types.ObjectId,
			ref:"Course",
			required:true
		},
		url:{
			type:"String",
			required:true,
		},
		name:{
			type:"String",
			required:true,
		},
		visible:{
			type:"Boolean",
			default:true
		},
		uservisible:{
			type:"Boolean",
			default:true
		},
		visibleoncoursepage:{
			type:"Boolean",
			default:true
		},
	},
}