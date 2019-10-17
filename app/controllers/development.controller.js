const faker = require('faker')
const UserService = require(Config.paths.services + '/user/user.service');
const ProjectFakerService = require(Config.paths.services + '/project/project.faker.service');
const ProjectService = require(Config.paths.services + '/project/project.service');
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
  let lastAttemp = firstAttemp
  for (let i = 0; i < maxStudentAttemps - 1; i++) {
    const lastAttempInArray = getLast(attemps)
    if (isASuccesfullAttemp(lastAttempInArray)) return attemps;
    const newAttemp = upgradeRandomBooleans(lastAttempInArray)
    lastAttemp = newAttemp
    attemps.push(newAttemp)
  }

  const hasStudentPassed = isASuccesfullAttemp(lastAttemp)
  if (hasStudentPassed) return attemps

  const randomNumber = faker.random.number({ min: 1, max: 10 })
  const shouldTheStudentPass = randomNumber > 7 // the 30% of students that cant pass the project, will pass the project
  if (shouldTheStudentPass) attemps[attemps.length - 1] = getSuccessfullAttemp(nTestCases)

  return attemps

}


//
// END OF : aletory functions
//



export const createFakeProject = async (req, res, next) => {
  try {
    const { body = {} } = req
    const { maxStudentAttemps = 10 } = body
    const CurrentUser = UserService.getUserFromResponse(res)
    const students = await UserService.getMyStudents(CurrentUser, req, { paginate: false })
    const attempsStudent = students.map(getArrayOfAttempsByStudent(maxStudentAttemps, 5))
    res.send(attempsStudent)
    // const FakeProject = await ProjectFakerService.createFakeProject(CurrentUser._id, body)
    // students.map(student => {

    // })

    // const ProjectDoc = await ProjectService.create(CurrentUser, FakeProject, { forceSetAttributes: false })
    // const {_id:project} = ProjectDoc

    // students.map

    // res.send(students)
  } catch (e) {
    next(e)
  }
}


export const updatePolicies = async (req, res, next) => {

}
export const createTopics = async (req, res, next) => {

}