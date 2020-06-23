'use strict'

const jwt = require('jsonwebtoken')
const { jwt: jwtSecret } = require('../../config')
async function verify(token) {
  return await jwt.verify(token, jwtSecret)
}

module.exports = {
  verify,
}
