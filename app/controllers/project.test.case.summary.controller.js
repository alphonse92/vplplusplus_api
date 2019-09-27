const Config = global.Config;
const moment = require('moment')
const SummaryReportService = require(Config.paths.services + '/project/project.summary.report.service');
const SummaryService = require(Config.paths.services + '/project/project.summary.service');
const UserService = require(Config.paths.services + '/user/user.service');

const getProjectTimelineHOC = (project) => {

	return async (req, res) => {

		const CurrentUser = UserService.getUserFromResponse(res)
		const ProjectService = require(Config.paths.services + '/project/project.service');
		const ProjectDoc = await ProjectService.get(CurrentUser, { _id: project }, { populate: false })

		const {
			from: fromQuery
			, each: eachQuery // each 6 months is a semestre
			, steps: stepsQuery  // take the first forth semestres
			, topic
			, format = "YYYY-MM-DD"
			, type = 'months'
		} = req.query

		let from

		if (!fromQuery) {
			const SummaryModel = SummaryService.getModel()
			const summaryQuery = { project }
			const SummaryDoc = await SummaryModel
				.findOne(summaryQuery)
				.sort({ createdAt: 'desc' })
				.exec()

			from = moment(SummaryDoc.createdAt)

		} else {
			from = moment(fromQuery)
		}

		const each = !eachQuery || eachQuery <= 0 ? 6 : +eachQuery
		const steps = !stepsQuery || stepsQuery <= 0 ? 4 : +stepsQuery
		const reports = []
		const limit = each * steps
		let monthsToSum = each

		while (monthsToSum <= limit) {

			const toMoment = from.clone().add(monthsToSum, type)
			const to = toMoment.format(format)

			const report = await SummaryReportService.getUserReport(CurrentUser, project, undefined, { from: fromQuery, to, topic })
			const lastReport = reports[reports.length - 1] || { skill: 0 }
			const { skill: lastSkill } = lastReport
			const skill = report.length ? report.reduce((sum, userReport) => userReport.skill + sum, 0) / report.length : lastSkill
			const variation = skill - lastSkill
			reports.push({
				from: from,
				to: toMoment,
				tag: to,
				skill,
				variation
			})

			monthsToSum += each
		}

		return { project: ProjectDoc, reports }

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

module.exports.getProjectReportTimeline = getProjectReportTimeline
async function getProjectReportTimeline(req, res, next) {
	try {
		const { id: project } = req.params
		res.send(await getProjectTimelineHOC(project)(req, res))
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


