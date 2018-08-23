const Config = global.Config;
const Util = require(Config.paths.utils);
const CourseService = require(Config.paths.services + "/course/course.service")

module.exports.getCourses = getCourses;
function getCourses(req, res, next){
	CourseService.getMoodleCourses(res.locals.__mv__.user)
		.then((result) => res.send(result))
		.catch(err => Util.response.handleError(err, res))
}