module.exports.getPaginatorFromRequest = getPaginatorFromRequest;
const paginationAttributes = {
	limit:"limit",
	page:"page",
	sort:"sort"
}

function cleanPaginatorAttributesFromRequest(req){
	if(req.query[paginationAttributes.limit]){
		delete req.query[paginationAttributes.limit];
	}
	if(req.query[paginationAttributes.page]){
		delete req.query[paginationAttributes.page];
	}

	if(req.query[paginationAttributes.sort]){
		delete req.query[paginationAttributes.sort];
	}
}

function getPaginatorFromRequest(req, defaults, populates){
	let pagination = {};
	pagination.limit = +req.query[paginationAttributes.limit] || defaults[paginationAttributes.limit];
	pagination.page = +req.query[paginationAttributes.page] || defaults[paginationAttributes.page];
	pagination.populate = populates || [];
	cleanPaginatorAttributesFromRequest(req);
	return pagination;
}


module.exports.getQueryFromRequest = getQueryFromRequest;
function getQueryFromRequest(req){
	let query = Object.assign({}, req.query)
	return query;
}

module.exports.list = list;
function list(Model, id, query, paginator){
	if(id && !Object.keys(query)){
		return Model.findById(id);
	}

	if(id)
		query._id = id;

	return Model.paginate(query, paginator);
}