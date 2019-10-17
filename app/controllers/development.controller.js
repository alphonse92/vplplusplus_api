const UserService = require(Config.paths.services + '/user/user.service');
const ProjectFakerService = require(Config.paths.services + '/project/project.faker.service');

export const createFakeProject = async (req, res, next) => {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const FakeProject = await ProjectFakerService.createFakeProject(CurrentUser._id, req.body)
    res.send(FakeProject)
  } catch (e) {
    next(e)
  }
}


export const updatePolicies = async (req, res, next) => {

}