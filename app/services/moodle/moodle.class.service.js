const Config = global.Config;
const Util = require(Config.paths.utils)
class MoodleService {

  constructor() {
    this.TABLE_PREFIX = Config.moodle.db.table_prefix
    this.createConnection()
  }

  async createConnection() {
    this.conn = await require(Config.paths.db + "/mysql")();
    return this.conn
  }


  closeConnection() {
    this.conn.end()
    delete this.conn
  }

  async getConnection() {
    if (!this.conn) return await this.createConnection()
    return this.conn
  }

  async execute(sql, preparedValues, opts = { closeOnEnd: true }) {
    const conn = await this.getConnection()
    const promise = new Promise((resolve, reject) => {
      Util.log(sql)
      Util.log(preparedValues)
      conn.query(sql, preparedValues, (err, data) => err ? reject(err) : resolve(data));
    })
    try {
      const result = await promise
      if (opts.closeOnEnd) this.closeConnection()
      return result
    } catch (e) {
      this.closeConnection()
      throw e
    }
  }
}

module.exports = MoodleService