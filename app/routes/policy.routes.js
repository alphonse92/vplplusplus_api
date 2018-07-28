const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "policies";
const PolicyCtrl = require(Config.paths.controllers + "/policy.controller");

Router.get("/health", (req, res) => res.send("ok"));
Router.get("/:id?", PolicyCtrl.find);
Router.post("/", PolicyCtrl.create);
Router.put("/", PolicyCtrl.update)
Router.delete("/", PolicyCtrl.delete)


Util.log(Base);
module.exports = {Base, Router};