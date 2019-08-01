import * as  InstanceMethods from './test.methods'
import * as  StaticMethods from './test.statics'

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
Schema.methods = InstanceMethods
Schema.statics = { ...Schema.statics, StaticMethods }

module.exports = mongoose.model(ModelSchema.name, Schema);