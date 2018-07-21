const express = require('express'); //ok
const logger = require('morgan'); //ok
const helmet = require('helmet'); //ok
const bodyParser = require('body-parser');
const cors = require('cors');
const cluster = require('cluster');
const Config = global.Config;
const Util = require(Config.paths.utils)
const app = express();

module.exports = function(config){
	return addPreRoutesMiddlewares(app)
		.then(addRoutes)
		.then(AddPostRoutesMiddleware)
		.then(init)
		.catch(err => {
			Util.log(err);
		})
};

function addPreRoutesMiddlewares(app){
	app.use(logger('dev'))
		.use(helmet())
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({extended:false}))
		.use(express.static(Config.paths.public))
		.use(cors({credentials:true, origin:true}))
	return Promise.resolve(app);

}
function addRoutes(app){
	return Util.files.readDir(Config.paths.routes)
		.then(routesList => routesList.map(routePath => require(Config.paths.routes + "/" + routePath)))
		.then(Routers => Routers.forEach(Router => app.use(Router.Base, Router.Router)))
		.then(() => app);
}

function AddPostRoutesMiddleware(app){
	return Promise.resolve(app)
}

function init(app){
	return new Promise((resolve, reject) => {
		app.disable('x-powered-by');
		app.disable('etag');
		app.listen(Config.web.port, function(){
			Util.log('Server is running on port: ', Config.web.port, "  and worker: ", (cluster.worker ? cluster.worker.id : 'n/a'));
			resolve(app);
		});
	})
}



