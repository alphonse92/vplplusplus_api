const Config = global.Config;
const Util = require(Config.paths.utils);
// const ActivityService = require(Config.paths.services + "/activity/activity.service")
const ProjectService = require(Config.paths.services + '/project/project.service');
const UserService = require(Config.paths.services + '/user/user.service');

module.exports.get = get;
async function get(req, res, next) {
	const CurrentUser = UserService.getUserFromResponse(res)
	const Projects = await ProjectService.list(CurrentUser, req)
	res.send(Projects)
}

module.exports.create = create;
async function create(req, res, next) {
	const CurrentUser = UserService.getUserFromResponse(res)
	const projectPayload = { ...req.body, owner: CurrentUser._id }
	const Project = await ProjectService.create(projectPayload)
	res.send(Project)
}

module.exports.delete = deleteProject;
async function deleteProject(req, res, next) {
	res.send("ok project controller")
}

module.exports.update = update;
async function update(req, res, next) {
	res.send("ok project controller")
}

