import { pick } from 'lodash'

const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/project.errors');
const Project = require(Config.paths.models + "/project/project/project.mongo");
const TestService = require(Config.paths.services + '/project/project.test.service');
const SummaryService = require(Config.paths.services + '/project/project.summary.service');
const Util = require(Config.paths.utils);

class ProjectService extends BaseService {

	constructor() {
		super(Project)
	}

	async listUsingTheRequest(CurrentUser, req) {
		try {
			return await super.listUsingTheRequest(req, {}, { owner: CurrentUser._id })
		} catch (e) {
			throw new Util.Error(Errors.project_doesnt_exist)
		}
	}

	compile(CurrentUser, _id) {
		const { _id: owner } = CurrentUser
		const ProjectDoc = super.get({ owner, _id })
		return ProjectDoc.compile()
	}

	async create(CurrentUser, data) {
		const { _id, tests = [], ...payloadProject } = data
		const project = pick(payloadProject, Project.getPublicFields())
		const isUpdate = !!_id
		const ProjectDoc = isUpdate
			? await super.update({ _id, owner: CurrentUser._id }, project)
			: await super.create({ ...project, owner: CurrentUser._id })
		await TestService.createAll(CurrentUser, ProjectDoc, tests)
		return ProjectDoc
	}

	async delete(CurrentUser, projectId) {

		await this.validateHasSummaries()

		const query = { owner: CurrentUser._id, _id: projectId }
		const ProjectDocument = await super.delete(query)
		await TestService.deleteMany(query)
		await TestCaseService.deleteMany(query)

		return ProjectDocument

	}

	async validateHasSummaries(projectId) {
		const ProjectSummaries = await SummaryService.list({ project: projectId })
		if (ProjectSummaries.docs.total) throw new Util.Error(Errors.project_blocked)
	}

}

module.exports = new ProjectService()