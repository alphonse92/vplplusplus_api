const Config = global.Config;
const moodle_client = require("moodle-client");



module.exports = {
	name:"moodle",
	vpl:"moodle_vpl",
	functions:{
		list_courses:"core_course_get_courses",
		list_module_course:"core_course_get_contents"
	},
	getClient:(token) =>
		moodle_client.init({
			wwwroot:Config.moodle.web.protocol + "://" + Config.moodle.web.host + ":" + Config.moodle.web.port,
			token:token
		})}

