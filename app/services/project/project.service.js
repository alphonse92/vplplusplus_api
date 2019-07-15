const Config = global.Config;
const Util = require(Config.paths.utils);
const Project = require(Config.paths.models + "/project/project/project.mongo");
const TestService = require(Config.paths.services + '/project/project.test.service');
const Service = {}

Service.create = create;
async function create(data) {
	const { _id, tests, ...project } = data
	const isUpdate = !!_id
	const ProjectDoc = isUpdate
		? await Project.findByIdAndUpdate(_id, project, { new: true })
		: await Project.create(project)
	await TestService.createAll(ProjectDoc, tests)
	return ProjectDoc
}

Service.list = list;
function list(UserDoc, req) {
	let id = req.params.id;
	let paginator = Util.mongoose.getPaginatorFromRequest(req, Config.app.paginator);
	let query = Util.mongoose.getQueryFromRequest(req);
	query.owner = UserDoc._id
	console.log('querying ')
	console.log('id', id)
	console.log('query', query)
	console.log('paginator', paginator)
	return Util.mongoose.list(Project, id, query, paginator)
}

module.exports = Service