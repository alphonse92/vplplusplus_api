# Description

This folder contains the necesary files to create a backup for moodle. We are keeping the most usefull files for moodle.

# Versioning warning

This structure could be change im future moodle versions. Be aware


# Files

## /moodle_backup.xml

This file contains the structure of the moodle backup, it has information about the moodle data who made the backup.
Each root's children belongs to a data in the database.

### Structure

docs: https://docs.moodle.org/dev/Backup_2.0_general_architecture
We will focus on the files that VPL++ development procces is interest

#### moodle_backup.information

These files are just used to track and show information about the course that activity belongs to.

```
name            : the name of the backup file
moodle_version  : value table in moodle.mdl_config.name = version
moodle_release  : value table in moodle.mdl_config.name = release
backup_version  : value table in moodle.mdl_config.name = backup_version
backup_release  : value table in moodle.mdl_config.name = backup_release
backup_date     : timestamp/1000 from backup creation

original_wwwroot           : original ulr of moodle 
original_course_id         : original course id that where was taken the backup
original_course_format     : original format id that where was taken the backup
original_course_fullname   : original course fullname that where was taken the backup
original_course_shortname  : original course shortname that where was taken the backup 
original_course_startdate  : original course start date that where was taken the backup
original_course_enddate    : original course end date that where was taken the backup
original_course_contextid  : original course context id that where was taken the backup
original_system_contextid  : original system context id that where was taken the backup


mnet_remoteusers              : is a number but i dont know where was taken from 
original_site_identifier_hash : is a hash but i dont know where was taken from
include_files:                : is a number but i dont know where was taken from     
include_file_references_to_external_content: is a number but i dont know where was taken from     

```

### moodle_backup.information.details.detail
Each child of the xml of detail is related to the mdl_backup_controllers table

Attributes

```
id       : is related to a row in mdl_backup_controllers.id. I think this value is used to restore more easily an activity using the database
```

Children and values

```
type           : accepts course or activity
format         : Maybe is the format that is exported, for now we will focus on "moodle2" format
interactive    : No important, i though this value was be used to show the restore course wizard, but nothing changed when i seted that as zero
mode:          : The mode 10 is a normal mode as a teacher backup an activity. The moodle documentation say that this value depends on the options selected to the backup
execution:     : one because it will be executed immediately 
executiontime  : Zero because it will be executed immediately 

```

final xml structure

```
<details>
  <detail backup_id="bae978df5196f48d086ecb0640691d7a">
    <type>course</type>
    <format>moodle2</format>
    <interactive>1</interactive>
    <mode>10</mode>
    <execution>1</execution>
    <executiontime>0</executiontime>
  </detail>
</details>
```

## /.ARCHIVE_INDEX

This looks like a reference to each important file to restore the moodle backup. Nothing happen if this file not exist. So, we will omit add this to the backup file generated from  vpl++


## activities/$ModuleName_$moduleid/module.xml

This file contains the vpl activity data. VPL ++ will generate a simple backup for the project, however, after teacher restore it, he is able to modify the activity options.