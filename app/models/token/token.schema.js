const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const LANG = require('../../lang/es')

module.exports = {
	name: "Token",
	schema: {
		cursor: {
			type: "String",
			_readOnly: true
		},
		name: {
			type: "String",
			required: [ true , LANG.TOKEN_NAME ] ,
			maxlength: 255,
			_readOnly: true
		},
		description: {
			type: "String",
			required: [ true , LANG.TOKEN_DESCRIPTION_REQUIRED ] ,
			maxlength: 255,
			_readOnly: true
		},
		token: {
			type: "String",
			required: [ true , LANG.TOKEN_TOKEN_REQUIRED ] ,
			_readOnly: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [ true , LANG.TOKEN_USER_REQUIRED ] ,
			_readOnly: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [ true , LANG.TOKEN_OWNER_REQUIRED ] ,
			_readOnly: true
		}
	},
}
