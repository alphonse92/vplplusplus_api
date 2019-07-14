const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
// const errors = require(Config.paths.errors + "/test∫.errors");
const validators = require(Config.paths.utils).validators;
module.exports = {
	name: "Project",
	schema: {
		cursor: {
			type: "String"
		},
		name: {
			type: "String",
			required: true
		},
		description: {
			type: "String",
			required: true
		},
		is_public: {
			type: "Boolean",
			required: true
		},
		created_by: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		}
	},
}
