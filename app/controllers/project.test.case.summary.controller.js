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
			const ProjectModel = ProjectService.getModel()
			const SummaryDoc = await ProjectModel.findById(project)
			from = moment(SummaryDoc.createdAt)
		} else {
			from = moment(fromQuery)
		}

		from.set('hour', 0).set('minute', 0)

		const each = isNaN(eachQuery) ? 6 : (eachQuery * 1)
		const steps = isNaN(stepsQuery) ? 6 : (stepsQuery * 1)
		const reports = []
		const limit = each * steps
		let period = each

		while (period <= limit) {
			const toMoment = from.clone().add(period, type).set('hour', 0).set('minute', 0)
			const to = toMoment.format(format)
			let report = []

			try {
				report = await SummaryReportService.getUserReport(CurrentUser, project, undefined, { from, to, topic })
				const lastReport = reports[reports.length - 1] || { skill: 0 }
				const { skill: lastSkill } = lastReport
				
				const totalSkill = report.reduce((sum, userReport, idx) => {
					return userReport.skill + sum
				}, 0) / report.length
				const skill = totalSkill / report.length
				const variation = skill - lastSkill
				reports.push({
					from: from,
					to: toMoment,
					tag: to,
					skill,
					variation
				})
			} catch (e) {
				reports.push({
					from: from,
					to: toMoment,
					tag: to,
					skill: 0,
					variation: 0
				})
			}


			period += each
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


