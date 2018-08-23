/**
 * An activity report represent a Course Activity, regardless of the Course Activity.
 * 
 * Course
 * |__Module activity (see mdl_course_modules eg quiz or vpl activity) 
 *   |_Gradeable Item 
 *   
 * As you now, a student can send multiple submits for a single activity, so
 * the Activity Report Schema should be:
 * 
 * {
 *   _id: ObjectId(..)
 *   id: Course Module activity id
 *   
 * }
 * 
 * 
 * 
 * 
 */

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
