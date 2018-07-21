const Config = global.Config;
const Util = require(Config.paths.utils);
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


module.exports = bootstrap;
function bootstrap(){
	Util.log("Bootstraping");
	addAppListeners();
	return Promise.resolve();
}


