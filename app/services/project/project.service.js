
const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/project.errors');
const Project = require(Config.paths.models + "/project/project/project.mongo");
const TestService = require(Config.paths.services + '/project/project.test.service');
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

	async create(data) {
		const { _id, tests, ...project } = data
		const isUpdate = !!_id
		const ProjectDoc = isUpdate
			? await Project.findByIdAndUpdate(_id, project, { new: true })
			: await Project.create(project)
		await TestService.createAll(ProjectDoc, tests)
		return ProjectDoc
	}

}

module.exports = new ProjectService()