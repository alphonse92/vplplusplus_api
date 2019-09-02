import { pick } from 'lodash'

const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/project.test.case.errors');
const TestCase = require(Config.paths.models + "/project/testCase/testCase.mongo");
const ProjectService = require(Config.paths.services + '/project/project.service');
const Util = require(Config.paths.utils);


class TestCaseService extends BaseService {

	constructor() {
		super(TestCase)
	}

	async list(CurrentUser, query, populates) {

		return super.list({ ...query, owner: CurrentUser._id }, populates)
	}

	async listUsingTheRequest(CurrentUser, req) {
		try {
			return await super.listUsingTheRequest(req, {}, { owner: CurrentUser._id })
		} catch (e) {
			throw new Util.Error(Errors.test_case_does_not_exist)
		}
	}

	async compile(CurrentUser, _id) {
		const { _id: owner } = CurrentUser
		const TestCaseDoc = await super.get({ owner, _id })
		return TestCaseDoc.compile().code
	}

	createAll(CurrentUser, ProjectDoc, TestDoc, ArrayOfTestCases) {
		return Promise.all(ArrayOfTestCases.map(data => this.create(CurrentUser, ProjectDoc, TestDoc, data)))
	}

	async create(CurrentUser, ProjectDoc, TestDoc, data) {
		const { _id, ...testCasePayload } = data
		const { _id: owner } = CurrentUser
		const { _id: project } = ProjectDoc
		const { _id: test } = TestDoc
		const isUpdate = !!_id
		const test_case = pick(testCasePayload, TestCase.getEditableFields())
		const TestCaseDoc = isUpdate
			? await super.update({ _id, owner, project, test }, test_case)
			: await super.create({ ...test_case, owner, project, test })
		return TestCaseDoc
	}

	async delete(CurrentUser, project_id, test_id, _id) {
		const ProjectService = require(Config.paths.services + '/project/project.service');
		await ProjectService.validateHasSummaries(project_id)
		return super.delete({ owner: CurrentUser._id, project: project_id, test: test_id, _id })
	}

}

module.exports = new TestCaseService()