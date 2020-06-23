const passport = require('passport')
const { BasicStrategy } = require('passport-http')
const axios = require('axios')
const boom = require('@hapi/boom')
const { api, apikey } = require('../../config')
passport.use(
  new BasicStrategy(async (username, password, done) => {
    try {
      const { data, status } = await axios({
        url: `${api}/api/auth/sign-in`,
        method: 'post',
        auth: {
          username,
          password,
        },
        data: {
          apikey,
        },
      })

      if (!data || status !== 200) {
        return done(new Error('unauthorized'), false)
      }

      return done(null, data)
    } catch (err) {
      return done(err, false)
    }
  })
)
