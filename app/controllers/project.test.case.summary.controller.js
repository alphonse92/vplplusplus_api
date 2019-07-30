const Config = global.Config;
const SummaryReportService = require(Config.paths.services + '/project.summary.report.service');

module.exports.getReportProject = getReportProject
async function getReportProject(req, res, next) {
	try {
		res.send("ok project controller")
	} catch (e) { next(e) }
}

module.exports.getUserReports = getUserReports
async function getUserReports(req, res, next) {
	try {
		const { moodle_student_id, id: project_id } = req.params
		const { from, to } = req.query
		const opts = { from, to }
		const report = await SummaryReportService.getUserReport(CurrentUser, project_id, moodle_student_id, opts)
		res.send(report)
	} catch (e) { next(e) }
}

module.exports.getUserEvolution = getUserEvolution
async function getUserEvolution(req, res, next) {
	try {
		res.send("ok project controller")
	} catch (e) { next(e) }
}

module.exports.getUserReportFromProject = getUserReportFromProject
async function getUserReportFromProject(req, res, next) {
	try {
		res.send("ok project controller")
	} catch (e) { next(e) }
}


