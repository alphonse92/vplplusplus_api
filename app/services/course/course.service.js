const Config = global.Config;
const Util = require(Config.paths.utils);
const MoodleWebservice = require(Config.paths.webservices + "/moodle.client");
const Course = require(Config.paths.models + "/course/course.mongo");

module.exports.getMoodleCourses = getMoodleCourses;
function getMoodleCourses(CurrentUser) {
	let token = CurrentUser.getToken(MoodleWebservice.name);
	let moodleClient = null;
	return MoodleWebservice.getClient(token)
		.then(client => {
			moodleClient = client;
			let opt = { wsfunction: MoodleWebservice.functions.list_courses }
			return moodleClient.call(opt)
		})
		.then(Util.moodle_client.handleResponse)
		.then(Util.moodle_client.createSyncDocumentFunction(Course, {
			valide: updateModelIfIsNecesary,
			transform: transformModelInUpdate
		}))
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
function transformModelInUpdate(MongoDoc,moodleModelToUpdate) {
	mongoDoc = Object.assign(mongoDoc, moodleModelToUpdate);
	mongoDoc.markModified('timemodified'); //force to update
	return mongoDoc;
}



