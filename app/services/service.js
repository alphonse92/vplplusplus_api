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
    if (!document && opts.throwErrorIfNotExist) throw new Util.Error(Errors.document_does_not_exist)
    return document
  }

  list(query) {
    return this.Model.find(query)
  }

  async listUsingTheRequest(requestData, MapOfSelectFieldFromPopulates, baseQuery) {
    const id = requestData.params.id;
    const paginator = Util.mongoose.getPaginatorFromRequest(requestData, Config.app.paginator, MapOfSelectFieldFromPopulates);
    const query = { ...Util.mongoose.getQueryFromRequest(requestData), ...baseQuery };
    const data = await Util.mongoose.list(this.Model, id, query, paginator)
    if (id && !data) throw new Util.Error(Errors.document_does_not_exist)
    return data
  }

  createAll(ArrayOfData) {
    const set = Array.isArray(ArrayOfData) ? ArrayOfData : [ArrayOfData]
    return Promise.all(set.map(this.create))
  }

  async create(data) {
    try {
      return await this.Model.create(data)
    } catch (e) { throw new Util.Error(e) }

  }

  async update(query, data) {
    const document = await this.Model.findOneAndUpdate(query, data, { new: true })
    if (!document) throw new Util.Error(Errors.document_does_not_exist)
    return document
  }

  async delete(query) {
    const document = await this.Model.findOneAndDelete(query)
    if (!document) throw new Util.Error(Errors.document_does_not_exist)
    return document
  }

  deleteMany(query) {
    return this.Model.deleteMany(query)
  }

}

module.exports = BaseService