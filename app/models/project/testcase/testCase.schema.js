const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;

/**
 * Topic is the most minimal part of a test, is a specific assesment to 
 * check the stundent habilities
 */

module.exports = {
	name: "TestCase",
	schema: {
		cursor: {
			type: "String",
			_readOnly: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			_readOnly: true
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
			_readOnly: true
		},
		test: {
			type: Schema.Types.ObjectId,
			ref: "Test",
			required: true,
			_readOnly: true
		},
		topic: {
			type: [{
				type: Schema.Types.ObjectId,
				ref: "Topic",
			}],
			required: true,
			_readOnly: true,
			_editable: true
		},
		name: {
			type: 'String',
			required: true,
			_editable: true
		},
		objective: {
			type: 'String',
			required: true,
			_editable: true
		},
		successMessage: {
			type: "String",
			required: true,
			_editable: true
		},
		successMessageLink: {
			type: "String",
			required: true,
			_editable: true
		},
		failureMessage: {
			type: "String",
			required: true,
			_editable: true
		},
		failureMessageLink: {
			type: "String",
			required: true,
			_editable: true
		},
		code: {
			type: 'String',
			required: true,
			_editable: true
		},
		grade: {
			type: 'Number',
			default: 10,
			min: 0,
			_editable: true
		},
		timeout: {
			type: "String",
			default: "Configurator.TIMEOUT_VERY_LONG",
			_editable: true
		}
	},
}




