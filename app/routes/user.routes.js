const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "users";
const UserCtr = require(Config.paths.controllers + "/user.controller");

Router.get("/health", (req, res) => res.send("ok"));
Router.get("/:id?", UserCtr.find);
Router.post("/auth", UserCtr.auth);
Router.post("/", UserCtr.create);
Router.put("/", UserCtr.update)
Router.delete("/", UserCtr.delete)


Util.log(Base);
module.exports = {Base, Router};