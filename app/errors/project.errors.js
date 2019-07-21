module.exports = {
	project_doesnt_exist: {
		http_code: 404,
		error: {
			code: -1,
			message: "Project does not exist"
		}
	},
	project_blocked: {
		http_code: 401,
		error: {
			code: -2,
			message: "Project cant be updated or deleted because it was executed before"
		}
	},
	exporter_does_not_exist: {
		http_code: 404,
		error: {
			code: -3,
			message: "Exporter type does not exist"
		}
	},

}