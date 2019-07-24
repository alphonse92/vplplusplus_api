export class Error {
  constructor(e) {
    let { http_code, error } = e
    if (e.errors) {
      const errors = Object.values(e.errors).map(({ path: field, message, properties: { type } }) => ({ field, message, type }))
      http_code = 401
      error = {
        code: -1,
        message: errors.map(error => error.message).join('\n')
      }

    } else if (!http_code) {
      http_code = 500
      error = {
        code: -1,
        message: "Server Error"
      }
      console.log(e)
    }

    Object.assign(this, { http_code, error })
  }
}