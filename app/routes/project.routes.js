const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "project";
const ProjectController = require(Config.paths.controllers + "/project.controller");
const TestController = require(Config.paths.controllers + "/project.test.controller");
const TestCaseController = require(Config.paths.controllers + "/project.test.case.controller");
const SummaryController = require(Config.paths.controllers + "/project.test.case.summary.controller");

Router.get("/health", (req, res) => res.send("ok"));

Router.get("/:id?", ProjectController.get);
Router.post("/", ProjectController.create);
Router.patch("/:id", ProjectController.update);
Router.delete("/:id", ProjectController.delete);

Router.get("/test/:id?", TestController.get);
Router.post("/test/", TestController.create);
Router.patch("/test/:id", TestController.update);
Router.delete("/test/:id", TestController.delete);

Router.get("/test/:id/case/:id?", TestCaseController.get);
Router.post("/test/:id/case/", TestCaseController.create);
Router.patch("/test/:id/case/:id", TestCaseController.update);
Router.delete("/test/:id/case/:id", TestCaseController.delete);

Router.get("/test/:id/case/summary/:id?", SummaryController.get);
Router.post("/test/:id/case/summary/", SummaryController.create);
Router.patch("/test/:id/case/:id/summary/:id", SummaryController.update);
Router.delete("/test/:id/case/:id/summary/:id", SummaryController.delete);

Util.log(Base);

module.exports = { Base, Router };


