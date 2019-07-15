const Config = global.Config;
const Util = require(Config.paths.utils);
const Test = require(Config.paths.models + "/project/test/test.mongo");
const TestCaseService = require(Config.paths.services + "/project/project.test.case.service");

const Service = {}

Service.createAll = createAll;
function createAll(ProjectDoc, ArrayOfTestData) {
	return Promise.all(ArrayOfTestData.map(data => create(ProjectDoc, data)))
}

Service.create = create;
async function create(ProjectDoc, data) {
	const { _id: project_id, owner } = ProjectDoc
	const { _id, test_cases, owner: ownerFromPayload, project_id: projectIdFromPayload, ...test } = data
	const isUpdate = !!_id
	const TestDoc = isUpdate
		? await Test.findByIdAndUpdate(_id, test, { new: true })
		: await Test.create({ ...test, owner, project: project_id })
	await TestCaseService.createAll(TestDoc._id, test_cases)
	return TestDoc
}



module.exports = Service