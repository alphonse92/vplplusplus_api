const UserService = require(Config.paths.services + "/user/user.service")
const PolicyService = require(Config.paths.services + "/policy/policy.service")


module.exports.call_moodle_func = call_moodle_func;
function call_moodle_func(req, res, next) {

}
module.exports.resetPolicies = resetPolicies;
async function resetPolicies(req, res, next) {
  const { type = 'reset' } = req.params
  await UserService.createDefaultUserIfNotExist(type);
  await PolicyService.createDefaultPoliciesIfNotExist(type);
  await PolicyService.createDefaultGroupsIfNotExist(type);
  res.send('Seeded')
}
