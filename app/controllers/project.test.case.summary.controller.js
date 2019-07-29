const Config = global.Config;
const SummaryService = require(Config.paths.services + '/project/project.summary.service');

module.exports.get = get;
function get(req, res, next) {
	res.send("ok project controller")
}

module.exports.create = create;
async function create(req, res, next) {
	try {
		const { project, moodle_user, data } = req.body
		const SummaryDoc = await SummaryService.createAll(project, moodle_user, data)
		res.send(SummaryDoc)
	} catch (e) { next(e) }

}

module.exports.delete = deleteProject;
function deleteProject(req, res, next) {
	res.send("ok project controller")
}

module.exports.update = update;
function update(req, res, next) {
	res.send("ok project controller")
}

