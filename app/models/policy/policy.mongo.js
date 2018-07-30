const Config = global.Config;
const mongoose = require(Config.paths.db + '/mongo');
const increment = require('mongoose-auto-increment');
const paginator = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const ModelSchema = require("./policy.schema");
const Schema = new mongoose.Schema(ModelSchema.schema);

Schema.plugin(paginator);
Schema.plugin(timestamps);
increment.initialize(mongoose.connection);
Schema.plugin(increment.plugin, {model:ModelSchema.name, field:'cursor'});
Schema.statics.getResourceNameSeparator = ModelSchema.resourceNameSeparator;

Schema.methods.getResource = function(){
	let parts = this.resource.split(ModelSchema.resourceNameSeparator);
	return {
		service:parts[1],
		owner:parts[2],
		resource:parts[3],
		action:parts[4]
	}
}

module.exports = mongoose.model(ModelSchema.name, Schema);
