const ERROR = require('./constants')
const LANG = require('../lang/es')
module.exports = {
  too_weight: {
    http_code: 400,
    error: {
      code: -1,
      error: { resource: 'report', message: LANG.REPORT_TOO_HUGE },
      type: ERROR.TYPE.ACTION_CANT_PERFORM
    }
  }
}