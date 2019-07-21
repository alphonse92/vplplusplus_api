const os = require('os')
const cwd = process.cwd();
const app = cwd + "/app";
const config = cwd + "/config";
const publicPath = cwd + "/public";
const utils = app + "/utils";
const controllers = app + "/controllers";
const db = app + "/db";
const routes = app + "/routes";
const models = app + "/models";
const services = app + "/services";
const errors = app + "/errors";
const lang = app + "/language";
const webservices = app + "/webservices";
const defaultConfig = {
	env: process.env.NODE_ENV,
	service: {
		name: "api"
	},
	client: {
		username: process.env.PUBLIC_USERNAME || "__API__"
	},
	app: {
		version: "v1",
		apiPath: "api",
		cacheFolder: process.env.CACHE_FOLDER || os.tmpdir() + '/vplplusplus',
		init: {
			user: process.env.INIT_USER_TYPE || "reset",
			policy: process.env.INIT_USER_TYPE || "reset",
		},
		paginator: {
			limit: +process.env.APP_PAGINATION || 10,
			page: +process.env.APP_PAGE || 1,
		}
	},
	system: {
		cores: +process.env.SYSTEM_CORES || os.cpus().length
	},
	db: {
		mongo: process.env.MONGO,
		mysql: process.env.MYSQL
	},
	security: {
		token: process.env.TOKEN_SECRET,
		expiration_minutes: process.env.TOKEN_EXP_MINUTES || 60 * 60 * 24,
		salt_rounds: process.env.SALT_ROUNDS || 10,
		salt: process.env.SALT_ROUNDS || "",
	},
	google: {
		client_id: process.env.GOOGLE_CLIENT_ID
	},
	moodle: {
		web: {
			host: process.env.MOODLE_HOST || "localhost",
			port: process.env.MOODLE_PORT || "80",
			protocol: process.env.MOODLE_PROTOCOL || "http",
			service: process.env.MOODLE_SERVICE || "moodle_mobile_app",
			VPLservice: process.env.VPL_SERVICE || "mod_vpl_edit"
		},
		db: {
			table_prefix: process.env.MOODLE_DB_PREFIX || "mdl_"
		},
		auth: {
			// can be: plaintext, md5, sha1, saltedcrypt review your moodle config
			type: process.env.MOODLE_AUTH_TYPE || "saltedcrypt"
		},
	},
	web: {
		host: process.env.HOST || "localhost",
		port: process.env.PORT || "1337"
	},
	paths: { cwd, app, config, public: publicPath, utils, controllers, db, routes, models, services, errors, lang, webservices }
};

module.exports = (function () {
	const _ = require('lodash');
	const envConfig = require('./env/' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'local') + '/config');
	const config = _.merge(defaultConfig, envConfig);
	if (!config.security.token) {
		throw new Error("God, staph, ¡ token security is required ! ");
	}
	config.client.email = config.client.username + "@" + config.web.host;
	return config;
})();
