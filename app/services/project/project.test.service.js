import { pick } from 'lodash'

const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/project.test.errors');
const Test = require(Config.paths.models + "/project/test/test.mongo");
const TestCaseService = require('./project.test.case.service');

const Util = require(Config.paths.utils);


class TestService extends BaseService {

	constructor() {
		super(Test)
	}

	async listUsingTheRequest(CurrentUser, req) {
		try {
			return await super.listUsingTheRequest(req, {}, { owner: CurrentUser._id })
		} catch (e) {
			throw new Util.Error(Errors.test_does_not_exist)
		}
	}

	async compile(CurrentUser, _id) {
		const { _id: owner } = CurrentUser
		const TestDoc = await super.get({ owner, _id })
		const compiledCode = await TestDoc.compile()
		return compiledCode.code
	}

	createAll(CurrentUser, ProjectDoc, ArrayOfTestData = []) {
		return Promise.all(ArrayOfTestData.map(data => this.create(CurrentUser, ProjectDoc, data)))
	}

	async create(CurrentUser, ProjectDoc, data) { // test data
		const { _id: owner } = CurrentUser
		const { _id: project } = ProjectDoc
		const { _id, test_cases = [], ...testPayload } = data
		const maxGrade = test_cases.reduce((sum, testCase) => (sum + testCase.grade), 0)
		const isUpdate = !!_id
		const test = { ...pick(testPayload, Test.getEditableFields()), maxGrade }
		const TestDoc = isUpdate
			? await super.update({ _id, owner }, test)
			: await super.create({ ...test, owner, project })
		await TestCaseService.createAll(CurrentUser, ProjectDoc, TestDoc, test_cases)
		return TestDoc
	}



	async delete(CurrentUser, project_id, _id) {
		const ProjectService = require(Config.paths.services + '/project/project.service');
		await ProjectService.validateHasSummaries(project_id)
		const { _id: owner } = CurrentUser
		const TestDocument = await super.delete({ owner, project: project_id, _id })
		await TestCaseService.deleteMany({ owner, project: project_id, test: _id })
		return TestDocument
	}



}

module.exports = new TestService()