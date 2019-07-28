const Config = global.Config;
// const errors = require(Config.paths.errors + "/test.errors");
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
			required: true
		},
		test_case: {
			type: Schema.Types.ObjectId,
			ref: "TestCase",
			required: true
		},
		moodle_user: {
			type: "Number",
			required: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null
		},
		approved: {
			type: "Boolean",
			default: false
		},
		output: {
			type: "String",
			default: ""
		}

	},
}
