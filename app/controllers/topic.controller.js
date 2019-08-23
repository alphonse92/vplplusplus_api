const Config = global.Config;
const UserService = require(Config.paths.services + '/user/user.service');
const TopicService = require(Config.paths.services + '/topic/topic.service');
const Util = require(Config.paths.utils)

module.exports.get = get;
async function get(req, res, next) {
  try {
    const Topics = await TopicService.list()
    res.send(Topics
      .filter(({ deleted_at }) => !deleted_at)
      .map(
        ({ _id, name, description, owner }) => ({ _id, name, description, owner })
      ))
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

