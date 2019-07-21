const Config = global.Config;
const zlib = require('zlib')
const tar = require('tar-fs')
const fs = require('fs-extra')
// const path = require("path");
const moodleFilesCreator = require('./moodle.backup.file_creator')
const BACKUP_FILES = "./files/backup_files"

function createFile(string, path) {
  return new Promise((resolve, reject) => {
    const finish = (err) => err
      ? reject(err)
      : resolve({ string, path })
    const createXml = fs.createWriteStream(path);
    createXml.end(string, 'utf8');
    createXml.on('finish', finish);
  })
}

async function createMoodleBackupFile(BackupName, ProjectDoc, pathBackupFiles) {
  const data = await moodleFilesCreator.getmoodle_backupDotXMLFromProjectDocument(BackupName, ProjectDoc)
  const path = `${pathBackupFiles}/moodle_backup.xml`
  return createFile(data, path)
}

async function createModuleActivityVpl(ProjectDoc, pathBackupFiles) {
  const data = await moodleFilesCreator.getActivityModuleDotXMLFromProjectDocument(ProjectDoc)
  const path = `${pathBackupFiles}/activities/vpl_4/vpl.xml`
  return createFile(data, path)
}



async function createMainFilesBackup(BackupName, ProjectDoc, backupFolder) {
  await createMoodleBackupFile(BackupName, ProjectDoc, backupFolder)
  await createModuleActivityVpl(ProjectDoc, backupFolder)
}

function createTar(name, pathEntry, pathOut) {
  return new Promise((resolve, reject) => {
    const path = `${pathOut}/${name}.tgz`
    tar.pack(pathEntry)
      .pipe(zlib.Gzip())
      .pipe(fs.createWriteStream(path))
      .on('finish', (err, data) => {
        err
          ? reject(err)
          : resolve({ name, path })
      })

  })
}

module.exports.createBackupFromProjectDocument = createBackupFromProjectDocument
async function createBackupFromProjectDocument(ProjectDoc = {}, dir = Config.app.cacheFolder) {

  const ts = Date.now()
  const backupName = `${ProjectDoc.owner._id.toString()}_${ts}`
  const backupRoot = `${dir}/${backupName}`
  const backupFolder = `${backupRoot}/files`

  // create the file folder if it not exists
  await fs.ensureDir(backupFolder)
  // copy the files from the backup folder to the new backup foldere
  await fs.copy(BACKUP_FILES, `${backupFolder}`)
  // create the required files to create the backup succesfully
  await createMainFilesBackup(backupName, ProjectDoc, backupFolder)
  // compress as tar
  return await createTar(backupName, backupFolder, backupRoot)
}
