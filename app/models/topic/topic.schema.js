const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const LANG = require('../../lang/es')

module.exports = {
	name: "Topic",
	schema: {
		cursor: {
			type: "String",
			_readOnly: true
		},
		name: {
			type: "String",
			required: [true, LANG.TOPIC_NAME_REQUIRED],
			unique: [true, LANG.TOPIC_NAME_UNIQUE],
			index: true,
			maxlength: [10, LANG.TOPIC_NAME_MAX_LENGTH],
			_readOnly: true,
			_editable: true
		},
		description: {
			type: "String",
			required: [true, LANG.TOPIC_DESCRIPTION_REQUIRED],
			maxlength: [255, LANG.TOPIC_DESCRIPTION_MAX_LENGTH],
			_readOnly: true,
			_editable: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, LANG.TOPIC_OWNER_REQUIRED],
			index: true,
			_readOnly: true
		},
		visible: {
			type: "Boolean",
			default: true
		}
	},
}
