const Config = global.Config;
const LANG = require(Config.paths.lang)
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const validators = require(Config.paths.utils).validators;
const SummaryResultTypes = {
	approved: "Approved",
	repproved: "Repproved",
}

module.exports = {
	SummaryResultTypes,
	name: "Summary",
	schema: {
		cursor: {
			type: "String"
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: [true,LANG.ES.PROJECT_REQUIRED],
			index: true
		},
		test_case: {
			type: Schema.Types.ObjectId,
			ref: "TestCase",
			required: [true,LANG.ES.TEST_CASES_REQUIRED],
			index: true
		},
		moodle_user: {
			type: "Number",
			required: [true,LANG.ES.MOODLE_USER_REQUIRED],
			index: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true,LANG.ES.USER_REQUIRED],
			index: true
		},
		approved: {
			type: "Boolean",
			default: false,
			index: true
		},
		output: {
			type: "String",
			default: ""
		}

	},
}
