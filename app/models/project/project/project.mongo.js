const Config = global.Config;
const Util = require(Config.paths.utils)
const mongoose = require(Config.paths.db + '/mongo');
const increment = require('mongoose-auto-increment');
const paginator = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const ModelSchema = require("./project.schema");
const Schema = new mongoose.Schema(ModelSchema.schema, { toJSON: { virtuals: true } });

Schema.virtual('tests', {
  ref: 'Test',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

Schema.virtual('summaries', {
  ref: 'Summary',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

Schema.plugin(paginator);
Schema.plugin(timestamps);
increment.initialize(mongoose.connection);
Schema.plugin(increment.plugin, { model: ModelSchema.name, field: 'cursor' });

Util.mongoose.addStatics(Schema, ModelSchema)

module.exports = mongoose.model(ModelSchema.name, Schema);