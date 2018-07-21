const Config = global.Config;
const mongoose = require('mongoose');
const uri = Config.db.mongo;
mongoose.connect(uri, {useNewUrlParser:true});
module.exports = mongoose;