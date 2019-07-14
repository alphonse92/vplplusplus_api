const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
// const errors = require(Config.paths.errors + "/test.errors");
const validators = require(Config.paths.utils).validators;
module.exports = {
	name: "TestCase",
	schema: {
		cursor: {
			type: "String"
		},
		test: {
			type: Schema.Types.ObjectId,
			ref: "Test",
			required: true
		}
	},
}
