const Config = require("./config/");
global.Config = Config;
const bootstrap = require('./app/init/bootstrap');
const init = require('./app/init/server');

bootstrap()
	.then(r => {
		init(Config)
	})

// const cluster = require('cluster');
// const Config = require("./config/");
// const Util = require(Config.paths.utils);
// global.Config = Config;
// if(cluster.isMaster){
// 	Util.log(`Cluster master is running in ${process.pid} PID`);
// 	const bootstrap = require('./app/init/bootstrap');
// 	bootstrap()
// 		.then(result => {
// 			var workerIds = [];
// 			for(var i = 0; i < Config.system.cores; i += 1){
// 				Util.log("Creating worker")
// 				let worker = cluster.fork();
// 				workerIds[worker.id] = worker.id;
// 				Util.log("Worker [", worker.id, "] created");
// 			}
// 			cluster.on('exit', function(worker){
// 				Util.log('Cluster worker die [', worker.id, "]");
// 				Util.log("--- removing")
// 				delete workerIds[worker.id];
// 				Util.log("--- removed succesfully")
// 				Util.log('Trying to reboot worker [', worker.id, "]");
// 				let newWorker = cluster.fork();
// 				workerIds[newWorker.id] = newWorker.id;
// 				Util.log('New worker was created [', newWorker.id, "]");
// 			});
// 		})
// }else{
// 	const init = require('./app/init/server');
// 	init(Config)
// }
