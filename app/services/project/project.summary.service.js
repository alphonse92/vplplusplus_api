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

  
}

module.exports = new SummaryService()