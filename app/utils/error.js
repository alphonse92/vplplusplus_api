export class Error {
  constructor({ http_code, error }) {
    Object.assign(this, { http_code, error})
  }
}