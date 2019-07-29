import { capitalize, camelCase } from 'lodash'

const Config = global.Config;
const Util = require(Config.paths.utils)
const mongoose = require(Config.paths.db + '/mongo');
const increment = require('mongoose-auto-increment');
const paginator = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const ModelSchema = require("./test.schema");
const SkillService = require(Config.paths.services + '/project/project.test.skill.service');
const Schema = new mongoose.Schema(ModelSchema.schema, { toJSON: { virtuals: true } });

Schema.virtual('test_cases', {
  ref: 'TestCase',
  localField: '_id',
  foreignField: 'test',
  justOne: false
});

Schema.plugin(paginator);
Schema.plugin(timestamps);
increment.initialize(mongoose.connection);
Schema.plugin(increment.plugin, { model: ModelSchema.name, field: 'cursor' });

Util.mongoose.addStatics(Schema, ModelSchema)

Schema.methods.getSkills = async function () {

  const testCasesLoaded = Array.isArray(this.test_cases) && this.test_cases[0].summaries
  const topicsLoaded = testCasesLoaded && Array.isArray(this.testCases[0].topics[0].name)
  const shouldPopulateTestCases = !testCasesLoaded || !topicsLoaded

  if (shouldPopulateTestCases) await this.populate([{ path: 'test_cases', populate: [{ path: topics }, { path: 'summaries' }] }]).execPopulate()

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
      const skillReport = SkillService.getSkill(test_cases)
      console.log(topicWithTestCases)
      console.log(skillReport)
      return { _id, name, description, ...skillReport }
    })

}

Schema.methods.compile = async function () {
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



module.exports = mongoose.model(ModelSchema.name, Schema);