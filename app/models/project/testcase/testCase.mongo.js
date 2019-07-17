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
Schema.methods.compile = async function () {
  if (!this.test_cases) await this.populate('test_cases').execPopulate()
  const methodName = capitalize(camelCase(this.name))
  return `
    
    public void ${methodName}Test{     
      ${this.code}
    }

  `

}
module.exports = mongoose.model(ModelSchema.name, Schema);