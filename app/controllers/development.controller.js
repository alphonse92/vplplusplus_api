const UserService = require(Config.paths.services + '/user/user.service');
const ProjectFakerService = require(Config.paths.services + '/project/project.faker.service');
const ProjectService = require(Config.paths.services + '/project/project.service');

export const createFakeProject = async (req, res, next) => {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const FakeProject = await ProjectFakerService.createFakeProject(CurrentUser._id, req.body)
    const ProjectDoc = await ProjectService.create(CurrentUser, FakeProject, { forceSetAttributes: false })
    res.send(FakeProject)
  } catch (e) {
    next(e)
  }
}


export const updatePolicies = async (req, res, next) => {

}
export const createTopics = async (req, res, next) => {

}