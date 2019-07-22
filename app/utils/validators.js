const validator = require('validator')
module.exports = {
	email: {
		validator: v => validator.isEmail(v),
		message: props => `${props.value} is a not valid email`
	},
	alphaNumeric: {
		validator: v => validator.isAlphanumeric(v),
		message: props => `${props.value} must be a alphanumeric value`
	},
	ObjectId: function (v) {
		const ObjectId = require('mongoose').Types.ObjectId;
		try {
			new ObjectId(v);
			return true;
		} catch (e) {
			return false;
		}
	}
}