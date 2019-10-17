const faker = require('faker')
const moment = require('moment')
const UserService = require(Config.paths.services + '/user/user.service');
const ProjectFakerService = require(Config.paths.services + '/project/project.faker.service');
const ProjectService = require(Config.paths.services + '/project/project.service');
const ProjectTestCaseService = require(Config.paths.services + '/project/project.test.case.service');
const ProjectSummaryService = require(Config.paths.services + '/project/project.summary.service');

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

async function createSummariesToTheProject(CurrentUser, ProjectDoc, data) {
  const { _id: project } = ProjectDoc
  const { from, type = "days", each = 1, maxStudentAttemps = 10 } = data
  const TestCase = ProjectTestCaseService.getModel()
  const students = await UserService.getMyStudents(CurrentUser, req, { paginate: false })
  const TestCaseDocs = await TestCase.find({ project })
  const nTestCases = TestCaseDocs.length
  const attempsStudent = students.map(getArrayOfAttempsByStudent(maxStudentAttemps, nTestCases))
  const SummaryDocs = []

  for (let iAttempStudent in attempsStudent) {
    const attempStudent = attempsStudent[iAttempStudent]
    const { attemps, student } = attempStudent
    const { id: moodle_user } = student
    const pivot = moment(from)
    for (let iAttemp in attemps) {
      const attemp = attemps[iAttemp]
      const createdAtMoment = pivot.add(each, type)
      const summaryPayload = {
        moodle_user,
        project,
        data: attemp.map((approved, idx) => ({ test_case: TestCaseDocs[idx]._id, approved, output: 'summary created automatically' })),
        createdAt: createdAtMoment.toDate()
      }
      const Summary = await ProjectSummaryService.createAll(summaryPayload.project, summaryPayload.moodle_user, summaryPayload.data, opts = { valideEnroledStudents: false })
      SummaryDocs.push(Summary)
    }
  }

  return SummaryDocs
}

async function createAndSaveFakeProject(CurrentUser, data) {
  const FakeProject = await ProjectFakerService.createFakeProject(CurrentUser._id, data)
  // if teacher of current user is not teacher of the activity related, it should throw an error even if the fake project is mocked
  const ProjectDoc = await ProjectService.create(CurrentUser, FakeProject, { forceSetAttributes: false })
  return ProjectDoc
}

export const createFakeProject = async (req, res, next) => {
  try {
    const { body = {} } = req
    const CurrentUser = UserService.getUserFromResponse(res)
    const ProjectDoc = await createAndSaveFakeProject(CurrentUser, body)
    const summariesDocs = await createSummariesToTheProject(CurrentUser, ProjectDoc, body)
    res.send(summariesDocs)
  } catch (e) {

    // should throw an error if user isnt a teacher to the related activity
    // should throw an error if user isnt a teacher to the related activity
    next(e)
  }
}


export const updatePolicies = async (req, res, next) => {

}
export const createTopics = async (req, res, next) => {

}