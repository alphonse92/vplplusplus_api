const faker = require('faker')
const moment = require('moment')
const UserService = require(Config.paths.services + '/user/user.service');
const ProjectFakerService = require(Config.paths.services + '/project/project.faker.service');
const ProjectService = require(Config.paths.services + '/project/project.service');
const ProjectTestCaseService = require(Config.paths.services + '/project/project.test.case.service');
const ProjectSummaryService = require(Config.paths.services + '/project/project.summary.service');
const CourseMoodleServiceClass = require(Config.paths.services + '/moodle/moodle.course.service');
//
// BEGIN OF : aletory functions
//

// function to valide if all array items are true
const isASuccesfullAttemp = array => array.reduce((acc, val) => acc && val, true)
// function that retreive a array from length, filled  with true values
const getSuccessfullAttemp = nTestCases => Array.from(Array(nTestCases), () => true)
// function to retreive a random boolean
const getRandomBoolean = () => faker.random.boolean()
// Function to retreive a random boolean array
const getArrayOfBooleans = nTestCases => Array.from(Array(nTestCases), getRandomBoolean)
// function that returns true if val is true, else return a random boolean
const tryToSetFalseToTrue = val => val ? val : faker.random.boolean()
// this function gets an array of boolean values, and try to set the falsy values to true aleatory
const upgradeRandomBooleans = arrayOfbooleanValues => arrayOfbooleanValues.map(tryToSetFalseToTrue)
// function to retreive the last array 
const getLast = a => a[a.length - 1]
// function to get aleatory array of attemps to solve a test cases of a project
const getArrayOfAttempsByStudent = (maxStudentAttemps, nTestCases) => student => {
  const firstAttemp = getArrayOfBooleans(nTestCases)
  const attemps = [firstAttemp]
  const returnResponse = (passed) => ({ attemps, student, passed })
  let lastAttemp = firstAttemp
  for (let i = 0; i < maxStudentAttemps - 1; i++) {
    const lastAttempInArray = getLast(attemps)
    if (isASuccesfullAttemp(lastAttempInArray)) return returnResponse(true);
    const newAttemp = upgradeRandomBooleans(lastAttempInArray)
    lastAttemp = newAttemp
    attemps.push(newAttemp)
  }

  const hasStudentPassed = isASuccesfullAttemp(lastAttemp)
  if (hasStudentPassed) return returnResponse(true)

  const randomNumber = faker.random.number({ min: 1, max: 10 })
  const shouldTheStudentPass = randomNumber > 7 // the 30% of students that cant pass the project, will pass the project
  if (shouldTheStudentPass) attemps[attemps.length - 1] = getSuccessfullAttemp(nTestCases)

  return returnResponse(shouldTheStudentPass)

}


//
// END OF : aletory functions
//

async function createSummariesToTheProject(CurrentUser, ProjectDoc, req) {
  const { body: data } = req
  const CourseMoodleService = new CourseMoodleServiceClass()
  const extractMoodleId = ({ id }) => id
  const { _id: project } = ProjectDoc
  const { from, type = "days", each = 1, maxStudentAttemps = 10, activity } = data

  const TestCase = ProjectTestCaseService.getModel()
  // 1. get all teacher's students
  const teacherStudents = await UserService.getMyStudents(CurrentUser, req, { paginate: false })
  // 2. take all the ids of the teacher  students
  const arrayOfTeacherStudentsMoodleIds = teacherStudents.map(extractMoodleId)
  // 3. get studens from activity and take the students
  const studentsInActivity = await CourseMoodleService.getUsersFromActivityId(activity, arrayOfTeacherStudentsMoodleIds, { closeOnEnd: true })
  // 4. take all the ids of students in activity
  const studentsInActivityMoodleIds = studentsInActivity.map(extractMoodleId)
  // 5. take the moodle students from the teacher students
  const students = teacherStudents.filter(({ id }) => studentsInActivityMoodleIds.includes(id))
  // 6, take the test cases related to the project
  const TestCaseDocs = await TestCase.find({ project })
  const nTestCases = TestCaseDocs.length
  // 7, create an aleatory array of attemps related to the student
  const attempsStudent = students.map(getArrayOfAttempsByStudent(maxStudentAttemps, nTestCases))
  let AllSummaryDocs = []

  // start to create the summaries for each item attemp of array of students attemps
  for (let iAttempStudent in attempsStudent) {
    const attempStudent = attempsStudent[iAttempStudent]
    const { attemps, student } = attempStudent
    const { id: moodle_user } = student
    // 8. take the initial date from the payload
    const pivot = moment(from)
    // 9, iterate by attemp, for each value is a approved/rejected summary
    for (let iAttemp in attemps) {
      const attemp = attemps[iAttemp]
      const createdAtMoment = pivot.add(each, type)
      // 10 create the payload
      const summaryPayload = {
        moodle_user,
        project,
        data: attemp.map((approved, idx) => ({ createdAt: createdAtMoment.toDate(), test_case: TestCaseDocs[idx]._id, approved, output: 'summary created automatically' })),

      }
      // 11. Create the summaries according the project, moodle user, and data, disable validations to improve the performance
      const SummaryDocs = await ProjectSummaryService.createAll(project, moodle_user, summaryPayload.data, { valideEnroledStudents: false })
      AllSummaryDocs = AllSummaryDocs.concat(SummaryDocs)
      // next student item attemp
    }
    // next attemp
  }
  // return the array of summaries 
  return AllSummaryDocs
}

async function createAndSaveFakeProject(CurrentUser, req) {
  const { body: data } = req
  const FakeProject = await ProjectFakerService.createFakeProject(CurrentUser._id, data)
  // if teacher of current user is not teacher of the activity related, it should throw an error even if the fake project is mocked
  const ProjectDoc = await ProjectService.create(CurrentUser, FakeProject, { forceSetAttributes: true })
  return ProjectDoc
}

async function createAndSaveFakeProjects(CurrentUser, req) {
  const { quantity = 1 } = req.body
  let response = []
  for (let i = 0; i < quantity; i++) {
    const ProjectDoc = await createAndSaveFakeProject(CurrentUser, req)
    const SummaryDocs = createSummariesToTheProject(CurrentUser, ProjectDoc, req)
    response = [...response, SummaryDocs]
  }
  return Promise.all(response)
}

export const createFakeProject = async (req, res) => {
  try {
    const CurrentUser = UserService.getUserFromResponse(res)
    const summariesDocs = await createAndSaveFakeProjects(CurrentUser, req)
    res.send(summariesDocs)
  } catch (e) {
    next(e)
  }
}


export const updatePolicies = async (req, res, next) => {

}
export const createTopics = async (req, res, next) => {

}