import { capitalize, camelCase } from 'lodash'

const Config = global.Config;
const Util = require(Config.paths.utils)
const mongoose = require(Config.paths.db + '/mongo');
const increment = require('mongoose-auto-increment');
const paginator = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const ModelSchema = require("./test.schema");
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

Schema.methods.compile = async function () {
  if (!this.test_cases) await this.populate('test_cases').execPopulate()
  if (!this.owner) await this.populate('owner').execPopulate()

  console.log(this.owner)
  const {
    name,
    objective,
    maxGrade,
    tags,
    owner
  } = this
  const className = capitalize(camelCase(name))
  const compiledCode =
    `

import org.junit.Test;
import VPLPluPlusCore.Configurator;
import static org.junit.Assert.assertEquals;
import VPLPluPlusCore.annotations.VplPlusPlusAnnotation;
import VPLPluPlusCore.annotations.VplTestInfoAnnotation;
import VPLPluPlusCore.annotations.VplTestDescriptorAnnotation;
import org.junit.Before;

@VplPlusPlusAnnotation
@VplTestInfoAnnotation(
  name = "${name}",
  tags = "${tags}",
  created_by = "${owner.firstname} ${owner.lastname}",
  maxGrade = ${maxGrade},
  objetive =  ${objective},
)
public class ${className}Test{
  
  ${this.code}
  
  ${this.test_cases.map(test_case => `${test_case.compile()}`).join("\n")}
}

`
  console.log(compiledCode)
  return compiledCode
}



module.exports = mongoose.model(ModelSchema.name, Schema);