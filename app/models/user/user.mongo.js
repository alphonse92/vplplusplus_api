const Config = global.Config;
const mongoose = require(Config.paths.db + '/mongo');
const increment = require('mongoose-auto-increment');
const paginator = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const ModelSchema = require("./user.schema");
const Schema = new mongoose.Schema(ModelSchema.schema);

Schema.plugin(paginator);
Schema.plugin(timestamps);
increment.initialize(mongoose.connection);
Schema.plugin(increment.plugin, { model: ModelSchema.name, field: 'cursor' });

Schema.methods.getToken = function (name) {
    return this.tokens.find(t => t.client === name).token;
}

Schema.statics.getUserTypes = () => ModelSchema.types;
Schema.statics.getPublicFields = () => ModelSchema.publicFields;
Schema.statics.getFillableFields = () => ModelSchema.fillableFields;
Schema.statics.getTokenizerFields = () => ModelSchema.tokenizerFields;
module.exports = mongoose.model(ModelSchema.name, Schema);
