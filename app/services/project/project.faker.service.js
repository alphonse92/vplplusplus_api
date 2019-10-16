import faker from 'faker'

export const CODE_DEFAULT = 'test code body'
export const getFakeName = () => faker.company.catchPhraseAdjective() + " " +
  faker.company.catchPhrase() + " " +
  faker.company.catchPhraseDescriptor()

export const getFakeDescription = () => 'description of:' + getFakeName()
export const getFakeObjective = () => 'We want to test:' + getFakeName()
export const getFakeTestCode = () => "private Calculadora test \n @Before \n   public void setUp(){ \n //the code \n }"
export const getFakeTestCaseCodeBody = () => "// code body"

export const getTestCaseMock = ({ From: createdAt }) => (topic) => {
  const { id, description } = topic
  const fakeTestcase = {
    name: `Fake test case for ${description}`,
    objective: `Test the topic ${description}`,
    grade: 1,
    topic: [id],
    successMessage: `Congrats! you know: ${description}`,
    successMessageLink: faker.internet.url(),
    failureMessage: `Sorry, you dont know ${description}`,
    failureMessageLink: faker.internet.url(),
    code: getFakeTestCaseCodeBody(),
    createdAt
  }
  return fakeTestcase
}

export const getTestMock = ({ From: createdAt, Topics, minTestCases = 1, maxTestCases = 5 }) => () => {
  const name = getFakeName()
  const description = getFakeDescription()
  const objective = getFakeObjective()
  const code = getFakeTestCode()
  const takeTopic = number => Topics[number]
  const test_cases = Array
    .from(Array(Math.floor(Math.random() * maxTestCases) + minTestCases), () => Math.floor(Math.random() * Topics.length))
    .map(takeTopic)
    .map(getTestMock({ From: createdAt }))

  return { name, description, objective, tags: [], code, test_cases, createdAt, }
}

export const getProjectMock = ({ From: createdAt, Topics, activity, minTests = 1, maxTests = 5, minTestCases = 1, maxTestCases = 5 }) => {
  const name = getFakeName()
  const description = getFakeName()
  const objective = getFakeObjective()
  const tests = Array
    .from(
      Array(Math.floor(Math.random() * maxTests) + minTests)
    ).map(getTestMock({ From: createdAt, Topics, minTestCases, maxTestCases }))

  return {
    name,
    description,
    objective,
    is_public: false,
    activity,
    tests,
    createdAt,
  }
}

export const getFakeProject = (From, To, activity) => {
  const TopicService = require(Config.paths.services + '/topic/topic.service');
  const Topics = await TopicService.list()
  return getProjectMock({ From, Topics, activity })
}

export const createFakeProject = (owner, activity, opts = {}) => {
  const { from, to, each, steps, createSummaries = false } = opts
  return getFakeProject(from, to, activity)
}