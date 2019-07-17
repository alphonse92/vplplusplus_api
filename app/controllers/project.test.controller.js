const Config = global.Config;
const Util = require(Config.paths.utils);
// const ActivityService = require(Config.paths.services + "/activity/activity.service")
const ProjectService = require(Config.paths.services + '/project/project.service');

module.exports.get = get;
function get(req, res, next) {
	res.send("ok project controller")
}

module.exports.create = create;
function create(req, res, next) {
	res.send("ok project controller")
}

module.exports.delete = deleteProject;
function deleteProject(req, res, next) {
	res.send("ok project controller")
}

module.exports.update = update;
function update(req, res, next) {
	res.send("ok project controller")
}

module.exports.compile = compile
async function compile(req, res, next) {
	const CurrentUser = UserService.getUserFromResponse(res)
	const Project = await ProjectService.get(CurrentUser, req.params.id)
	res.send(Project.compile())
}
