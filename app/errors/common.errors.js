const ERROR = require('./constants')
const LANG = require('../lang/es')

module.exports = {
	document_does_not_exist: {
		http_code: 404,
		error: {
			code: -1,
			error: { resource: 'document', message: LANG.DOCUMENT_DOESNT_EXIST },
			type: ERROR.TYPE.NOT_FOUND
		}
	}
}