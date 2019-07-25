const Config = global.Config;
module.export = class MoodleService {
  constructor() {
    this.TABLE_PREFIX = Config.moodle.db.table_prefix
  }

  createConnection() {
    this.conn = require(Config.paths.db + "/mysql")();
  }


  closeConnection() {
    this.conn.end()
    delete this.conn
  }

  async execute(sql, preparedValues, opts = { closeOnEnd: true }) {
    const conn = this.conn || this.createConnection()
    const promise = new Promise((resolve, reject) => {
      conn.query(sql, preparedValues, (err, data) => err ? reject(err) : resolve(data));
    })
    try {
      const result = await promise
      return result
    } catch (e) {
      this.closeConnection()
      throw e
    } finally {
      if (opts.closeOnEnd) this.closeConnection()
    }
  }


}