const fs = require('fs')
const tar = require('tar-fs')
const zlib = require('zlib')

function createVPLActivityFile(ProjectDoc) {
  const {
    name,
    description
  } = ProjectDoc
  const shortdescription = description.substring(0, 15) + '...'
  const schemaInfo = ProjectDoc
    .tests
    .reduce((out, test) => {
      const testCompiled = test.compile()
      const { filename, code } = testCompiled
      const tag =
        `<execution_file id="">
   <name>execution_files/${testCompiled.file_name}</name>
    <content>execution_files/${testCompiled.code}</content>
</execution_file>`
      out.executionFileNames += filename + '\n'
      out.executionFilesTags += tag + '\n'
    }, { executionFileNames: '', executionFilesTags: '' })


  return `<?xml version="1.0" encoding="UTF-8"?>
<activity id="3" moduleid="4" modulename="vpl" contextid="50">
  <vpl id="3">
    <name>${name}</name>
    <shortdescription>${shortdescription}</shortdescription>
    <intro>${description}</intro>
    <introformat>1</introformat>
    <startdate>0</startdate>
    <duedate>0</duedate>
    <maxfiles>100</maxfiles>
    <maxfilesize>0</maxfilesize>
    <requirednet></requirednet>
    <password></password>
    <grade>100</grade>
    <visiblegrade>1</visiblegrade>
    <usevariations>0</usevariations>
    <variationtitle>$@NULL@$</variationtitle>
    <basedon>$@NULL@$</basedon>
    <run>0</run>
    <debug>0</debug>
    <evaluate>0</evaluate>
    <evaluateonsubmission>0</evaluateonsubmission>
    <automaticgrading>0</automaticgrading>
    <maxexetime>$@NULL@$</maxexetime>
    <restrictededitor>0</restrictededitor>
    <example>0</example>
    <maxexememory>$@NULL@$</maxexememory>
    <maxexefilesize>$@NULL@$</maxexefilesize>
    <maxexeprocesses>$@NULL@$</maxexeprocesses>
    <jailservers>$@NULL@$</jailservers>
    <emailteachers>0</emailteachers>
    <worktype>0</worktype>
    <required_files>
    </required_files>
    <execution_files>
      <execution_file id="">
        <name>execution_files.lst</name>
        <content>
          vpl_run.sh
          vpl_debug.sh
          vpl_evaluate.sh
          vpl_evaluate.cases
          ${schemaInfo.executionFileNames}
         </content>
      </execution_file>
      <execution_file id="">
         <name>execution_files.lst.keep</name>
         <content>
           vpl_run.sh
           vpl_debug.sh
           vpl_evaluate.sh
           vpl_evaluate.cases
           ${schemaInfo.executionFileNames}
        </content>
      </execution_file>
      <execution_file id="">
        <name>execution_files/vpl_run.sh</name>
        <content></content>
      </execution_file>
      <execution_file id="">
        <name>execution_files/vpl_debug.sh</name>
        <content></content>
      </execution_file>
      <execution_file id="">
        <name>execution_files/vpl_evaluate.sh</name>
        <content>.vpl_run.sh</content>
      </execution_file>
      <execution_file id="">
        <name>execution_files/vpl_evaluate.cases</name>
        <content></content>
      </execution_file>
      ${schemaInfo.executionFilesTags}
    </execution_files>
    <variations>
    </variations>
    <submissions>
    </submissions>
  </vpl>
</activity>`
}

function exportProject(projectData = {}, dir = '/tmp/') {
  return new Promise((resolve, reject) => {
    const name = Date.now()
    const extension = 'tgz'
    const path = dir + name + '.' + extension
    const BACKUP_FILES = './backup_files'
    const VPL_ACTIVITY_FILE = BACKUP_FILES + '/activities/vpl_4/vpl.xml'
    const createVplXmlConfStream = fs.createWriteStream(VPL_ACTIVITY_FILE);
    createVplXmlConfStream.end(createVPLActivityFile(projectData), 'utf8');
    createVplXmlConfStream.on('finish', (err) => {
      console.log('created', err)
      tar.pack(BACKUP_FILES)
        .pipe(zlib.Gzip())
        .pipe(fs.createWriteStream(path))
        .on('finish', (err, data) => {
          console.log('tar created')
          err
            ? reject(err)
            : resolve({ dir, path, name })
        })
    });


  })

}

exportProject(null, './')
  .then(console.log)
  .catch(console.log)