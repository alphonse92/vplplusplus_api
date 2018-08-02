const request = require("request");
module.exports = function(method, reqOptions){
	return new Promise((resolve, reject) => {
		let req = request[method](reqOptions, function(err, httpResponse, body){
			var httpResponse = httpResponse || {};
			var statusCode = httpResponse.statusCode;
			let reqInfo = {httpResponse, body, err};
			return statusCode !== 200 ? reject(reqInfo) : resolve(reqInfo);
		})
	});
}