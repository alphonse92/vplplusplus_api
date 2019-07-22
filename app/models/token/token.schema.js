const Config = global.Config;
const Util = require(Config.paths.utils)
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const validators = require(Config.paths.utils).validators;
module.exports = {
	name: "Token",
	schema: {
		cursor: {
			type: "String",
			_readOnly: true
		},
		name: {
			type: "String",
			required: true,
			maxlength: 255,
			_readOnly: true
		},
		description: {
			type: "String",
			required: true,
			maxlength: 255,
			_readOnly: true
		},
		token: {
			type: "String",
			required: true,
			_readOnly: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			_readOnly: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			_readOnly: true
		}
	},
}
