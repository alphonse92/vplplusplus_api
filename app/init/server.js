const express = require('express'); //ok
const logger = require('morgan'); //ok
const helmet = require('helmet'); //ok
const bodyParser = require('body-parser');
const cors = require('cors');
const cluster = require('cluster');
const Config = global.Config;
const Util = require(Config.paths.utils)
const app = express();
const PolicyAccessManagerMiddleware = require(Config.paths.services + "/policy/policy.access-manager.service").getMiddleware({ service: Config.service.name })
const GetUserMiddleware = require(Config.paths.services + "/user/user.service").getGetUserMiddleware();
const LoadUserPolicies = require(Config.paths.services + "/policy/policy.service").getLoadUserPoliciesMiddleware();
module.exports = function (config) {
	return addPreRoutesMiddlewares(app)
		.then(addRoutes)
		.then(AddPostRoutesMiddleware)
		.then(init)
		.catch(err => {
			console.log(err)
			if (err.code === "BABEL_PARSE_ERROR") console.log(err)
			else if (err.http_code) Util.log(err);
			else console.log(err) && Util.log(err);
		})
};

function addPreRoutesMiddlewares(app) {
	app.use(logger('dev'))
		.use(helmet())
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({ extended: false }))
		.use(express.static(Config.paths.public))
		.use(cors({ credentials: true, origin: true }))
		.use(GetUserMiddleware)
		.use(LoadUserPolicies)
		.use(PolicyAccessManagerMiddleware)

	return Promise.resolve(app);

}
function addRoutes(app) {
	return Util.files.readDir(Config.paths.routes)
		.then(routesList => routesList.map(routePath => require(Config.paths.routes + "/" + routePath)))
		.then(Routers => Routers.forEach(Router => app.use(Router.Base, Router.Router)))
		.then(() => app);
}

function AddPostRoutesMiddleware(app) {
	app.use((err, req, res, next) => {
		try {
			if (err.code === "BABEL_PARSE_ERROR") console.log(err)
			else if (err.http_code) Util.log(err);
			else console.log(err) && Util.log(err);
			const {
				http_code = 500,
				error = { code: -1, message: "Server Error" }
			} = err
			res.status(http_code).send(error)
		} catch (e) {
			console.log(e)
		}
	})
	return Promise.resolve(app)
}

function init(app) {
	return new Promise((resolve, reject) => {
		app.disable('x-powered-by');
		app.disable('etag');
		app.listen(Config.web.port, function () {
			Util.log('Server is running on port: ', Config.web.port, "  and worker: ", (cluster.worker ? cluster.worker.id : 'n/a'));
			resolve(app);
		});
	})
}



