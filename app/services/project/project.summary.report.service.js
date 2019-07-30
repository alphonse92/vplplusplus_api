import moment from 'moment'
import { capitalize, camelCase } from 'lodash'
const Config = global.Config;


// import { pick } from 'lodash'

// const BaseService = require(Config.paths.services + '/service');
// const Errors = require(Config.paths.errors + '/project.summary.errors');
// const Summary = require(Config.paths.models + "/project/summary/summary.mongo");
// const Util = require(Config.paths.utils);

const UserService = require(Config.paths.services + '/user/user.service');
const Projectservice = require('./project.service');
/*

 
 */
class SummaryReportService {

  getPopulateToSelectProjectWithUserSummaries(moodle_user) {
    return [
      {
        path: 'tests',
        populate: {
          path: 'test_cases',
          populate: {
            path: 'summaries',
            match: moodle_user ? { moodle_user } : {}
          }
        }
      }
    ]
  }

  async extractUserReportsFromProject(ProjectDoc) {

  }

  async createProjectReport(Report) {

  }

  createProjectReports(ArrayOfProjectDoc) {
    const array = Array.isArrray(ArrayOfProjectDoc)
      ? ArrayOfProjectDoc
      : [ArrayOfProjectDoc]
    return Promise.all(array.map(this.createProjectReport))

  }
  getDatesFromOptions(ProjectDoc, opts, format = "YYYY-MM-DD") {
    const {
      from = moment(ProjectDoc.created_at).format(format),
      to = moment().format(format)
    } = opts
    return { from, to }
  }

  createName(ProjectDoc, StudentUserDoc, opts) {
    const dates = this.getDatesFromOptions(ProjectDoc, opts)
    const { from, to } = dates
    const stamp = [from, to].join('-')
    const { _id: project_id } = ProjectDoc
    return UserDoc
      ? `VplReport ${project_id} of student: ${StudentUserDoc.id}-${capitalize(camelCase(StudentUserDoc.firstname + ' ' + StudentUserDoc.lastname))}-${stamp}`
      : project_id
        ? `VplReport ${project_id}-${stamp}`
        : `VplReport all-${stamp}`
  }
  //can be used by owner student, and a teacher
  async getUserReport(CurrentUser, project_id, moodle_user, opts) {
    let UserDoc;
    const ProjectPopulates = this.getPopulateToSelectProjectWithUserSummaries(moodle_user)
    const { from, to } = opts
    const created_by = CurrentUser
    const projectQuery = {}

    if (project_id) projectQuery._id = project_id
    if (moodle_user) UserDoc = await UserService.getUserMoodle(moodle_user)
    const ProjectDoc = await Projectservice.get(CurrentUser, projectQuery, ProjectPopulates)
    const name = this.createName(ProjectDoc, UserDoc)
    const reports = await this.createProjectReports(ProjectDoc)


    /**
     * This report allow to me to know the 
     * level of a user and him skills, 
     * with the 
     */
    /*

    each item is a user report
      {
        name: report name
        from: date,
        to: date
        created_by:
        reports:[
          {
              id:...
              firstname:...
              lastname:...
              email:...
              projects:[
                {
                  link: http://moodle/myactivity ... bla bla
                  project: {...project data}
                }
              ]
              skills:[ 
                {
                  name: razonamiento matemático
                  cases: 20
                  effort: 24
                  level: 83.3 
                },
                {
                  name: lógica
                  cases: 15
                  effort: 28
                  level: 53.57 
                },
              ],
              skill: // avg of all skill levels
              solved: [{... array of test cases (name,objective) ...}],
              not_solved: [{... array of test cases (name,objective)...}]
              submissions:[
                {
                  effort: count of summaries
                  test_case:{
                    name,
                    objective
                  }
                  summaries:[ (order by created_at)
                    approved
                    created_at,
                  ]
                }
              ]
          }
        ]
      }
     
    */
  }

  /**
   * Project is related to a moodle activity
   * @param {*} CurrentUser 
   * @param {*} user_id 
   */
  getUserReportProject(CurrentUser, project_id, student_id, opts) {

  }

  // any teacher can see the user reports
  getUsersReport(CurrentUser, user_ids) {
    return Promise.all(user_ids.map(id => this.getUserReport(CurrentUser, id)))
  }
  /**
   * The project includes the tests with the cases,
   * the summaries by test cases and who passed the test case
   * and him effort.
   * @param {*} CurrentUser 
   * @param {*} project_id 
   */
  getProjectReport(CurrentUser, project_id) {
    /*
    
    each item is a project report
      {
        name
        from
        to
        reports:[
          {
            name,
            description
            tests:[
              {
                name,
                objective
                test_cases:[
                  {
                    name
                    objective,
                    solved:
                    not_solved
                  }
                ]
              }
            ]
            users:[
              {
                _id,
                id,
                firstname
                lastname
                link_user_profile
                link_user_report
                skills:[ 
                  {
                    name: razonamiento matemático
                    cases: 20
                    effort: 24
                    level: 83.3 
                  },
                  {
                    name: lógica
                    cases: 15
                    effort: 28
                    level: 53.57 
                  },
                ],
                skill: // avg of all skill levels
              }
            ]
          }
        ]
      }
      
      
     */
  }

  /**
   * 
   * @param {*} CurrentUser 
   * @param {*} project_id 
   */
  getUserKnowledge(CurrentUser, project_id) {

  }

  getUserUnawareness(CurrentUser, user_id) {

  }




}

module.exports = new SummaryReportService()