const Config = global.Config;
const Errors = require(Config.paths.errors + "/common.errors");
const Util = require(Config.paths.utils);

class BaseService {

  constructor(Model) {
    this.Model = Model
  }

  getModel() {
    return this.Model
  }

  async get(query, populates = [], opts = { throwErrorIfNotExist: true }) {
    const document = await this.Model.findOne(query).populate(populates)
    if (!document && opts.throwErrorIfNotExist) throw new Util.Error(Errors.document_does_not_exist, { model: this.Model.collection.collectionName })
    return document
  }

  list(query = {}) {
    return this.Model.find(query)
  }

  async listUsingTheRequest2(req, MapOfSelectFieldFromPopulates, baseQuery = {}) {
    const id = req.params.id;
    const paginator = Util.mongoose.getPaginatorFromRequest(req, Config.app.paginator, MapOfSelectFieldFromPopulates);
    const optionalParametersPassedByQuery = Util.mongoose.getQueryFromRequest(req, true)
    const query = { $and: [baseQuery].concat(optionalParametersPassedByQuery ? optionalParametersPassedByQuery : []) }
    const data = await Util.mongoose.list(this.Model, id, query, paginator)
    if (id && !data) throw new Util.Error(Errors.document_does_not_exist, { model: this.Model.collection.collectionName })
    return data
  }

  async listUsingTheRequest(req, MapOfSelectFieldFromPopulates, baseQuery) {
    const id = req.params.id;
    const paginator = Util.mongoose.getPaginatorFromRequest(req, Config.app.paginator, MapOfSelectFieldFromPopulates);
    const query = { ...Util.mongoose.getQueryFromRequest(req), ...baseQuery };
    const data = await Util.mongoose.list(this.Model, id, query, paginator)
    if (id && !data) throw new Util.Error(Errors.document_does_not_exist, { model: this.Model.collection.collectionName })
    return data
  }

  createAll(ArrayOfData) {
    const set = Array.isArray(ArrayOfData) ? ArrayOfData : [ArrayOfData]
    return Promise.all(set.map(this.create))
  }

  async create(data) {
    try {
      return await this.Model.create(data)
    } catch (e) { throw new Util.Error(e, { model: this.Model.collection.collectionName }, { model: this.Model.collection.collectionName }) }

  }

  async update(query, data, opts = { throwErrorIfNotExist: true }) {

    let document
    
    try { document = await this.Model.findOneAndUpdate(query, Util.mongoose.objectToSet(data), { new: true, runValidators: true }) }
    catch (e) { throw new Util.Error(e, { model: this.Model.collection.collectionName }, { model: this.Model.collection.collectionName }) }

    if (!document && opts.throwErrorIfNotExist) throw new Util.Error(Errors.document_does_not_exist, { model: this.Model.collection.collectionName })
    return document
  }

  async delete(query, opts = { throwErrorIfNotExist: true }) {
    const document = await this.Model.findOneAndDelete(query)
    if (!document && opts.throwErrorIfNotExist) throw new Util.Error(Errors.document_does_not_exist, { model: this.Model.collection.collectionName })
    return document
  }

  deleteMany(query) {
    return this.Model.deleteMany(query)
  }

}

module.exports = BaseService