const Config = global.Config;
const moment = require('moment')
const SummaryReportService = require(Config.paths.services + '/project/project.summary.report.service');
const UserService = require(Config.paths.services + '/user/user.service');


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

module.exports.getProjectReportTimeline = getProjectReportTimeline
async function getProjectReportTimeline(req, res, next) {
	try {
		const {
			from: fromQuery
			, each: eachQuery // each 6 months is a semestre
			, steps: stepsQuery  // take the first forth semestres
			, id: project_id
			, topic = []
		} = req

		const now = moment()
		const fromMoment = !fromQuery ? now : moment()

		let from, each, steps

		if (now === fromMoment || fromMoment.isBefore(now)) from = now
		if (!eachQuery || eachQuery <= 0) each = 6
		if (!stepsQuery || stepsQuery <= 0) steps = 4

		const reports = []
		for (let i = each; i <= each * steps; i += each) {
			const to = now.clone().add(i, 'months')
			const report = await SummaryReportService.getUserReport(CurrentUser, project_id, undefined, { from, to, topic })
			const stadistics = {
				mostDifficultTest: SummaryReportService.getTestCasesByDifficult(report),
				mostSkilledStudents: SummaryReportService.getTheMostSkilledStudentByTopic(report),
				avg: report.reduce((sum, userReport) => userReport.skill + sum, 0) / report.length
			}
			reports.push(report)
		}

		res.send(reports)
	} catch (e) { next(e) }
}

module.exports.getUserReports = getUserReports
async function getUserReports(req, res, next) {
	try {
		const { moodle_student_id, id: project_id } = req.params
		const { from, to, topic } = req.query
		const opts = { from, to, topic }
		const CurrentUser = UserService.getUserFromResponse(res)

		if (moodle_student_id) return res.send({
			report: await SummaryReportService.getUserReport(CurrentUser, project_id, +moodle_student_id, opts),
			stadistics: {},
			options: opts
		})

		const report = await SummaryReportService.getUserReport(CurrentUser, project_id, undefined, opts)
		const stadistics = {
			mostDifficultTest: SummaryReportService.getTestCasesByDifficult(report),
			mostSkilledStudents: SummaryReportService.getTheMostSkilledStudentByTopic(report),
			avg: report.reduce((sum, userReport) => userReport.skill + sum, 0) / report.length
		}

		res.send({ report, stadistics, options: opts })
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


