import { pick } from 'lodash'

const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const CourseServiceClass = require(Config.paths.services + '/moodle/moodle.course.service');
const Errors = require(Config.paths.errors + '/project.errors');
const Summary = require(Config.paths.models + "/project/summary/summary.mongo");
const Project = require(Config.paths.models + "/project/project/project.mongo");
const TestService = require('./project.test.service');
const TestCaseService = require('./project.test.case.service');
const Util = require(Config.paths.utils);

class ProjectService extends BaseService {

	constructor() {
		super(Project)
	}

	async get(CurrentUser, query, opts = { throwErrorIfNotExist: true }) {
		try {
			const populates = {
				path: 'tests',
				populate: {
					path: 'test_cases',
					populate: [
						{ path: 'topic' },
						{ path: 'summaries' }
					]
				}
			}
			return await super.get({ ...query, owner: CurrentUser._id }, populates, opts)
		} catch (e) {
			throw new Util.Error(Errors.project_doesnt_exist)
		}
	}

	async listUsingTheRequest(CurrentUser, req) {
		try {
			const queryByOwner = { owner: CurrentUser._id }
			const queryByPublic = { is_public: true }
			const query = { $or: [queryByOwner, queryByPublic] }
			return await super.listUsingTheRequest(req, {}, query)
		} catch (e) {
			console.log(e)
			throw new Util.Error(Errors.project_doesnt_exist)
		}
	}

	list(CurrentUser, query, populates) {
		return super
			.list({ ...query, owner: CurrentUser._id })
			.populate(populates)
	}

	compile(CurrentUser, _id) {
		const { _id: owner } = CurrentUser
		const ProjectDoc = super.get({ owner, _id })
		return ProjectDoc.compile().code
	}

	async create(CurrentUser, data) {
		const { _id, tests = [], ...payloadProject } = data
		const { activity: activity_id } = payloadProject

		if (!activity_id) throw new Util.Error(Errors.activity_does_selected)

		const isUpdate = !!_id
		const project = !isUpdate ? payloadProject : pick(payloadProject, Project.getPublicFields())
		const CourseModule = new CourseServiceClass()
		const activities = await CourseModule.getMyVPLActivitiesWhereImTheTeacher(CurrentUser)
		const activity = activities.find(({ course_module_id }) => course_module_id === activity_id)

		if (!activity) throw new Util.Error(Errors.activity_does_not_exist)

		const ProjectDoc = isUpdate
			? await super.update({ _id, owner: CurrentUser._id }, project)
			: await super.create({ ...project, owner: CurrentUser._id })
		await TestService.createAll(CurrentUser, ProjectDoc, tests)
		return ProjectDoc
	}

	async delete(CurrentUser, projectId) {

		await this.validateHasSummaries(projectId)
		const { _id: owner } = CurrentUser
		const query = { owner, _id: projectId }
		const ProjectDocument = await super.delete(query)
		await TestService.deleteMany({ owner, project: projectId })
		await TestCaseService.deleteMany({ owner, project: projectId })

		return ProjectDocument

	}

	async validateHasSummaries(project) {
		const Summary = require(Config.paths.models + "/project/summary/summary.mongo");
		const ProjectSummaryDoc = await Summary.findOne({ project })
		if (ProjectSummaryDoc) throw new Util.Error(Errors.project_blocked)
	}


	async export(type, CurrentUser, id) {
		let exporter
		try { exporter = require('./exporters/' + type) }
		catch (e) {
			throw new Util.Error(Errors.exporter_does_not_exist)
		}
		const query = { _id: id, owner: CurrentUser._id }
		const ProjectDoc = await super.get(query, [
			{ path: 'owner' },
			{
				path: 'tests',
				populate: {
					path: 'test_cases'
				}
			}
		])
		return exporter(ProjectDoc)
	}
}

module.exports = new ProjectService()