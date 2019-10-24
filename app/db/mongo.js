const Config = global.Config;
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const uri = Config.db.mongo;
const autoIndex = Config.app.open_development_endpoint
console.log(autoIndex)
mongoose.connect(uri, { useNewUrlParser: true, autoIndex });
mongoose.plugin(beautifyUnique);
module.exports = mongoose;