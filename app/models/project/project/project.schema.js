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
			_private: true
		},
		name: {
			type: "String",
			required: true,
		},
		description: {
			type: "String",
			required: true
		},
		is_public: {
			type: "Boolean",
			required: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			_private: true
		}
	},
}
