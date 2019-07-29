const Config = global.Config;
const mongoose = require(Config.paths.db + "/mongo");
const Schema = mongoose.Schema;
const errors = require(Config.paths.errors + "/user.errors");
const validators = require(Config.paths.utils).validators;
const enums = {
	user_type: ["person", "api_client", "runner_client"]
}
const types = {
	person: enums.user_type[0],
	api_client: enums.user_type[1],
	runner_client: enums.user_type[2],
}

const EmailSchema = {
	type: "String",
	trim: true,
	index: true,
	required: true,
	unique: true,
	maxlength: 125
}

module.exports = {
	name: "User",
	publicFields: ["_id", "id", "username", "firstname", "lastname", "description", "email", "type", "token_counter"],
	fillableFields: ["username", "firstname", "lastname", "description", "email", "groups"],
	tokenizerFields: ["_id", "id", "username", "type", "token_counter"],
	types: types,
	schema: {
		cursor: {
			type: "String"
		},
		type: {
			type: "String",
			enums: enums.user_type
		},
		id: {
			type: "Number",
			required: true,
			index: true,
			unique: true
		},
		username: {
			type: "String",
			validate: validators.alphaNumeric,
			required: true,
			index: true,
			maxlength: 64
		},
		firstname: {
			type: "String",
			required: true,
			maxlength: 64
		},
		lastname: {
			type: "String",
			required: true,
			maxlength: 64
		},
		description: {
			type: "String",
			default: "Description was not provided",
			maxlength: 4096
		},
		email: { ...EmailSchema },
		email_linked: { ...EmailSchema, index: false, unique: false, required: false, default: null },
		is_site_admin: {
			type: "Boolean",
			default: false
		},
		roles: {
			type: [{}],
			default: []
		},
		groups: [{ type: "String" }],
		base_path: {
			type: "String",
			default: null
		}
	},
}