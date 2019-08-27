const Config = global.Config;
const UserService = require(Config.paths.services + '/user/user.service');

const TestService = require(Config.paths.services + '/project/project.test.service');


module.exports.get = get;
async function get(req, res, next) {
	try {
		const CurrentUser = UserService.getUserFromResponse(res)
		const Tests = await TestService.listUsingTheRequest(CurrentUser, req)
		res.send(Tests)
	} catch (e) {
		next(e)
	}

}

module.exports.compile = compile
async function compile(req, res, next) {
	try {
		const CurrentUser = UserService.getUserFromResponse(res)
		const code = await TestService.compile(CurrentUser, req.params.id)
		res.send(code)
	} catch (e) {
		next(e)
	}

}

module.exports.create = create;
async function create(req, res, next) {
	try {
		const CurrentUser = UserService.getUserFromResponse(res)
		const testPayload = { ...req.body, owner: CurrentUser._id }
		const Test = await TestService.create(testPayload)
		res.send(Test)
	} catch (e) { next(e) }

}

module.exports.delete = deleteTest;
async function deleteTest(req, res, next) {
	try {
		const { project_id, id } = req.params
		const CurrentUser = UserService.getUserFromResponse(res)
		const Test = await TestService.delete(CurrentUser, project_id, id, true )
		res.send(Test)
	} catch (e) { next(e) }

}

module.exports.update = update;
async function update(req, res, next) {
	try {
		res.send("ok test controller")
	} catch (e) { next(e) }
}

