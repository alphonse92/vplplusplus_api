const Config = global.Config;
const Util = require(Config.paths.utils);
const PoliciesFixtures = require(Config.paths.services + "/policy/fixtures/policies");
const listeners = {
	uncaughtException(err){
		Util.log('============     uncaughtException    ===============')
		Util.log(err.message);
		Util.log(err.stack);
		Util.log('============     uncaughtException    ===============')
	},
	message(message){
		if(message.type === "shutdown")
			process.exit(0);
	}
}

function addAppListeners(){
	Util.log("Adding listeners");
	Object.keys(listeners, listener => process.on('listener', listeners[listener]))
}

function createDefaultUserIfNotExist(){
	return require(Config.paths.services + "/user/user.service").createDefaultUserIfNotExist();

}

function createDefaultPoliciesIfNotExist(){
	return require(Config.paths.services + "/policy/policy.service").createDefaultPoliciesIfNotExist();
}


module.exports = bootstrap;
function bootstrap(){
	Util.log("Bootstraping");
	addAppListeners();
	return createDefaultUserIfNotExist()
		.then(() => createDefaultPoliciesIfNotExist)
		.catch(err => Util.response.handleError(err, null))
}


