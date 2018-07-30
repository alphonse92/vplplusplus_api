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
const lang = app + "/language";
const defaultConfig = {
	env:process.env.NODE_ENV,
	service:{
		name:"api"
	},
	client:{
		username:process.env.PUBLIC_USERNAME || "__API__"
	},
	app:{
		version:"v1",
		apiPath:"api",
		init:{
			user:process.env.INIT_USER_TYPE || "first_time",
			policy:process.env.INIT_USER_TYPE || "first_time",
		}
	},
	system:{
		cores:+process.env.SYSTEM_CORES || require('os').cpus().length
	},
	db:{
		mongo:process.env.MONGO,
		mysql:process.env.MYSQL
	},
	security:{
		token:process.env.TOKEN_SECRET || "2hg3487wtfasdfyuavw4r78fDCUSHVAG78",
		expiration_minutes:60 * 60 * 24,
		salt_rounds:process.env.SALT_ROUNDS || 10,
		salt:process.env.SALT_ROUNDS || "",
	},
	moodle:{
		db:{
			table_prefix:process.env.MOODLE_DB_PREFIX || "mdl_"
		},
		auth:{
			// can be: plaintext, md5, sha1, saltedcrypt review your moodle config
			type:process.env.MOODLE_AUTH_TYPE || "saltedcrypt"
		},
		archetypes:require("./archetypes")
	},
	web:{
		host:process.env.HOST || "localhost",
		port:process.env.PORT || "1337"
	},
	paths:{cwd, app, config, public, utils, controllers, db, routes, models, services, errors, lang}
};

defaultConfig.client.email = defaultConfig.client.username + "@" + defaultConfig.web.host;

module.exports = (function(){
	const _ = require('lodash');
	const envConfig = require('./env/' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'local') + '/config');
	const config = _.merge(defaultConfig, envConfig);
	return config;
})();
