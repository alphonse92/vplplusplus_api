const Config = global.Config;
const Util = require(Config.paths.utils);
const TestCaseService = require('./project.test.case.service');
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/project.summary.errors');

const UserService = require(Config.paths.services + '/user/user.service');
const CourseMoodleServiceClass = require(Config.paths.services + '/moodle/moodle.course.service');
const Summary = require(Config.paths.models + "/project/summary/summary.mongo");

/**
 * SummaryService, class to manage Summaries of a testcase resolution.
 * This clase provide services to manage the summaries, you CANT
 * delete, or update them. 
 * 
 * This service only can create and retreive summaries. 
 * 
 * The reasons is because surelly the institute
 * want to keep the results history along the time.
 * 
 * If you want to delete summaries you need to remove them directly 
 * from database. 
 * 
 */
class SummaryService extends BaseService {

  constructor() {
    super(Summary)
  }

  async groupBy(CurrentUser, query, field) {
    const accumulators = {
      user: { $first: "$user" },
    }
    const result = await super.groupBy(query, field, accumulators)
    return result.map(({ moodle_user, user, summaries }) => ({ moodle_user, user: user[0], summaries }))
  }

  async  valideUserIsEnrolledInCourse(activity, moodle_user, ) {

    const CourseMoodleService = new CourseMoodleServiceClass()
    const UserFromActivity = await CourseMoodleService.getUsersFromActivityId(activity, moodle_user, { closeOnEnd: true })
    const isUserInActivity = UserFromActivity.length === 1
    if (!isUserInActivity) throw new Util.Error(Errors.user_is_not_enroled_in_the_activity)
    return UserFromActivity[0]
  }

  async createAll(project_id, moodle_user, summary_array_to_save, opts = { valideEnroledStudents: true, throwExceptions: true }) {
    const ProjectService = require('./project.service');
    const Project = ProjectService.getModel()
    const ProjectDoc = await Project.findById(project_id)
    const { _id: project, activity } = ProjectDoc

    // user should be enroled in the activity
    try {
      opts.valideEnroledStudents && valideUserIsEnrolledInCourse(activity, moodle_user)
    } catch (e) {
      if (opts.throwExceptions) throw e
      else return
    }

    const SummariesApproved = await Summary.find({ project, moodle_user, approved: true })
    // maps of references to find duplicates and approved test_cases
    const mapToFindDuplicates = {}
    const TestCasesApprovedMap = SummariesApproved.reduce(
      (map, summaryApproved) => ({ ...map, [summaryApproved.test_case]: summaryApproved }),
      {}
    )
    const results = await Promise.all(
      summary_array_to_save
        .filter(summaryToSave => {
          // filter if is twice in the array of summaries to save
          // or if there is a summary approved to the summary test case 
          const { test_case } = summaryToSave
          const shouldAdd = !TestCasesApprovedMap[test_case] && !mapToFindDuplicates[test_case]
          // if the summary should be added, then add the test_case id to the map to find duplicates
          if (shouldAdd) mapToFindDuplicates[test_case] = true
          return shouldAdd
        })
        //create payload
        .map(summaryToSave => ({ moodle_user, project, ...summaryToSave }))
        // return the promises
        .map(data => this.create(data))
    )
    return results.concat(Object.values(TestCasesApprovedMap))
  }

  /**
   * Create a Summary related to a project and test case
   * @canExecute Client Runners, users that belongs to the group default/runner
   * @param {*} project_id 
   * @param {*} test_case 
   * @param {*} data 
   */
  async create(summary) {
    const UserDoc = await UserService.getByMoodleId(moodle_user)
    const user = UserDoc._id
    const data = { ...summary, user }
    return await super.create(data)
  }

  /**
   * Retreive the summaries
   * Ways to retreive summaries
   * 
   * 1. Using the ProjectService TestService or TestCaseService, and populate the summaries (just teachers)
   * 2. Using this service (see cases below)
   * 
   * * Cases:
   * 
   * 1. Get my summaries if CurrentUser is a Student:
   *   1. Find summary by Summary.user = CurrentUser._id
   * 2. Get my summaries if Current user is a teacher 
   *   1. Find the The projects that owner is CurrentUser 
   *   2. Populate summaries virtual attribute
   *   3. Reduce array of projects and extract the summaries
   * 3. Get Summaries if Current user is an admin
   *   1. Returns all summaries  
   * 
   * @canExecute default/siteadministrator, default/editingteacher, default/teacher, default/student
   * @param {*} CurrentUser 
   * @param {*} TestCase 
   */
  async listUsingTheRequest(CurrentUser) {
    const { _id: user } = CurrentUser

    const query = { $or: [] }

    if (!UserService.isAdmin(CurrentUser)) {
      // If current user is a teacher, then retreive the test cases that he is the owner
      const ListProjectsThatCurrentProjectIsOwner = await TestCaseService.list({ owner: user }).select('_id').exec()
      // build the query using the test case data
      const queryTeacher = { test_case: { $in: ListProjectsThatCurrentProjectIsOwner } }
      query.$or.push(queryTeacher)

      const queryStudent = { user }
      query.$or.push(queryStudent)

    }

    const result = await super.listUsingTheRequest(req, {}, query)

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