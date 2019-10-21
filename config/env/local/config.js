module.exports = {
	NODE_PATH: '.',
	HOST: 'localhost',
	PORT: '1337',
	NODE_ENV: 'development',
	SYSTEM_CORES: '1',
	MONGO: 'mongodb://localhost:27017/api-dev',
	MYSQL: 'mysql://root:root@localhost:3306/moodle?connectionAttributes=program_name:vplplusplus_api',
	MOODLE_HOST: 'localhost',
	MOODLE_PORT: '8080',
	MOODLE_DB_PREFIX: 'mdl_',
	MOODLE_AUTH_TYPE: 'saltedcrypt',
	GOOGLE_CLIENT_ID: '126760867544-k1es3tqiho46b0g831cmsvgokvl0npqu.apps.googleusercontent.com',
	INIT_USER_TYPE: 'reset',
	TOKEN_SECRET: 'secret',
	TOKEN_EXP_MINUTES: 'NEVER',
	CACHE_FOLDER: '/tmp/vplplusplus',
	OPEN_DEVELOPMENT_ENDPOINT:true
};