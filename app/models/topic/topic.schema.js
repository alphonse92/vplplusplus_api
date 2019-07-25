const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;

module.exports = {
	name: "Topic",
	schema: {
		cursor: {
			type: "String",
			_readOnly: true
		},
		name: {
			type: "String",
			required: true,
			maxlength: 10,
			_readOnly: true
		},
		description: {
			type: "String",
			required: true,
			maxlength: 255,
			_readOnly: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			_readOnly: true
		},
		deleted_at: {
			type: "Date",
			default: null
		}
	},
}
