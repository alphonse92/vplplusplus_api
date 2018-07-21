const cwd = process.cwd();
const app = cwd + "/app";
const config = cwd + "/config";
const public = cwd + "/public";
const utils = app + "/utils";
const controllers = app + "/controllers";
const db = app + "/db";
const routes = app + "/routes";
const models = app + "/models";
const services = app + "/services";
const errors = app + "/errors";

const defaultConfig = {
	env:process.env.NODE_ENV,
	app:{
		version:"v1",
		apiPath:"api",
	},
	db:{
		mongo:process.env.MONGO,
		mysql:process.env.MYSQL
	},
	security:{
		token:process.env.TOKEN_SECRET
	},
	web:{
		host:process.env.HOST || "localhost",
		port:process.env.PORT || "1337"
	},
	paths:{cwd, app, config, public, utils, controllers, db, routes, models, services, errors}
};
module.exports = (function(){
	const _ = require('lodash');
	const envConfig = require('./env/' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'local') + '/config');
	const config = _.merge(defaultConfig, envConfig);
	return config;
})();
