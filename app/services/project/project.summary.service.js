import { pick } from 'lodash'

const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/project.summary.errors');
const Summary = require(Config.paths.models + "/project/summary/summary.mongo");
const Util = require(Config.paths.utils);

class SummaryService extends BaseService {

  constructor() {
    super(Summary)
  }

  create(TestCaseDoc, data) {
    const { project, _id: test_case } = TestCaseDoc
    return super.create({ ...data, test_case, project })
  }

  async update(query, data) {
    throw new Util.Error(Errors.blocked)
  }

  async delete(query) {
    throw new Util.Error(Errors.blocked)

  }

  deleteMany(query) {
    throw new Util.Error(Errors.blocked)
  }


}

module.exports = new SummaryService()