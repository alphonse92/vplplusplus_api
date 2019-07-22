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
Router.get("/:id/compile", ProjectController.compile);
Router.get("/:id/export/:type", ProjectController.export);
Router.post("/", ProjectController.create);
Router.patch("/:id", ProjectController.update);
Router.delete("/:id", ProjectController.delete);

Router.get("/:id/test/:id?", TestController.get);
Router.get("/:id/test/:id/compile", TestController.compile);
Router.post("/:id/test/", TestController.create);
Router.patch("/:id/test/:id", TestController.update);
Router.delete("/:id/test/:id", TestController.delete);

Router.get("/:id/test/:id/case/:id?", TestCaseController.get);
Router.post("/:id/test/:id/case/:id/compile", TestCaseController.compile);
Router.post("/:id/test/:id/case/", TestCaseController.create);
Router.patch("/:id/test/:id/case/:id", TestCaseController.update);
Router.delete("/:id/test/:id/case/:id", TestCaseController.delete);

Router.get("/:id/test/:id/case/:id/summary/:id?", SummaryController.get);
Router.post("/:id/test/:id/case/:id/summary/", SummaryController.create);


Util.log(Base);

module.exports = { Base, Router };


