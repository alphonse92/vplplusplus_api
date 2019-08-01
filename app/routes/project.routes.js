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

Router.get("/:id?", ProjectController.get);
Router.get("/:id/compile", ProjectController.compile);
Router.get("/:id/export/:type", ProjectController.export);
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


// from all projects
Router.get('/report', SummaryReportController.getReportProject) // get report of all projects
Router.get('/report/user', SummaryReportController.getUserReports) // get report of all users
Router.get('/report/user/evolution/',SummaryReportController.getUserEvolution) // get report of students evolution (how the skill level student change along the time)
Router.get('/report/user/:moodle_student_id', SummaryReportController.getUserReports) // get report of specific user
Router.get('/report/user/:moodle_student_id/evolution/',SummaryReportController.getUserEvolution) // get report of students evolution (how the skill level student change along the time)

//  select a project and create a report from it
Router.get('/:id/report', SummaryReportController.getReportProject) // get report of especific project
Router.get('/:id/report/user',SummaryReportController.getUserReports) // get report of all users of specific project
Router.get('/:id/report/user/:moodle_student_id',SummaryReportController.getUserReports) // get report of specific user of specific project

// this routes will be used by the runner, im not following the REST
// especification because we need add to the vpl ++ jlib
// the annotations to set the project, test and test case.
// So we adding a entrypoint to the summary controller
// Router.get("/test/case/summary/:id?", SummaryController.get);
// Router.get("/test/:test_case_id/summary/:id?", SummaryController.get);
Router.post("/test/case/summary/", SummaryController.create);



Util.log(Base);

module.exports = { Base, Router };


