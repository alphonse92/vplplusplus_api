const Config = global.Config;
const moment = require('moment')
const SummaryReportService = require(Config.paths.services + '/project/project.summary.report.service');
const SummaryService = require(Config.paths.services + '/project/project.summary.service');
const UserService = require(Config.paths.services + '/user/user.service');

const getTimelineVariablesFromQuery = (ProjectDoc, fromQuery, eachQuery, stepsQuery) => {
	const from = fromQuery ? moment(fromQuery) : moment(ProjectDoc.createdAt)
	from.set('hour', 0).set('minute', 0)
	const each = isNaN(eachQuery) ? 6 : (eachQuery * 1)
	const steps = isNaN(stepsQuery) ? 6 : (stepsQuery * 1)
	const limit = each * steps
	return { from, each, steps, limit }
}

const getTimeline = async (CurrentUser, ProjectDoc, opts) => {
	const { format, type, from, each, limit, topic } = opts
	const { name, description, activity, _id } = ProjectDoc
	const reports = []
	const fromString = from.format(format)
	let period = each

	while (period <= limit) {

		const toMoment = from.clone().add(period, type).set('hour', 0).set('minute', 0)
		const to = toMoment.format(format)
		const report = await SummaryReportService.getUserReport(CurrentUser, _id, undefined, { from: fromString, to, topic })
		const lastReport = reports[reports.length - 1] || { skill: 0 }
		const { skill: lastSkill = 0 } = lastReport

		const totalSkill = report.reduce((sum, userReport) => {
			return userReport.skill + sum
		}, 0)

		const skill = totalSkill / report.length
		const variation = skill - lastSkill
		reports.push({
			from: from,
			to: toMoment,
			tag: to,
			skill,
			variation,
			project: { name, description, activity, _id }
		})
		period += each
	}
	return reports
}

const getProjectTimelineHOC = async (project, req, res) => {
	const ProjectService = require(Config.paths.services + '/project/project.service');
	const TopicService = require(Config.paths.services + '/topic/topic.service');

	const {
		from: fromQuery
		, each: eachQuery // each 6 months is a semestre
		, steps: stepsQuery  // take the first forth semestres
		, format = "YYYY-MM-DD"
		, type = 'months'
		, topic = []
		, separeByTopic: separeByTopicString = "false"
	} = req.query


	const CurrentUser = UserService.getUserFromResponse(res)
	const ProjectDoc = await ProjectService.get(CurrentUser, { _id: project }, { populate: false })
	const TopicDocs = await TopicService.list({ name: { $in: topic } })
	const topicMap = TopicDocs.reduce((acc = {}, t) => ({ ...acc, [t.name]: t }), {})

	const separeByTopic = separeByTopicString === 'true'
	const timelineVariables = getTimelineVariablesFromQuery(ProjectDoc, fromQuery, eachQuery, stepsQuery)
	const { name, description, activity } = ProjectDoc

	return async () => {
		if (TopicDocs.length && separeByTopic) {
			const datasets = []
			for (let i = 0; i < TopicDocs.length; i++) {
				const TopicDoc = TopicDocs[i]
				const dataset = await getTimeline(CurrentUser, project, { format, type, ...timelineVariables, topic: [TopicDoc.name ]})
				const label = {
					topic: topicMap[TopicDoc.name],
					project: {
						name,
						description,
						activity
					}
				}
				datasets.push({ label, dataset })
			}

			return { project: ProjectDoc, reports: datasets }

		}
		const TopicNamesArray = TopicDocs.length
			? TopicDocs.map(({ name }) => name)
			: []
		const dataset = await getTimeline(CurrentUser, ProjectDoc, { format, type, ...timelineVariables, topic: TopicNamesArray })
		const reports = [{ label: { project: ProjectDoc.name, topic: TopicDocs }, dataset }]
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
		const { id: projectParam } = req.params
		const { project: projectQuery = [] } = req.query

		const ArrayOfProjectInQueryParams = Array.isArray(projectQuery)
			? projectQuery
			: [projectQuery]

		const ArrayOfProjects = projectParam && !ArrayOfProjectInQueryParams.length
			? [projectParam]
			: ArrayOfProjectInQueryParams

		const results = []

		for (let i = 0; i < ArrayOfProjects.length; i++) {
			const projectId = ArrayOfProjects[i]
			const getTimelineFn = await getProjectTimelineHOC(projectId, req, res)
			const result = await getTimelineFn()
			results.push(result)
		}

		res.send(results)

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


