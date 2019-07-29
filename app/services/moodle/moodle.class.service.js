const Config = global.Config;
const Util = require(Config.paths.utils)
class MoodleService {

  constructor() {
    this.TABLE_PREFIX = Config.moodle.db.table_prefix
  }

  async createConnection() {
    this.conn = await require(Config.paths.db + "/mysql")();
    Util.log('New MYSQL connection created successfully')
    return this.conn
  }
  
  destroyConnection() {
    this.conn.destroy()
    delete this.conn
  }
  
  closeConnection() {
    return new Promise((resolve, reject) => {
      this.conn.end(err => {
        err ? reject(err) : resolve(err)
        delete this.conn
        Util.log('Closing MYSQL connection')
      })
    })
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
      if (opts.closeOnEnd) await this.closeConnection()
      return result
    } catch (e) {
      await this.destroyConnection()
      throw e
    }
  }
}

module.exports = MoodleService