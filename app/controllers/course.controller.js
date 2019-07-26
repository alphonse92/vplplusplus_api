const Config = global.Config;
const UserService = require(Config.paths.services + "/user/user.service")


module.exports.getActivities = getActivities;
async function getActivities(req, res, next) {
	try {
		const MoodleCourseServiceClass = require(Config.paths.services + "/moodle/moodle.course.service");
		const MCourseService = new MoodleCourseServiceClass()
		const CurrentUser = UserService.getUserFromResponse(res)
		const MyActivities = await MCourseService.getMyVPLActivitiesWhereImTheTeacher(CurrentUser)
		res.send(MyActivities)
	} catch (e) {
		next(e)
	}
}


