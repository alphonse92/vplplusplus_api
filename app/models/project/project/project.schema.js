const Config = global.Config;
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
			required: true,
			_editable: true
		},
		description: {
			type: "String",
			required: true,
			_editable: true
		},
		is_public: {
			type: "Boolean",
			default: false,
			_editable: true
		},
		activity: {
			type: "Number",
			required: true,
			_editable: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			_readOnly: true
		}
	},
}
