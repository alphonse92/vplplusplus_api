const Config = global.Config;
const moodle_client = require("moodle-client");

const getUrl = () => Config.moodle.web.protocol + "://" + Config.moodle.web.host + ":" + Config.moodle.web.port
const name = "moodle"
const vpl = "moodle_vpl"
const functions = {
	list_courses: "core_course_get_courses",
	list_module_course: "core_course_get_contents"
}
const getClient = (token) =>
	moodle_client.init({ wwwroot: getUrl(), token: token })

module.exports = {
	name,
	vpl,
	functions,
	getUrl,
	getClient
}

