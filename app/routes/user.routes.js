const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "users";
const UserCtr = require(Config.paths.controllers + "/user.controller");


Router.get("/health", (req, res) => res.send("ok"));
Router.post("/auth", UserCtr.auth);
Router.get("/students/", UserCtr.listStudents);
Router.get("/:id?", UserCtr.list);

// Router.post("/", UserCtr.create);

// disable no implemented methods
// Router.get("/", UserCtr.list);
// Router.get("/token/:id", UserCtr.getToken);
// Router.delete("/:id", UserCtr.delete);


Util.log(Base);
module.exports = { Base, Router };