const Config = global.Config;
// const errors = require(Config.paths.errors + "/test.errors");
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const validators = require(Config.paths.utils).validators;
const SummaryResultType = {
	approved: "Approved",
	repproved: "Repproved",
}

module.exports = {
	SummaryResultType,
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
		student: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		score: {
			type: "Number",
			default: 0,
			min: 0,
			max: 10000
		},
		result: {
			enum: Object.keys(SummaryResultType),
			default: SummaryResultType.repproved
		}

	},
}
