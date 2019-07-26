
const MoodleService = require("./moodle.class.service")

class CourseService extends MoodleService {

  async getMyStudents(CurrentUser, opts = { closeOnEnd: true }) {

    const assignments = await this.getUserAssignments(CurrentUser, { closeOnEnd: false })
    const { editingteacher, teacher } = assignments

    if (!editingteacher && !teacher) return []

    const assigmentsAsTeacher = teacher || []
    const assigmentsAsEditingTeacher = editingteacher || []


    const archetype = 'student'
    const contexts = assigmentsAsEditingTeacher
      .concat(assigmentsAsTeacher)
      .map(({ context }) => context)

    const { TABLE_PREFIX } = this


    const sql = `
      SELECT user.id as 'id' , user.email as 'email'
      FROM ${TABLE_PREFIX}role_assignments ra 
        INNER JOIN ${TABLE_PREFIX}user user ON ra.userid = user.id 
        INNER JOIN ${TABLE_PREFIX}role role ON ra.roleid = role.id
      WHERE role.archetype in (?) AND ra.contextid in (?)
    `
    const preparedValues = [archetype, contexts.join(',')]

    return super.execute(sql, preparedValues, opts)

  }


  async getUserAssignments(CurrentUser, opts = { closeOnEnd: true }) {
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

    const results = await super.execute(sql, preparedValues, opts)

    return results
      .reduce((out, role_assigments) => {
        const { role } = role_assigments
        out[role] = out[role] || []
        out[role].push(role_assigments)
        return out
      }, {})
  }
}

module.exports = CourseService