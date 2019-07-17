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
		},
		name: {
			type: 'String',
			required: true
		},
		objective: {
			type: 'String',
			required: true
		},
		successMessage: {
			type: "String",
			required: true
		},
		successMessageLink: {
			type: "String",
			required: true
		},
		failureMessage: {
			type: "String",
			required: true
		},
		code: {
			type: 'String',
			required: true,
		},
		grade: {
			type: 'Number',
			default: 10,
			min: 0,
		},
		timeout: {
			type: "String",
			default: "Configurator.TIMEOUT_VERY_LONG"
		}
	},
}




