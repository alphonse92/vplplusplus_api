const Config = global.Config;
const mongoose = require(Config.paths.db + '/mongo');
const increment = require('mongoose-auto-increment');
const paginator = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const ModelSchema = require("./activity.schema");
const Schema = new mongoose.Schema(ModelSchema.schema);

Schema.plugin(paginator);
Schema.plugin(timestamps);
increment.initialize(mongoose.connection);
Schema.plugin(increment.plugin, {model:ModelSchema.name, field:'cursor'});
module.exports = mongoose.model(ModelSchema.name, Schema);
