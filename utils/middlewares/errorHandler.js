const boom = require('@hapi/boom')

function errorHandler(err, req, res, next) {
  if (err.type === 'unauthorized') {
    res.status(401).json({ error: 'not credentials, please login' })
    return
  }

  if (boom.isBoom(err)) {
    return res
      .status(err.output.statusCode)
      .send({ message: err.output.payload.message })
  }

  res.status(err.code || 500).json({ error: err.message || err.error })
}

module.exports = errorHandler
