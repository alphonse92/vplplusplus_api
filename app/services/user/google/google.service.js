

const Util = require(Config.paths.utils);
const { request } = Util

async function verifyAuthToken(token, CLIENT_ID) {
	const requestResponse = await request('get', { url: `https://oauth2.googleapis.com/tokeninfo?id_token=${token}` })
	const tokenData = JSON.parse(requestResponse.body)
	if (tokenData.aud !== CLIENT_ID) throw new Error('Invalid Token')
	return tokenData
}

export {
	verifyAuthToken
}