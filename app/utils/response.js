module.exports.handleError = handleError;
function handleError(error2handle, res){
	console.log(error2handle)
	let http_code = error2handle.http_code || 500;
	let error = error2handle.error || error2handle;
	if(!res.headersSent)
		res.status(http_code).send(error);
}
