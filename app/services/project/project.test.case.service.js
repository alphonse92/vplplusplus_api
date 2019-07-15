const Config = global.Config;
const Util = require(Config.paths.utils);
const TestCase = require(Config.paths.models + "/project/testCase/testCase.mongo");
const Service = {}

Service.createAll = createAll;
function createAll(test_id, ArrayOfTestCases) {
	return Promise.all(ArrayOfTestCases.map(data => create(test_id, data)))
}

Service.create = create;
async function create(test_id, data) {
	const { _id, test_id: tesIdFromPayload, ...test_case } = data
	const isUpdate = !!_id
	const TestCaseDoc = isUpdate
		? await TestCase.findByIdAndUpdate(_id, test_case, { new: true })
		: await TestCase.create({ ...test_case, test: test_id })
	return TestCaseDoc
}



module.exports = Service