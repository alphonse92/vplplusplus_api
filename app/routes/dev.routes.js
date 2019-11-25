const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.web.public + '/' + Config.app.version + '/' + "dev";
const DevController = require(Config.paths.controllers + "/development.controller");

if (Config.app.open_development_endpoint) {
	Router.get("/health", (req, res) => res.send("ok"));
	Router.post('/createFakeProject', DevController.createFakeProject)
	Router.post('/updatePolicies', DevController.updatePolicies)
	Router.post('/createTopics', DevController.createTopics)
	Util.log(Base)
}

module.exports = { Base, Router };