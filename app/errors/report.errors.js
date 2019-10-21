const ERROR = require('./constants')
module.exports = {
  too_weight: {
    http_code: 400,
    error: {
      code: -1,
      error: { resource: 'report', message: "Query is too weight, please adjust your query data." },
      type: ERROR.TYPE.ACTION_CANT_PERFORM
    }
  }
}