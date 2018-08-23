const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.app.apiPath + '/' + Config.app.version + '/' + "course";
const CourseController = require(Config.paths.controllers + "/course.controller");
const ActivityController = require(Config.paths.controllers + "/activity.controller");


Router.get("/health", (req, res) => res.send("ok"));
Router.get("/", CourseController.getCourses);
Router.get("/:course_id/activity/:activity_id?", ActivityController.getMoodleVplActivitiesCourse)


Util.log(Base);
module.exports = {Base, Router};


