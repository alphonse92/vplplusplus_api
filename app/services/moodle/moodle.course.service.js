
const MoodleService = require("./moodle.class.service")
const opts_def = { closeOnEnd: true }
class CourseService extends MoodleService {

  getContextsByAssigments(assignments) {
    const { editingteacher, teacher } = assignments

    if (!editingteacher && !teacher) return []

    const assigmentsAsTeacher = teacher || []
    const assigmentsAsEditingTeacher = editingteacher || []

    const contexts = assigmentsAsEditingTeacher
      .concat(assigmentsAsTeacher)
      .map(({ context }) => context)
    return contexts
  }

  async getVplModuleInfo(opts = opts_def) {
    const { TABLE_PREFIX } = this
    const sql = `
      SELECT *
      FROM ${TABLE_PREFIX}modules module
      WHERE module.name = "vpl"
      LIMIT 1 
    `
    const module = await super.execute(sql, [], opts)
    return module[0]
  }

  async getMyVPLActivitiesWhereImTheTeacher(CurrentUser, opts = opts_def) {
    const assignments = await this.getUserAssignments(CurrentUser, { closeOnEnd: false })
    const contextAsATeacher = this.getContextsByAssigments(assignments)
    const vpl = await this.getVplModuleInfo({ closeOnEnd: false })
    const { TABLE_PREFIX } = this
    const sql = `
      SELECT 
        course.id as 'course_id' ,
        course.fullname as 'course_name' ,
        activity.id as 'course_module_id' ,
        vpl.id as 'vpl_id' ,
        vpl.name as 'name' ,
        vpl.shortdescription as 'description'
      FROM         ${TABLE_PREFIX}context context
        INNER JOIN ${TABLE_PREFIX}course            course           ON   context.instanceid  = course.id
        INNER JOIN ${TABLE_PREFIX}course_modules    activity         ON   activity.course     = course.id 
        INNER JOIN ${TABLE_PREFIX}vpl               vpl              ON   vpl.id              = activity.instance
      WHERE 
        context.id in (?)
        AND activity.module = ${vpl.id}
    `
    const preparedValues = [contextAsATeacher.join(',')]
    return super.execute(sql, preparedValues, opts)
  }



  async getMyStudents(CurrentUser, opts = { closeOnEnd: true }) {

    const assignments = await this.getUserAssignments(CurrentUser, { closeOnEnd: false })
    const contexts = this.getContextsByAssigments(assignments)
    const archetype = 'student'
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