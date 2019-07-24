const Config = global.Config;
const UserService = require(Config.paths.services + '/user/user.service');
const TopicService = require(Config.paths.services + '/topic/topic.service');
const Util = require(Config.paths.utils)

module.exports.get = get;
async function get(req, res, next) {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const Topics = await TopicService.listUsingTheRequest(CurrentUser, req)
    res.send(Topics)
  } catch (e) {
    next(e)
  }
}

module.exports.create = create;
async function create(req, res, next) {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const name = Util.string.unLatinize(req.body.name).toLowerCase()
    const Topic = await TopicService.create(CurrentUser, { ...req.body, name })
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

