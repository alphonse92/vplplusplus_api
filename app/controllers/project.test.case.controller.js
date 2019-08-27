const Config = global.Config;
const UserService = require(Config.paths.services + '/user/user.service');
const TestCaseService = require(Config.paths.services + '/project/project.test.case.service');


module.exports.get = get;
async function get(req, res, next) {
	try {
		res.send('ok')
	} catch (e) {
		next(e)
	}

}

module.exports.compile = compile
async function compile(req, res, next) {
	try {
		res.send('ok')
	} catch (e) {
		next(e)
	}

}

module.exports.create = create;
async function create(req, res, next) {
	try {
		res.send('ok')
	} catch (e) { next(e) }

}

module.exports.delete = deleteTestCase;
async function deleteTestCase(req, res, next) {
	try {
		const { project_id, test_id, id } = req.params
		const CurrentUser = UserService.getUserFromResponse(res)
		const Test = await TestCaseService.delete(CurrentUser, project_id, test_id, id)
		res.send(Test)
	} catch (e) { next(e) }

}

module.exports.update = update;
async function update(req, res, next) {
	try {
		res.send('ok')
	} catch (e) { next(e) }
}

