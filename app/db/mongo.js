const Config = global.Config;
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const uri = Config.db.mongo;
mongoose.connect(uri, { useNewUrlParser: true });
mongoose.plugin(beautifyUnique);
module.exports = mongoose;