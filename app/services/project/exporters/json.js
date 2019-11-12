import { pick } from 'lodash'
const Config = global.Config;

module.exports = (ProjectDoc) => {
  const Project = require(Config.paths.models + "/project/project/project.mongo");
  const Test = require(Config.paths.models + "/project/test/test.mongo");
  const TestCase = require(Config.paths.models + "/project/testcase/testCase.mongo");

  const project = ProjectDoc
  const { tests: TestObjects = [] } = project
  const projectCleaned = pick(project, Project.getEditableFields())

  const tests = TestObjects.map(TestObject => {
    const { test_cases: TestCaseObjects } = TestObject
    const test_cases = TestCaseObjects.map(TestCaseObject => pick(TestCaseObject, TestCase.getEditableFields()))
    return { ...pick(TestObject, Test.getEditableFields()), test_cases }
  })

  return { ...projectCleaned, tests }

}