import { capitalize, camelCase } from 'lodash'

const Config = global.Config;
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

Schema.methods.compile = async function () {
  if (!this.test_cases) await this.populate('test_cases').execPopulate()
  const className = capitalize(camelCase(this.name))
  return `
    public class ${className}Test{
      
      ${this.code}

      ${this.test_cases.map(test_case => `${test_case.compile()}`)}

    }

  `

}
module.exports = mongoose.model(ModelSchema.name, Schema);