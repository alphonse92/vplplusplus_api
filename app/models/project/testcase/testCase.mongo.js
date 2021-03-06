import { capitalize, camelCase } from 'lodash'

const Config = global.Config;
const Util = require(Config.paths.utils)
const mongoose = require(Config.paths.db + '/mongo');
const increment = require('mongoose-auto-increment');
const paginator = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const ModelSchema = require("./testCase.schema");
const Schema = new mongoose.Schema(ModelSchema.schema, { toJSON: { virtuals: true } });

Schema.virtual('summaries', {
  ref: 'Summary',
  localField: '_id',
  foreignField: 'test_case',
  justOne: false
});

Schema.plugin(paginator);
Schema.plugin(timestamps);
increment.initialize(mongoose.connection);
Schema.plugin(increment.plugin, { model: ModelSchema.name, field: 'cursor' });

Util.mongoose.addStatics(Schema, ModelSchema)

Schema.methods.compile = function () {
  const {
    name: testCaseName,
    grade,
    _id: id
  } = this
  const name = `${camelCase(testCaseName)}`
  const code =
    `
  @VplTestCase(id = "${id}" , grade = ${grade} )
  @Test()
  public void ${name}(){     
    ${this.code}
  }
`
  const out = { code }
  return out

}
module.exports = mongoose.model(ModelSchema.name, Schema);