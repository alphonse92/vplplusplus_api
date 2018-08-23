const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "dev";
const DevController = require(Config.paths.controllers + "/development.controller");

if(Config.env === "dev" || Config.env === "development"){
	Router.get("/health", (req, res) => res.send("ok"));
	Router.get("/call_moodle_ws?", DevController.call_moodle_func);
	Util.log("Setting development endpoint " + Base)
}



Util.log(Base);
module.exports = {Base, Router};