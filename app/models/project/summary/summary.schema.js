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
			required: true,
			index: true
		},
		test_case: {
			type: Schema.Types.ObjectId,
			ref: "TestCase",
			required: true,
			index: true
		},
		moodle_user: {
			type: "Number",
			required: true,
			index: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
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
