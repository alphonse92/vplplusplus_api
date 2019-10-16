
export const createFakeProject = (req, res, next) => {
  try {
    res.send('ey!')
  } catch (e) {
    next(e)
  }
}