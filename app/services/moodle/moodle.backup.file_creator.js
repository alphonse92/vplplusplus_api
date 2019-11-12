const MoodleWebservice = require(Config.paths.webservices + "/moodle.client");

module.exports.getActivityModuleDotXMLFromProjectDocument = getActivityModuleDotXMLFromProjectDocument
async function getActivityModuleDotXMLFromProjectDocument(ProjectDoc) {
  const {
    name,
    description
  } = ProjectDoc
  const shortdescription = description.substring(0, 15) + '...'
  const schemaInfo = {
    executionFileNames: [
      'vpl_run.sh'
      , 'vpl_debug.sh'
      , 'vpl_evaluate.sh'
      , 'vpl_evaluate.cases'
    ], executionFilesTags: []
  }
  const tests = ProjectDoc.tests

  // user loop approach instead of functional style
  // because we need to handle promises inside of the iteration
  for (const idx in tests) {
    const test = tests[idx]
    const testCompiled = await test.compile()
    const { filename, code } = testCompiled
    const tag = `<execution_file id="">
   <name>execution_files/${filename}</name>
   <content>${code}</content>
</execution_file>`
    schemaInfo.executionFileNames.push(filename)
    schemaInfo.executionFilesTags.push(tag)
  }

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
        <content>${schemaInfo.executionFileNames.join('\n')}</content>
      </execution_file>
      <execution_file id="">
         <name>execution_files.lst.keep</name>
         <content>${schemaInfo.executionFileNames.join('\n')}</content>
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
        <content>
          . vpl_environment.
          /usr/bin/vpl $(pwd)/
        </content>
      </execution_file>
      <execution_file id="">
        <name>execution_files/vpl_evaluate.cases</name>
        <content></content>
      </execution_file>${schemaInfo.executionFilesTags}
    </execution_files>
    <variations>
    </variations>
    <submissions>
    </submissions>
  </vpl>
</activity>`
}
module.exports.getmoodle_backupDotXMLFromProjectDocument = getmoodle_backupDotXMLFromProjectDocument
async function getmoodle_backupDotXMLFromProjectDocument(BackupName, ProjectDoc) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <moodle_backup>
    <information>
      <name>${BackupName}</name>
      <moodle_version>2017051501.02</moodle_version>
      <moodle_release>3.3.1+ (Build: 20170720)</moodle_release>
      <backup_version>2017051500</backup_version>
      <backup_release>3.3</backup_release>
      <backup_date>${Math.floor(Date.now() / 1000)}</backup_date>
      <mnet_remoteusers>0</mnet_remoteusers>
      <include_files>1</include_files>
      <include_file_references_to_external_content>0</include_file_references_to_external_content>
      <original_wwwroot>${MoodleWebservice.getUrl()}</original_wwwroot>
      <original_site_identifier_hash>e15eaceaed06206379ed12ead0386f05</original_site_identifier_hash>
      <original_course_id>2</original_course_id>
      <original_course_format>topics</original_course_format>
      <original_course_fullname>Programación Orientada a Objetos 1</original_course_fullname>
      <original_course_shortname>POO1</original_course_shortname>
      <original_course_startdate>1500872400</original_course_startdate>
      <original_course_enddate>1532408400</original_course_enddate>
      <original_course_contextid>30</original_course_contextid>
      <original_system_contextid>1</original_system_contextid>
      <details>
        <detail backup_id="1b9ee71ecdb0675665624105c355b802">
          <type>activity</type>
          <format>moodle2</format>
          <interactive>1</interactive>
          <mode>10</mode>
          <execution>1</execution>
          <executiontime>0</executiontime>
        </detail>
      </details>
      <contents>
        <activities>
          <activity>
            <moduleid>4</moduleid>
            <sectionid>2</sectionid>
            <modulename>vpl</modulename>
            <title>${ProjectDoc.name}</title>
            <directory>activities/vpl_4</directory>
          </activity>
        </activities>
      </contents>
      <settings>
        <setting>
          <level>root</level>
          <name>filename</name>
          <value>${BackupName}</value>
        </setting>
        <setting>
          <level>root</level>
          <name>users</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>anonymize</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>role_assignments</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>activities</name>
          <value>1</value>
        </setting>
        <setting>
          <level>root</level>
          <name>blocks</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>filters</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>comments</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>badges</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>calendarevents</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>userscompletion</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>logs</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>grade_histories</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>questionbank</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>groups</name>
          <value>0</value>
        </setting>
        <setting>
          <level>root</level>
          <name>competencies</name>
          <value>0</value>
        </setting>
        <setting>
          <level>activity</level>
          <activity>vpl_4</activity>
          <name>vpl_4_included</name>
          <value>1</value>
        </setting>
        <setting>
          <level>activity</level>
          <activity>vpl_4</activity>
          <name>vpl_4_userinfo</name>
          <value>0</value>
        </setting>
      </settings>
    </information>
  </moodle_backup>`
}

