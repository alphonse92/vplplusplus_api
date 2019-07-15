const ObjectId = require('mongoose').Types.ObjectId;
const paginationAttributes = {
	limit: "limit",
	page: "page",
	sort: "sort"
}

function cleanPaginatorAttributesFromRequest(req) {
	if (req.query[paginationAttributes.limit]) {
		delete req.query[paginationAttributes.limit];
	}
	if (req.query[paginationAttributes.page]) {
		delete req.query[paginationAttributes.page];
	}

	if (req.query[paginationAttributes.sort]) {
		delete req.query[paginationAttributes.sort];
	}

	if (req.query.populate) {
		delete req.query.populate;
	}
}

module.exports.getPaginatorFromRequest = getPaginatorFromRequest;
function getPaginatorFromRequest(req, defaults, populates) {
	let pagination = {};
	const reqPopulate = req.query.populate
	pagination.limit = +req.query[paginationAttributes.limit] || defaults[paginationAttributes.limit];
	pagination.page = +req.query[paginationAttributes.page] || defaults[paginationAttributes.page];
	// please change it because it does not allows to populate recorsivelly 
	pagination.populate = populates || reqPopulate
		? Array.isArray(reqPopulate)
			? reqPopulate
			: [reqPopulate]
		: []
	pagination.populate = pagination.populate.map(path => ({ path }))
	cleanPaginatorAttributesFromRequest(req);
	return pagination;
}


module.exports.getQueryFromRequest = getQueryFromRequest;
function getQueryFromRequest(req) {
	let query = Object.assign({}, req.query)
	return query;
}

module.exports.list = list;
function list(Model, id, query, paginator) {
	if (id && !Object.keys(query)) return Model.findById(id);
	if (id) query._id = id;
	return Model.paginate(query, paginator);
}

module.exports.createObjectId = () => new ObjectId();