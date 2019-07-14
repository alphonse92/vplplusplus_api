const Config = global.Config;
const Util = require(Config.paths.utils);
// const ActivityService = require(Config.paths.services + "/activity/activity.service")

module.exports.get = get;
function get(req, res, next) {
	res.send("ok project controller")
}
