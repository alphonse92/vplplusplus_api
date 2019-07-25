import { pick } from 'lodash'

const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/project.errors');
const Project = require(Config.paths.models + "/project/project/project.mongo");

const TestService = require('./project.test.service');
const TestCaseService = require('./project.test.case.service');
const SummaryService = require('./project.summary.service');
const Util = require(Config.paths.utils);

class ProjectService extends BaseService {

	constructor() {
		super(Project)
	}

	async listUsingTheRequest(CurrentUser, req) {
		try {
			const queryByOwner = { owner: CurrentUser._id }
			const queryByPublic = { is_public: true }
			const query = { $or: [queryByOwner, queryByPublic] }
			return await super.listUsingTheRequest(req, {}, query)
		} catch (e) {
			throw new Util.Error(Errors.project_doesnt_exist)
		}
	}

	compile(CurrentUser, _id) {
		const { _id: owner } = CurrentUser
		const ProjectDoc = super.get({ owner, _id })
		return ProjectDoc.compile().code
	}

	async create(CurrentUser, data) {
		const { _id, tests = [], ...payloadProject } = data
		const isUpdate = !!_id
		const project = !isUpdate ? payloadProject : pick(payloadProject, Project.getPublicFields())
		const ProjectDoc = isUpdate
			? await super.update({ _id, owner: CurrentUser._id }, project)
			: await super.create({ ...project, owner: CurrentUser._id })
		await TestService.createAll(CurrentUser, ProjectDoc, tests)
		return ProjectDoc
	}

	async delete(CurrentUser, projectId) {

		await this.validateHasSummaries()
		const { _id: owner } = CurrentUser
		const query = { owner, _id: projectId }
		const ProjectDocument = await super.delete(query)
		await TestService.deleteMany({ owner, project: projectId })
		await TestCaseService.deleteMany({ owner, project: projectId })

		return ProjectDocument

	}

	async validateHasSummaries(projectId) {
		const ProjectSummaries = await SummaryService.list({ project: projectId })
		if (ProjectSummaries.docs.total) throw new Util.Error(Errors.project_blocked)
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