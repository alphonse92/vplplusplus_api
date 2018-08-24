/**
 * Remember:
 * 
 * The activities in moodle are called as course module, because 
 * each actiivty plugin (eg quiz forums or vpl, etc) can be added 
 * to any course as a module of it.
 * 
 * Keep in your mind: 
 * 
 * Course = Moodle course
 * Activity => Moodle Course Module
 * 
 * In each course, has a sections, each section has a modules.
 * 
 * In VPL++ dont have sections, but the activity schema stores referencies to 
 * each section.
 * 
 * 
 */


const Config = global.Config;
const Util = require(Config.paths.utils);
const Activity = require(Config.paths.models + "/activity/activity.mongo");
const Course = require(Config.paths.models + "/course/course.mongo");
const MoodleWebservice = require(Config.paths.webservices + "/moodle.client");
const CourseErrors = require(Config.paths.errors + "/course.errors");
const ActivityErrors = require(Config.paths.errors + "/activity.errors");

module.exports.getMoodleVplActivitiesCourse = getMoodleVplActivitiesCourse;
function getMoodleVplActivitiesCourse(CurrentUser, courseid) {
	let token = CurrentUser.getToken(MoodleWebservice.name);
	let moodleClient = null;
	let CourseDoc = null;
	return Course
		.findById(courseid) // get document
		.then(CourseDocument => {
			if (!CourseDocument)
				return Promise.reject(CourseErrors.course_doesnt_found);
			CourseDoc = CourseDocument;
			return MoodleWebservice.getClient(token);

		})
		.then(client => {
			moodleClient = client;
			let opt = {
				wsfunction: MoodleWebservice.functions.list_module_course,
				args: {
					courseid: CourseDoc.id,
					options: [
						{ name: "modname", value: "vpl" }
					]
				}
			}
			return moodleClient.call(opt);
		})
		.then(MoodleCourseSections => getActivityModelDataFromCourseSections(CourseDoc, MoodleCourseSections))
		.then(Util.moodle_client.createSyncDocumentFunction(Activity, {
			valide: updateModelIfIsNecesary,
			transform: transformModelInUpdate
		}))
}


/**
 * This function returns an array of Activity Data (for Mongo Model usage see: Activity schema)
 * from raw Course sections array
 * @param ActivityMoodleModels Array<ActivityMoodleModel> | ActivityMoodleModel
 */
module.exports.getActivityModelDataFromCourseSections = getActivityModelDataFromCourseSections;
function getActivityModelDataFromCourseSections(CourseDoc, MoodleCourseSectionsApiRaw) {
	return MoodleCourseSectionsApiRaw
		.reduce((out, MoodleCourseSections) => {
			let modules = getActivityDataFromSectionModules(CourseDoc, MoodleCourseSections)
			out = out.concat(modules);
			return out;
		}, [])
}


/**
 * This functions parse an  Moodle Course Section Module's array to Course Activity Data. 
 * See Activity Schema.
 */
module.exports.getActivityDataFromSectionModules = getActivityDataFromSectionModules;
function getActivityDataFromSectionModules(CourseDoc, CourseSection) {
	return CourseSection.modules.map(CourseActivityModule => {
		return getActivityDataFromSectionModule(CourseDoc, CourseSection, CourseActivityModule)
	})
}


/**
 * This function returns a CourseActivity ready for storage in mongo from Moodle Course Section Module. 
 * See Activity Schema.
 */
module.exports.getActivityDataFromSectionModule = getActivityDataFromSectionModule;
function getActivityDataFromSectionModule(CourseDoc, CourseSection, CourseSectionModule) {
	CourseSectionModule.section_id = CourseSection.id;
	CourseSectionModule.section_name = CourseSection.name;
	CourseSectionModule.section_visible = CourseSection.visible;
	CourseSectionModule.section_uservisible = CourseSection.uservisible;
	CourseSectionModule.course_id = CourseDoc.id;
	CourseSectionModule.course__id = CourseDoc._id;
	return CourseSectionModule;
}


/**
 * This function valide if the Course Mongo Model was change against the Moodle Course data
 * representation from API.
 * @param {*} mongoDoc 
 * @param {*} moodleModelToUpdate 
 */
function updateModelIfIsNecesary(mongoDoc, moodleModelToUpdate) {
	moodleModelToUpdate.timemodified = moodleModelToUpdate.timemodified || "";
	mongoDoc.timemodified = mongoDoc.timemodified || "";
	return mongoDoc.timemodified.toString() !== moodleModelToUpdate.timemodified.toString();

}

/*+
 * This function update the Course Model with the Moodle Course data from representation from API
 * @param {*} MongoDoc 
 * @param {*} moodleModelToUpdate 
 */
function transformModelInUpdate(MongoDoc, moodleModelToUpdate) {
	mongoDoc = Object.assign(mongoDoc, moodleModelToUpdate);
	mongoDoc.markModified('timemodified'); //force to update
	return mongoDoc;
}
