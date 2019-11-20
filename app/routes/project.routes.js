const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "project";
const ProjectController = require(Config.paths.controllers + "/project.controller");
const TestController = require(Config.paths.controllers + "/project.test.controller");
const TestCaseController = require(Config.paths.controllers + "/project.test.case.controller");
const SummaryController = require(Config.paths.controllers + "/project.test.case.summary.controller");
const SummaryReportController = require(Config.paths.controllers + "/project.test.case.summary.controller");

Router.get("/health", (req, res) => res.send("ok"));

Router.get("/list", ProjectController.list);
Router.get("/:id/export/:type", ProjectController.export);
Router.get("/:id?", ProjectController.get);
Router.post("/", ProjectController.create);
Router.patch("/:id", ProjectController.update);
Router.delete("/:id", ProjectController.delete);

Router.get("/:project_id/test/:id?", TestController.get);
Router.get("/:project_id/test/:id/compile", TestController.compile);
Router.post("/:project_id/test/", TestController.create);
Router.patch("/:project_id/test/:id", TestController.update);
Router.delete("/:project_id/test/:id", TestController.delete);

Router.get("/:project_id/test/:test_id/case/:id?", TestCaseController.get);
Router.post("/:project_id/test/:test_id/case/:id/compile", TestCaseController.compile);
Router.post("/:project_id/test/:test_id/case/", TestCaseController.create);
Router.patch("/:project_id/test/:test_id/case/:id", TestCaseController.update);
Router.delete("/:project_id/test/:test_id/case/:id", TestCaseController.delete);


Router.get('/report/topic/timeline', SummaryReportController.getTopicTimeline) // get report of especific project

Router.get('/report/user/:moodle_student_id/', SummaryReportController.getUserReports) // get report of specific user
Router.get('/report/user/:moodle_student_id/timeline/', SummaryReportController.getStudentReportTimeline) // get report of students evolution (how the skill level student change along the time)

Router.get('/:id/report', SummaryReportController.getUserReports) // get report of especific project
Router.get('/:id/report/timeline', SummaryReportController.getProjectReportTimeline) // get report of especific project


Router.post("/test/case/summary/", SummaryController.create);



Util.log(Base);

module.exports = { Base, Router };


