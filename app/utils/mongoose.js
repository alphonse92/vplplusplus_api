import { set } from 'lodash'
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

function parsePathsToPopulates(arrayOfPaths) {
	const reduceArrayOfPathsToPopulateSchema = (out, path, index) => set(out, path, false)
	const parcePopulateSchemaToPopulates =
		obj => Object
			.keys(obj)
			.map(modelName => {
				const children = obj[modelName]
				const hasChildren = !!children
				return { path: modelName, populate: !hasChildren ? [] : parcePopulateSchemaToPopulates(children) }
			})
	const populateSchema = arrayOfPaths.reduce(reduceArrayOfPathsToPopulateSchema, {})
	const populates = parcePopulateSchemaToPopulates(populateSchema)
	return populates
}




module.exports.getPaginatorFromRequest = getPaginatorFromRequest;
function getPaginatorFromRequest(req, defaults = {}, populates) {
	const {
		limit = defaults[paginationAttributes.limit],
		page = defaults[paginationAttributes.page]
	} = req.query
	const reqPopulate = req.query.populate
	const arrayOfPopulates = populates || reqPopulate
		? Array.isArray(reqPopulate)
			? reqPopulate
			: [reqPopulate]
		: []
	const populate = parsePathsToPopulates(arrayOfPopulates)
	const paginator = { limit, page, populate }
	cleanPaginatorAttributesFromRequest(req);
	console.log(paginator)
	return paginator
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

module.exports.createObjectId = () => new ObjectId()