const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const LANG = require('../../../lang/es')
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
			required: [ true, LANG.TEST_CASE_OWNER_REQUIRED ],
			_readOnly: true,
			index: true
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: [ true, LANG.TEST_CASE_PROJECT_REQUIRED ],
			_readOnly: true,
			index: true
		},
		test: {
			type: Schema.Types.ObjectId,
			ref: "Test",
			required: [ true, LANG.TEST_CASE_TEST_REQUIRED ],
			_readOnly: true,
			index: true
		},
		topic: {
			type: [{
				type: Schema.Types.ObjectId,
				ref: "Topic",
			}],
			required: [ true, LANG.TEST_CASE_TOPIC_REQUIRED ],
			validate: {
				validator: function (v) { return v.length > 0 && v.length < 3 },
				message: LANG.TEST_CASE_TOPIC_RANGE
			},
			_editable: true
		},
		name: {
			type: 'String',
			required: [ true, LANG.TEST_CASE_NAME_REQUIRED ],
			_editable: true
		},
		objective: {
			type: 'String',
			required: [ true, LANG.TEST_CASE_OBJECTIVE_REQUIRED ],
			_editable: true
		},
		successMessage: {
			type: "String",
			required: [ true, LANG.TEST_CASE_SUCESS_MESSAGE_REQUIRED],
			_editable: true
		},
		successMessageLink: {
			type: "String",
			required: [ true, LANG.TEST_CASE_SUCESS_MESSAGE_LINK_REQUIRED],
			_editable: true
		},
		failureMessage: {
			type: "String",
			required: [ true, LANG.TEST_CASE_FAILURE_MESSAGE_REQUIRED],
			_editable: true
		},
		failureMessageLink: {
			type: "String",
			required: [ true, LANG.TEST_CASE_FAILURE_MESSAGE_LINK_REQUIRED],
			_editable: true
		},
		code: {
			type: 'String',
			required: [ true, LANG.TEST_CASE_CODE_REQUIRED],
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




