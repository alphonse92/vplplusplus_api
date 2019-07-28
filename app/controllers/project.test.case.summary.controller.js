const Config = global.Config;
const SummaryService = require(Config.paths.services + '/project/project.summary.service');

module.exports.get = get;
function get(req, res, next) {
	res.send("ok project controller")
}

module.exports.create = create;
async function create(req, res, next) {
	const {
		project_id,
		test_case_id
	} = req.params

	const project = { _id: project_id }
	const testCase = { _id: test_case_id }
	const SummaryDoc = await SummaryService.createAll(project, testCase, req.body)
	res.send(SummaryDoc)
}

module.exports.delete = deleteProject;
function deleteProject(req, res, next) {
	res.send("ok project controller")
}

module.exports.update = update;
function update(req, res, next) {
	res.send("ok project controller")
}

