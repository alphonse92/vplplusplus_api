const Config = global.Config;
const moment = require('moment')
const SummaryReportService = require(Config.paths.services + '/project/project.summary.report.service');
const UserService = require(Config.paths.services + '/user/user.service');

const getProjectTimelineHOC = (project) => {
	return (req, res, next) => {
		try {
			const {
				from: fromQuery
				, each: eachQuery // each 6 months is a semestre
				, steps: stepsQuery  // take the first forth semestres
				, topic
				, format = "YYYY-MM-DD"
			} = req.query

			const now = moment()
			const from = !fromQuery ? now : moment(fromQuery, format)
			const each = !eachQuery || eachQuery <= 0 ? 6 : +eachQuery
			const steps = !stepsQuery || stepsQuery <= 0 ? 4 : +stepsQuery
			const CurrentUser = UserService.getUserFromResponse(res)
			const reports = []
			const limit = each * steps
			let monthsToSum = each

			while (monthsToSum <= limit) {

				const toMoment = from.clone().add(monthsToSum, 'months')

				const month = toMoment.get('month')
				const year = toMoment.get('year')
				const tag = `${month + 1}/${year}`

				const to = toMoment.format(format)

				const report = await SummaryReportService.getUserReport(CurrentUser, project, undefined, { from: fromQuery, to, topic })
				const lastReport = reports[reports.length - 1] || { skill: 0 }
				const { skill: lastSkill } = lastReport
				const skill = report.length ? report.reduce((sum, userReport) => userReport.skill + sum, 0) / report.length : lastSkill
				const variation = skill - lastSkill
				reports.push({
					from: fromQuery,
					to,
					tag,
					skill,
					variation
				})

				monthsToSum += each
			}

			res.send(reports)

		} catch (e) { next(e) }
	}
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

module.exports.getProjectsTimeline = getProjectsTimeline
async function getProjectsTimeline(req, res, next) {
	getProjectTimelineHOC(req.query.project)(req, res, next)
}

module.exports.getProjectReportTimeline = getProjectReportTimeline
async function getProjectReportTimeline(req, res, next) {
	getProjectTimelineHOC(req.params.project_id)(req, res, next)
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


