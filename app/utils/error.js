export class Error {
  constructor(e, extra = {}) {
    let { http_code, error } = e
    const INSTANCE = e.constructor.name

    if (INSTANCE === "MongooseError" && e.errors) {
      const errors = Object
        .values(e.errors)
        .reduce((out, { path: field, message, properties: { type } }) => {
          type = type === "user defined" ? "validation" : type
          const arrayOfFields = out[type] || []
          arrayOfFields.push({ field, message })
          return { ...out, [type]: arrayOfFields }
        }, {})

      http_code = 400
      error = {
        code: -1,
        error: errors,
        type: 'validation'
      }

      if (["development", "dev", "local"].includes(process.env.NODE_ENV)) {
        error.__development__ = {
          raw: e.errors,
          instance: INSTANCE
        }
      }

    } else if (!http_code) {
      http_code = 500
      error = {
        code: -1,
        message: "Server Error"
      }
    }

    error = { ...error, ...extra }

    const out = { http_code, error }


    Object.assign(this, out)
  }
}