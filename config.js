require('dotenv').config()

module.exports = {
  api: process.env.API_URL || 'http://localhost:3000',
  apikey: process.env.API_KEY,
  dev: process.env.NODE_ENV === 'production' ? false : true,
  jwt: process.env.JWT_SECRET,
}
