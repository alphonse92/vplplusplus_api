const Config = global.Config;
const Util = require(Config.paths.utils);
const Activity = require(Config.paths.models + "/activity/activity.mongo");
const MoodleWebservice = require(Config.paths.webservices + "/moodle.client");

module.exports.getMoodleVplActivitiesCourse = getMoodleVplActivitiesCourse;
function getMoodleVplActivitiesCourse(CurrentUser, courseid){
	let token = CurrentUser.tokens.find(t => t.client === MoodleWebservice.name).token;
	let moodleClient = null;
	return MoodleWebservice.getClient(token)
		.then(client => {
			moodleClient = client;
			let opt = {
				wsfunction:MoodleWebservice.functions.list_courses,
				args:{
					courseid:courseid,
					"options[0][name]":"modname",
					"options[0][value]":"vpl"
				}
			}
			Util.log(opt)
			return moodleClient.call(opt);
		})
		.then(Util.moodle_client.createSyncDocumentFunction(Activity))
}