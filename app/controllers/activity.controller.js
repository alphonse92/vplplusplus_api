const Config = global.Config;
const Util = require(Config.paths.utils);
const ActivityService = require(Config.paths.services + "/activity/activity.service")


module.exports.getMoodleVplActivitiesCourse = getMoodleVplActivitiesCourse;
function getMoodleVplActivitiesCourse(req, res, next){
	ActivityService.getMoodleVplActivitiesCourse(res.locals.__mv__.user,req.params.course_id)
		.then(Users => res.send(Users))
		.catch(err => Util.response.handleError(err, res))
}
