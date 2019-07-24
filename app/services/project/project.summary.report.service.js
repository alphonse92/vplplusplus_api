import { pick } from 'lodash'

const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const UserService = require(Config.paths.services + '/user/user.service');
const Projectservice = require(Config.paths.services + '/project/project.service');
const Errors = require(Config.paths.errors + '/project.summary.errors');
const Summary = require(Config.paths.models + "/project/summary/summary.mongo");
const Util = require(Config.paths.utils);

/*
 This class create summaries reports.
 -----------------------------------------------------
  How to calculate the student skill of a topic 
 -----------------------------------------------------

  Variables:

  T: Total of test_cases 
  R: Total of test cases that the studen solved
  N: Total of test cases that the studen not solved
  C: negative coefiecent, more not solved tests, more penalization
  E: The ammount of all attempts to solve a test_case (∑a)
  S: Student skill level

  a: attemp to solve a test case

  C = (T+1) / (R+1)
  S =  T / (E*C)

  Ranges:

  1. Valid values of T : T >= R && T >= N && T > 0
  2. Valid values of R : T >= R >= 0
  3. Valid values of N : T >= N => 0
  4. Valid values of C:  C >= 1
  5. valid values of E:  E >= R => 0
  6. Valid values of S:  1 >= S >= 0
 
 */
class SummaryService extends BaseService {

  constructor() {
    super(Summary)
  }

  /**
   * Project is related to an moodle activity
   * @param {*} CurrentUser 
   * @param {*} user_id 
   */
  getUserReportProject(CurrentUser, user_id) {

  }

  // any teacher can see the user reports
  getUsersReport(CurrentUser, user_ids) {
    return Promise.all(user_ids.map(id => this.getUserReport(CurrentUser, id)))
  }

  //can be used by owner student, and a teacher
  getUserReport() {
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

module.exports = new SummaryService()