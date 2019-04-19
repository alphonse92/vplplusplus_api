

const Util = require(Config.paths.utils);
const { request, log } = Util

async function verifyAuthToken(token, CLIENT_ID) {
	const requestResponse = await makeRequestToValide(token)
	const { body } = requestResponse
	const requestBodyJSON = getJsonFromBody(body)
	valideClient(requestBodyJSON, CLIENT_ID)
	return requestBodyJSON

}
function throwInvalidTokenError(condition, infoText) {
	if (condition) {
		if (infoText) log(infoText)
		throw new Error('Invalid Token')
	}
}

async function makeRequestToValide(token) {
	try {
		const endpoint = 'https://oauth2.googleapis.com/tokeninfo?id_token='
		const url = `${endpoint}${token}`
		return await request('get', { url })
	} catch (response) {
		log(`invalid status code: ${response.httpResponse.statusCode}`)
		log(`    body: ${response.body}`)
		throwInvalidTokenError(true, )
	}
}
function valideClient(requestBodyJSON, CLIENT_ID) {
	throwInvalidTokenError(requestBodyJSON.aud !== CLIENT_ID, 'Client does not match')
}
function getJsonFromBody(body) {
	try {
		return JSON.parse(body)
	} catch (e) {
		log('Something went wrong trying to validate the token. The response isnt JSON format ')
	}

	throwInvalidTokenError(true)
}

export {
	verifyAuthToken
}