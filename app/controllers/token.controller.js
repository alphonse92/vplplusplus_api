const Config = global.Config;
const UserService = require(Config.paths.services + '/user/user.service');
const TokenService = require(Config.paths.services + '/token/token.service');

module.exports.get = get;
async function get(req, res, next) {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const Tokens = await TokenService.listUsingTheRequest(CurrentUser, req)
    res.send(Tokens)
  } catch (e) {
    next(e)
  }
}

module.exports.create = create;
async function create(req, res, next) {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const Token = await TokenService.create(CurrentUser, req.body)
    res.send(Token)
  } catch (e) {
    next(e)
  }
}

module.exports.delete = deleteToken;
async function deleteToken(req, res, next) {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const TokenDeleted = await TokenService.delete(CurrentUser, req.params.id)
    res.send(TokenDeleted)
  } catch (e) {
    next(e)
  }
}

