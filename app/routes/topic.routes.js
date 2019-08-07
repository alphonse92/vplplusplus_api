const Config = global.Config;
const Router = require("express").Router();
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "topic";
const Controller = require(Config.paths.controllers + "/topic.controller");

Router.get("/health", (req, res) => res.send("ok"));
Router.get("/", Controller.get);
Router.post("/", Controller.create);
Router.delete("/:id", Controller.delete);
Util.log(Base);
module.exports = { Base, Router };


