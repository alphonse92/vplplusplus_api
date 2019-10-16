const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "dev";
const DevController = require(Config.paths.controllers + "/development.controller");

console.log(DevController)

if (Config.env === "dev" || Config.env === "development") {
	Router.get("/health", (req, res) => res.send("ok"));
	// route to create a fake project with fake tests, testes cases and summaries
	Router.post('/projects/fake/', DevController.createFakeProject)
	Util.log(Base)
}



Util.log(Base);
module.exports = { Base, Router };