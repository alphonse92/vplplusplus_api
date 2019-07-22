const Config = global.Config;
const Router = require("express").Router();
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "token";
const TokenController = require(Config.paths.controllers + "/token.controller");

Router.get("/health", (req, res) => res.send("ok"));

Router.get("/:id?", TokenController.get);
Router.post("/", TokenController.create);
Router.delete("/:id", TokenController.delete);

Util.log(Base);

module.exports = { Base, Router };


