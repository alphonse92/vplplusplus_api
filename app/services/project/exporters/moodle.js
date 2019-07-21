const Config = global.Config;
const MoodleBackupService = require(Config.paths.services + '/moodle/moodle.backup.service');
module.exports = (ProjectDoc) => MoodleBackupService.createBackupFromProjectDocument(ProjectDoc)