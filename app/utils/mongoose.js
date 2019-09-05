
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

function parsePathsToPopulates(arrayOfPaths, selects = {}) {
	const reduceArrayOfPathsToPopulateSchema = (out, path, index) => set(out, path, false)
	const parcePopulateSchemaToPopulates =
		populateSchema => Object
			.keys(populateSchema)
			.map(model => {
				const children = populateSchema[model]
				const hasChildren = !!children
				const selectArray = selects[model] || []
				return {
					path: model,
					select: selectArray.concat('_id'),
					populate: !hasChildren ? [] : parcePopulateSchemaToPopulates(children)
				}
			})
	const populateSchema = arrayOfPaths.reduce(reduceArrayOfPathsToPopulateSchema, {})
	const populates = parcePopulateSchemaToPopulates(populateSchema)
	return populates
}

module.exports.getPaginatorFromRequest = getPaginatorFromRequest;
function getPaginatorFromRequest(req, defaults = {}, populates, selects) {
	const {
		limit: limit4q = defaults[paginationAttributes.limit],
		page: page4q = defaults[paginationAttributes.page]
	} = req.query
	const reqPopulate = req.query.populate
	const arrayOfPopulates = populates || reqPopulate
		? Array.isArray(reqPopulate)
			? reqPopulate
			: [reqPopulate]
		: []
	const limit = (+limit4q) > defaults.limitMax ? defaults.limitMax : +limit4q
	const page = +page4q
	const populate = parsePathsToPopulates(arrayOfPopulates, selects)
	const paginator = { limit, page, populate }
	const querySort = req.query.sort
	if (querySort) {
		paginator.sort = Array.isArray(querySort)
			? querySort.join(" ")
			: querySort.toString()
	}
	cleanPaginatorAttributesFromRequest(req);
	return paginator
}


module.exports.getQueryFromRequest = getQueryFromRequest;
function getQueryFromRequest(req, strict) {
	if (!strict) return { ...req.query }
	const $orArray = Object
		.keys(req.query)
		.reduce(($OrQuery, docAttribute) => {
			const value = req.query[docAttribute]
			const posibleNumber = !isNaN(value)
			const posibleBoolean = value === "true" || value === "false"
			const $or = []
			$or.push({ [docAttribute]: { $regex: value.toLowerCase(), $options: 'i' } })// by default uses a regex
			if (posibleNumber) $or.push({ [docAttribute]: { $eq: Number(value) } }) // it coulde be a number so find by primitive number
			else if (posibleBoolean) $or.push({ [docAttribute]: { $eq: JSON.parse(value) } }) //the same, but with booleans
			return [...$OrQuery, ...$or]
		}, [])


	return $orArray.length
		? { $or: $orArray }
		: null
}

module.exports.list = list;
function list(Model, id, query, paginator) {
	if (id) return Model.findById(id);
	return Model.paginate(query, paginator);
}

module.exports.createObjectId = () => new ObjectId()

module.exports.extractFields = extractFields;
function extractFields(ModelSchema) {
	const { schema: DataSchemaWithFields } = ModelSchema
	return Object
		.keys(DataSchemaWithFields)
		.reduce((obj, docFieldName) => {
			const fieldSchema = DataSchemaWithFields[docFieldName]
			const { _readOnly: read = false, _editable: edit = false } = fieldSchema
			if (read) obj.privateFields.push(docFieldName)
			else if (edit) obj.editableFields.push(docFieldName)
			else obj.publicFields.push(docFieldName)
			return obj
		}, { privateFields: ['_id'], publicFields: ['_id'], editableFields: [] })
}

module.exports.addStatics = addStatics;
function addStatics(Schema, ModelSchema) {
	const { publicFields, privateFields, editableFields } = extractFields(ModelSchema)
	Schema.statics.getPublicFields = () => publicFields
	Schema.statics.getPrivateFields = () => privateFields
	Schema.statics.getEditableFields = () => editableFields
	return Schema
}

function objectToSet(ObjectToBeConverted, shouldAppendParameter, pathMap, options = { array: { evaluatIndexs: false } }) {

	shouldAppendParameter = shouldAppendParameter ? shouldAppendParameter : "";
	for (let key in ObjectToBeConverted) {
		let attNotation = shouldAppendParameter + key;

		if ((!Array.isArray(ObjectToBeConverted[key]) && typeof ObjectToBeConverted[key] !== "object")
			|| (Array.isArray(ObjectToBeConverted[key]) && !options.array.evaluatIndexs)) {
			pathMap[attNotation] = ObjectToBeConverted[key];
		}
		if ((Array.isArray(ObjectToBeConverted[key]) && options.array.evaluatIndexs) ||
			(!Array.isArray(ObjectToBeConverted[key]) && typeof ObjectToBeConverted[key] === "object")) {
			objectToSet(ObjectToBeConverted[key], attNotation + ".", pathMap, options);
		}
	}
}

module.exports.objectToSet = (obj, options) => {
	var out = {};
	objectToSet(obj, '', out, options);
	return out;
}
