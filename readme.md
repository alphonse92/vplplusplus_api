# VPL plus plus API 

This is the repository of VPL++ API. Its belongs to the VPL++ ecosystem.

# Requeriments 

1. Node v8 or greater
2. Babel-node not required, it will installed as dev dependency.
3. npx
4. nodemon for local development 
5. postman

# Installation

1. npm install 

# Configuration

The way to configure the API is environment variables. However if you dont want to use enviroment variables you can choose by config file.

The folder `config/env` contains the folders that will be used by environment. Each folder inside matchs with the environment name. For example, the folder `config/env/custom` matchs with the enviroment called `custom`.

The api will try to read the file `index.js`. 

**warning:** The `index.js` file is more relevant than the enviroment variables. Its mean, the `index.js` file overwritte the enviroment variables


```
 ..root
   |....config
      |.........env
              |........custom
                      |........index.js
```

the index.js for a config file looks like:


For example 

```javascript
module.exports = {
	NODE_PATH: '.',
	HOST: 'localhost',
	PORT: '1337',
	PUBLIC: 'api',
	NODE_ENV: 'development',
	SYSTEM_CORES: '1',
	MONGO: 'mongodb://vpladmin:secret@localhost:27017/vpl-dev?authSource=admin',
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
	OPEN_DEVELOPMENT_ENDPOINT: "true",
	SHOW_CONFIG_AT_STARTUP: "true"
};
```

## Variables

1. HOST: The domain where the api is allocated.
2. PORT: API port
3. PUBLIC: is the public path to the API, usefull when run it besida a gateway
4. NODE_ENV: enviroment name,
5. SYSTEM_CORES: the api will use this cores in the host cpu,
6. MONGO: mongo connection string
7. MYSQL: mysql connection string
8. MOODLE_HOST: Moodle host
9. MOODLE_PORT: Moodle port
10. MOODLE_DB_PREFIX: Moddle table prefix
11. MOODLE_AUTH_TYPE: for now, is only available 'saltedcrypt'. It is the alghoritm that moodle use to validate the user passwords
12. GOOGLE_CLIENT_ID: In order to login with gooogle, it should be the client application in your google console.
13. TOKEN_SECRET: JWT secret. Be carefull and does not exposes that.
14. TOKEN_EXP_MINUTES: It could be `NEVER` or a number. Its the time in minutes that the tokens will expires for the users sessions
15. CACHE_FOLDER: Host path for caching folder
16. OPEN_DEVELOPMENT_ENDPOINT: Potentially dangerous. Its exposes a development endpoint.
17. SHOW_CONFIG_AT_STARTUP: print the current configuration that the api take. Only admit true.

# Build docker image

`docker-compose build api`

# Running

After you set the enviroment variables by each enviroment. You can run each enviroment running the next commands

### From scratch

Before execute the server, you can define the environment if you set the env var **NODE_ENV**

##### If you has not babel
`NODE_PATH=. node node_modules/@babel/node/bin/babel-node.js server.js`

##### If you has not babel but has npx
`NODE_PATH=. npx babel-node server.js`

##### If you has babel
`NODE_PATH=. babel-node server.js`

### Production
`npm start`

### Development
`npm startdev`

### Local
`npm startlocal`

# Endpoints

At root project, there is a exported Postman collections.