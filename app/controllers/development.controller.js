const UserService = require(Config.paths.services + '/user/user.service');
const ProjectFakerService = require(Config.paths.services + '/project/project.faker.service');
const ProjectService = require(Config.paths.services + '/project/project.service');


export const createFakeProject = async (req, res, next) => {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const students = await UserService.getMyStudents(CurrentUser, req, { paginate: false })
    const FakeProject = await ProjectFakerService.createFakeProject(CurrentUser._id, req.body)

    // const ProjectDoc = await ProjectService.create(CurrentUser, FakeProject, { forceSetAttributes: false })
    // const {_id:project} = ProjectDoc

    students.map

    res.send(students)
  } catch (e) {
    next(e)
  }
}


export const updatePolicies = async (req, res, next) => {

}
export const createTopics = async (req, res, next) => {

}