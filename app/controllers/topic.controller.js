const Config = global.Config;
const Util = require(Config.paths.utils);
const Errors = require(Config.paths.errors + '/topic.errors');
const UserService = require(Config.paths.services + '/user/user.service');
const TopicService = require(Config.paths.services + '/topic/topic.service');
const TestCaseService = require(Config.paths.services + '/project/project.test.case.service');

module.exports.get = get;
async function get(req, res, next) {
  try {
    const Topics = await TopicService.list({visible:true})
    res.send(Topics
      .map(
        ({ _id, name, description, owner }) => ({ _id, name, description, owner })
      ))
  } catch (e) {
    next(e)
  }
}

module.exports.list = list
async function list(req, res, next) {
  try {

    const CurrentUser = UserService.getUserFromResponse(res)
    const Topics = await TopicService.listUsingTheRequest(CurrentUser, req)
    const TestCase = TestCaseService.getModel()
    
    if(req.body.password && !req.body.password.length) throw new Util.error(Errors.password_is_required)

    for (let i = 0; i < Topics.docs.length; i++) {
      const TopicDoc = Topics.docs[i];
      const TestCaseDocs = await TestCase
        .find({ topic: TopicDoc._id })
        .populate('summaries')
        .exec()

      const hasSummaries = TestCaseDocs.reduce((acc, testCaseDoc) => {
        return acc || !!(testCaseDoc.summaries.length)
      }, false)

      const Doc = Topics.docs[i].toObject()
      Doc.hasSummaries = hasSummaries

      Topics.docs[i] = Doc

    }

    res.send({ ...Topics })
  } catch (e) {
    next(e)
  }
}

module.exports.create = create;
async function create(req, res, next) {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const Topic = await TopicService.createAll(CurrentUser, req.body)
    res.send(Topic)
  } catch (e) {
    next(e)
  }
}

module.exports.delete = deleteTopic;
async function deleteTopic(req, res, next) {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const TopicDeleted = await TopicService.delete(CurrentUser, req.params.id)
    res.send(TopicDeleted)
  } catch (e) {
    next(e)
  }
}

