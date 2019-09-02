const ERROR = require('./constants')
module.exports = {
	document_does_not_exist: {
		http_code: 404,
		error: {
			code: -1,
			error: { resource: 'document', message: "Document not found" },
			type: ERROR.TYPE.NOT_FOUND
		}
	}
}