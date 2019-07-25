const MoodleServiceBaseClass = require("./moodle.class.service")
module.exports = class MoodleService extends MoodleServiceBaseClass {

  constructor() {
    super.createConnection()
  }

  async getMyStudents(CurrentUser) {
    const assignments = await getUserAssignments(CurrentUser)
    const { TABLE_PREFIX } = this
    
    const sql = `
      SELECT
        ctx.id as 'context',
      	role.archetype as 'role',
      	course.id as 'courseid',
      	course.fullname as 'course'
      FROM ${TABLE_PREFIX}role_assignments ra
        INNER JOIN ${TABLE_PREFIX}context ctx ON ctx.id = ra.contextid
        INNER JOIN ${TABLE_PREFIX}course course ON course.id = ctx.instanceid
        INNER JOIN ${TABLE_PREFIX}role role ON ra.roleid = role.id
      WHERE  ra.userid = ? 
    `
  }


  getUserAssignments(CurrentUser) {
    const { TABLE_PREFIX } = this
    const sql = `
      SELECT
        ctx.id as 'context',
      	role.id as 'roleid',
      	role.archetype as 'role',
      	course.id as 'courseid',
      	course.fullname as 'course'
      FROM ${TABLE_PREFIX}role_assignments ra
        INNER JOIN ${TABLE_PREFIX}context ctx ON ctx.id = ra.contextid
        INNER JOIN ${TABLE_PREFIX}course course ON course.id = ctx.instanceid
        INNER JOIN ${TABLE_PREFIX}role role ON ra.roleid = role.id
      WHERE  ra.userid = ? 
    `
    const { id } = CurrentUser
    const preparedValues = [id]
    return super.execute(sql, preparedValues, { closeOnEnd: false })

  }
}

