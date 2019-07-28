
const MoodleService = require("./moodle.class.service")
const opts_def = { closeOnEnd: true }
class UserMoodleService extends MoodleService {
  async getUserByMoodleId(id, opts = opts_def) {
    const { TABLE_PREFIX } = this
    const sql = `
      SELECT *
      FROM ${TABLE_PREFIX}user user
      WHERE user.id = ?
      LIMIT 1 
    `
    const module = await super.execute(sql, [id], opts)
    return module[0]
  }


}

module.exports = UserMoodleService