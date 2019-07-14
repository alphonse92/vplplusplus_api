const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "project";
const ProjectController = require(Config.paths.controllers + "/project.controller");

Router.get("/health", (req, res) => res.send("ok"));
Router.get("/", ProjectController.get);

Util.log(Base);

module.exports = { Base, Router };


