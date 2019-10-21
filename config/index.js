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


getConfig = envVars => ({
	env: envVars.NODE_ENV,
	service: {
		name: "api"
	},
	client: {
		username: envVars.PUBLIC_USERNAME || "FrontEndUserClient"
	},
	app: {
		version: "v1",
		apiPath: "api",
		cacheFolder: envVars.CACHE_FOLDER || os.tmpdir() + '/vplplusplus',
		init: {
			user: envVars.INIT_USER_TYPE || "reset",
			policy: envVars.INIT_USER_TYPE || "reset",
		},
		paginator: {
			limit: +envVars.APP_PAGINATION_LIMIT_DEFAULT || 10,
			limitMax: +envVars.APP_PAGINATION_LIMIT_MAX_DEFAULT || 75,
			page: +envVars.APP_PAGE_DEFAULT || 1,
		}
	},
	system: {
		cores: +envVars.SYSTEM_CORES || os.cpus().length
	},
	db: {
		mongo: envVars.MONGO,
		mysql: envVars.MYSQL
	},
	security: {
		token: envVars.TOKEN_SECRET,
		expiration_minutes: envVars.TOKEN_EXP_MINUTES || 60 * 60 * 24,
		salt_rounds: envVars.SALT_ROUNDS || 10,
		salt: envVars.SALT_ROUNDS || "",
	},
	google: {
		client_id: envVars.GOOGLE_CLIENT_ID
	},
	moodle: {
		web: {
			host: envVars.MOODLE_HOST || "localhost",
			port: envVars.MOODLE_PORT || "80",
			protocol: envVars.MOODLE_PROTOCOL || "http",
			service: envVars.MOODLE_SERVICE || "moodle_mobile_app",
			VPLservice: envVars.VPL_SERVICE || "mod_vpl_edit"
		},
		db: {
			table_prefix: envVars.MOODLE_DB_PREFIX || "mdl_"
		},
		auth: {
			// can be: plaintext, md5, sha1, saltedcrypt review your moodle config
			type: envVars.MOODLE_AUTH_TYPE || "saltedcrypt"
		},
	},
	web: {
		host: envVars.HOST || "localhost",
		port: envVars.PORT || "1337"
	},
	paths: { cwd, app, config, public: publicPath, utils, controllers, db, routes, models, services, errors, lang, webservices }
});

module.exports = (function () {
	const fileconfig = require('./env/' + (envVars.NODE_ENV ? envVars.NODE_ENV : 'local') + '/config');
	const configFromEnvars = getConfig(process.env)
	const configFromFile = getConfig(fileconfig || {})
	const config = { ...configFromEnvars, ...configFromFile }

	if (!config.security.token) throw new Error("God, staph, ¡ token security is required ! ");

	config.client.email = config.client.username + "@" + config.web.host;
	
	return config;
})();
