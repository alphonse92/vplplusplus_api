import { pick } from 'lodash'

const Config = global.Config;
const Util = require(Config.paths.utils);
const TestCaseService = require('./project.test.case.service');
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/project.summary.errors');
const TestCaseErrors = require(Config.paths.errors + '/project.test.case.errors');
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

  /**
   * Create a Summary related to a project and test case
   * @canExecute Client Runners, users that belongs to the group default/runner
   * @param {*} project_id 
   * @param {*} test_case 
   * @param {*} data 
   */
  async create(moodle_user, test_case, data) {
    const CourseMoodleService = new CourseMoodleServiceClass()
    const TestCase = TestCaseService.getModel()
    const TestCaseDoc = await TestCase
      .findById(test_case)
      .populate('project')

    // return an exception if testcase does not exist
    if (!TestCaseDoc) throw new Util.Error(TestCaseErrors.test_case_does_not_exist)

    const TestCaseSolved = await TestCase.findOne({ moodle_user, test_case, approved: true })
    if(TestCaseSolved) throw new Util.Error(TestCaseErrors.test_case_already_solved_for_you)

    const Project = TestCaseDoc.project
    const activity = Project.activity
    const UserFromActivity = await CourseMoodleService.getUsersFromActivityId(activity, moodle_user, { closeOnEnd: true })
    const isUserInActivity = UserFromActivity.length === 1

    // user should be enroled in the activity
    if (!isUserInActivity) throw new Util.Error(Errors.user_is_not_enroled_in_the_activity)

    const User = UserService.getModel()
    const UserDoc = await User.findOne({ id: moodle_user })
    const user = UserDoc ? UserDoc._id : null

    const createSummariesPromise = Promise.all(
      data.map(({ approved, output }) =>
        super.create({
          user,
          project: TestCaseDoc.project._id,
          moodle_user,
          test_case,
          approved,
          output
        })))
    const results = await createSummariesPromise

    return results
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