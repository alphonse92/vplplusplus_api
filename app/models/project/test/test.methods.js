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
    _id,
    name,
    objective,
    maxGrade,
    tags,
    owner
  } = this
  const className = capitalize(camelCase(name))
  const filename = `${className}Test.java`

  const code =
    `**
* VplJUnit version 1.0
* This class was generated automatically, and adds 
* the VPL++ api to improve your tests with extra functionalities.
* 
* You can modify this class manually, please review the
* VplJunit runner documentation of vpl ++  to know
* how to improve your JUnit tests with vpl
* 
* If you need help please contact to the Vpl++ creator
*/

import org.junit.Test;
import VPLPluPlusCore.Configurator;
import VPLPluPlusCore.annotations.VplPlusPlusAnnotation;
import VPLPluPlusCore.annotations.VplTestInfoAnnotation;
import VPLPluPlusCore.annotations.VplTestDescriptorAnnotation;

// set here your imports
// YOU NEED TO SET YOUR IMPORTS MANUALLY 

import static org.junit.Assert.assertEquals;
import org.junit.Before;

// end of your imports

@VplPlusPlusAnnotation
@VplTestInfoAnnotation(
  api_id = "${_id}"
  name = "${name}",
  tags = "${tags}",
  created_by = "${owner.firstname} ${owner.lastname}",
  maxGrade = ${maxGrade},
  objetive =  ${objective},
)
public class ${className}{
  
  ${this.code}

  ${this.test_cases.map(test_case => `${test_case.compile().code}`).join("\n")}
}
`
  const out = { code, filename }
  return out
}