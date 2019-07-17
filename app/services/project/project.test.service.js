const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/project.test.errors');
const Test = require(Config.paths.models + "/project/test/test.mongo");
const TestCaseService = require(Config.paths.services + "/project/project.test.case.service");
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
		return TestDoc.compile()

		// try {
		// 	const { _id: owner } = CurrentUser
		// 	const TestDoc = super.get({ owner, _id })
		// 	return TestDoc.compile()
		// } catch (e) {
		// 	throw new Util.Error(Errors.test_does_not_exist)
		// }


	}

	createAll(ProjectDoc, ArrayOfTestData) {
		return Promise.all(ArrayOfTestData.map(data => this.create(ProjectDoc, data)))
	}

	async create(ProjectDoc, data) {
		const { _id: project_id, owner } = ProjectDoc
		const { _id, test_cases, owner: ownerFromPayload, project_id: projectIdFromPayload, ...test } = data
		const isUpdate = !!_id
		const TestDoc = isUpdate
			? await Test.findByIdAndUpdate(_id, test, { new: true })
			: await Test.create({ ...test, owner, project: project_id })
		await TestCaseService.createAll(TestDoc._id, test_cases)
		return TestDoc
	}

}

module.exports = new TestService()