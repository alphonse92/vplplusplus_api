const Router = require("express").Router();
const Config = global.Config;
const Util = require(Config.paths.utils);
const Base = '/' + Config.web.public + '/' + Config.app.version + '/' + "course";
const CourseController = require(Config.paths.controllers + "/course.controller");

Router.get("/health", (req, res) => res.send("ok"));
// Router.get("/", CourseController.getCourses);
// Router.get("/:course_id/activity/:activity_id?", ActivityController.getMoodleVplActivitiesCourse)

Router.get("/activities", CourseController.getActivities);


Util.log(Base);
module.exports = { Base, Router };


