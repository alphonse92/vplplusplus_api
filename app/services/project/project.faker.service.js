import faker from 'faker'

export const CODE_DEFAULT = 'test code body'
export const getFakeName = () => faker.company.catchPhraseAdjective() + " " +
  faker.company.catchPhrase() + " " +
  faker.company.catchPhraseDescriptor()

export const getFakeDescription = () => 'description of:' + getFakeName()
export const getFakeObjective = () => 'We want to test:' + getFakeName()
export const getFakeTestCode = () => "private Calculadora test \n @Before \n   public void setUp(){ \n //the code \n }"
export const getFakeTestCaseCodeBody = () => "// code body"

export const getTestCaseMock = ({ owner, createdAt }) => (topic) => {
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
    createdAt,
    owner
  }
  return fakeTestcase
}

export const getTestMock = (data) => () => {
  const { owner, createdAt, topics, minTestCases = 1, maxTestCases = 5 } = data
  const name = getFakeName()
  const description = getFakeDescription()
  const objective = getFakeObjective()
  const code = getFakeTestCode()
  const test_cases = Array
    .from(Array(Math.floor(Math.random() * maxTestCases) + minTestCases), () => Math.floor(Math.random() * topics.length))
    .map(number => topics[number])
    .map(getTestCaseMock({ ...data }))

  return { name, description, objective, tags: [], code, test_cases, createdAt, owner }
}

export const getProjectMock = (data) => {
  const { maxTests, minTests, createdAt, owner, activity } = data
  const name = getFakeName()
  const description = getFakeName()
  const objective = getFakeObjective()
  const tests = Array
    .from(Array(Math.floor(Math.random() * maxTests) + minTests))
    .map(getTestMock({ ...data }))

  return {
    name,
    description,
    objective,
    is_public: false,
    activity,
    tests,
    createdAt,
    owner,
  }
}

export const getFakeProject = async (data) => {
  const TopicService = require(Config.paths.services + '/topic/topic.service');
  const topics = await TopicService.list()
  return getProjectMock({ ...data, topics })
}

export const createFakeProject = (currentUser, data = {}) => {
  const { _id: owner } = currentUser
  return getFakeProject({
    ...data,
    owner,
    createdAt: data.from
  })
}