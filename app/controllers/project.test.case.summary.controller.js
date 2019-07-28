const Config = global.Config;
const SummaryService = require(Config.paths.services + '/project/project.summary.service');

module.exports.get = get;
function get(req, res, next) {
	res.send("ok project controller")
}

module.exports.create = create;
async function create(req, res, next) {
	try{
		const {
			test_case_id
		} = req.params
		const { moodle_user, data } = req.body
		const SummaryDoc = await SummaryService.create(moodle_user, test_case_id, data)
		res.send(SummaryDoc)
	}catch(e){next(e)}
	
}

module.exports.delete = deleteProject;
function deleteProject(req, res, next) {
	res.send("ok project controller")
}

module.exports.update = update;
function update(req, res, next) {
	res.send("ok project controller")
}

