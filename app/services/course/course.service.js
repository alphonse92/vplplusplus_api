const Config = global.Config;
const Util = require(Config.paths.utils);
const MoodleWebservice = require(Config.paths.webservices + "/moodle.client");
const Course = require(Config.paths.models + "/course/course.mongo");

module.exports.getMoodleCourses = getMoodleCourses;
function getMoodleCourses(CurrentUser){
	let token = CurrentUser.tokens.find(t => t.client === MoodleWebservice.name).token;
	let moodleClient = null;
	return MoodleWebservice.getClient(token)
		.then(client => {
			moodleClient = client;
			let opt = {wsfunction:MoodleWebservice.functions.list_courses}
			return moodleClient.call(opt)
		})
		.then(Util.moodle_client.createSyncDocumentFunction(Course))
}

