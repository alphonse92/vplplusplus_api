const LANG = require(Config.paths.lang)

import { capitalize, camelCase } from 'lodash'
import * as Statics from './test.statics'
/**
 * Instance methods for the testCase mongo model.
 * 
 * DONT USE ARROW FUNCTION, WE NEED TO KEEP this INSTANCE
 * 
 */

export async function getSkills(moodle_user) {
  return this
    .test_cases
    .reduce((topicMap, TestCaseDoc) => {
      const { topics: TopicDocs } = TestCaseDoc
      TopicDocs.forEach(TopicDoc => {
        const { name, description, _id } = TopicDoc
        const TopicFromMap = topicMap[name] || { _id, name, description, test_cases: [] }
        TopicFromMap.test_cases.push(TestCaseDoc)
        topicMap[name] = TopicFromMap
      })
      return topicMap
    }, {})
    .map(topicWithTestCases => {
      const { _id, name, description, test_cases } = topicWithTestCases
      const skillReport = Statics.getSkill(test_cases)
      return { _id, name, description, ...skillReport }
    })

}

export async function compile() {
  if (!this.test_cases) await this.populate('test_cases').execPopulate()
  if (!this.owner) await this.populate('owner').execPopulate()

  const {
    project,
    name,
    objective,
    maxGrade,
    tags,
    owner
  } = this
  const className = `${capitalize(camelCase(name))}Test`
  const filename = `${className}.java`

  const code =
    `
${LANG.ES.TEST_CLASS_CODE_HEADER}
import VPLPluPlusCore.annotations.VplPlusPlus;
import VPLPluPlusCore.annotations.VplTest;
import VPLPluPlusCore.annotations.VplTestCase;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import org.junit.Before;
@VplPlusPlus
@VplTest(project = "${project}")
public class ${className}{
  
  ${this.code}

  ${this.test_cases.map(test_case => `${test_case.compile().code}`).join("\n")}
}
`
  const out = { code, filename }
  return out
}