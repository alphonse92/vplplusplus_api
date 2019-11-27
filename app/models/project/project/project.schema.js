const Config = global.Config;
const LANG = require(Config.paths.lang)
const Util = require(Config.paths.utils)
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const validators = require(Config.paths.utils).validators;
module.exports = {
	name: "Project",
	schema: {
		cursor: {
			type: "String",
			_readOnly: true
		},
		name: {
			type: "String",
			required: [true, LANG.ES.PROJECT_NAME_REQUIRED],
			_editable: true
		},
		description: {
			type: "String",
			required: [true, LANG.ES.PROJECT_DESCRIPTION],
			_editable: true
		},
		is_public: {
			type: "Boolean",
			default: false,
		},
		activity: {
			type: "Number",
			_editable: true,
		},
		exported: {
			type: "Boolean",
			default: false,
			_editable: false,
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
