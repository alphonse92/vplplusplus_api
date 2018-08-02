const Config = global.Config;
const moodle_client = require("moodle-client");

module.exports = {
	name:"moodle",
	getClient:(username, password) =>
		moodle_client.init({
			wwwroot:Config.moodle.web.host,
			username:username,
			password:password
		})}

