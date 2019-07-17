import { capitalize, camelCase } from 'lodash'

const Config = global.Config;
const mongoose = require(Config.paths.db + '/mongo');
const increment = require('mongoose-auto-increment');
const paginator = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const ModelSchema = require("./testCase.schema");
const Schema = new mongoose.Schema(ModelSchema.schema, { toJSON: { virtuals: true } });

Schema.virtual('summaries', {
  ref: 'Summary',
  localField: '_id',
  foreignField: 'test',
  justOne: false
});

Schema.plugin(paginator);
Schema.plugin(timestamps);
increment.initialize(mongoose.connection);
Schema.plugin(increment.plugin, { model: ModelSchema.name, field: 'cursor' });
Schema.methods.compile = function () {
  const {
    name,
    objective,
    grade,
    successMessage,
    successReferenceLink,
    failureMessage,
    failureReferenceLink,
    timeout
  } = this
  const methodName = capitalize(camelCase(name))
  const compiledCode =
    `
  @VplTestDescriptorAnnotation(
    name = "${name}",
    objective = ${objective},
    grade = ${grade},
    successMessage = "${successMessage}",
    successReferenceLink = "${successReferenceLink}",
    failureMessage = "${failureMessage}",
    failureReferenceLink = "${failureReferenceLink}",
  )
  @Test(timeout = ${timeout})
  public void ${methodName}Test(){     
    ${this.code}
  }
`
  return compiledCode

}
module.exports = mongoose.model(ModelSchema.name, Schema);