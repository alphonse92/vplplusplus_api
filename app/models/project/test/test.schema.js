const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const LANG = require('../../../lang/es')
// const errors = require(Config.paths.errors + "/test∫.errors");
const validators = require(Config.paths.utils).validators;
module.exports = {
	name: "Test",
	schema: {
		cursor: {
			type: "String",
			_readOnly: true
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: [true,LANG.PROJECT_REQUIRED],
			_readOnly: true,
			index: true
		},
		name: {
			type: 'String',
			required: true,
			_editable: true
		},
		tags: {
			type: [{ type: 'String' }],
			_editable: true
		},
		description: {
			type: 'String',
			required: true,
			_editable: true
		},
		objective: {
			type: 'String',
			required: true,
			_editable: true
		},
		maxGrade: {
			type: 'Number',
			default: 10,
			min: 0,
		},
		code: {
			type: 'String',
			required: true,
			_editable: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			_readOnly: true,
			index: true
		}
	},
}
