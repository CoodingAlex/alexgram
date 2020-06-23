const express = require('express')
const router = express.Router()
const passport = require('passport')
const boom = require('@hapi/boom')
const axios = require('axios')

require('../utils/auth/basic-strategie')
const config = require('../config')
function auth(app) {
  app.use('/', router)
  router.post('/login', (req, res, next) => {
    passport.authenticate('basic', (err, data) => {
      try {
        if (err || !data) {
          return next(boom.unauthorized())
        }
        req.login(data, { session: false }, async (err) => {
          const { token } = data
          res.cookie('token', req.user.token, {
            httpOnly: !config.dev,
            secure: !config.dev,
          })
        })
        return res.status(200).json({ message: 'authorized' })
      } catch (err) {
        return next(err)
      }
    })(req, res, next)
  })

  router.get('/login', (req, res, next) => {
    res.render('login')
  })

  router.get('/logout', (req, res, next) => {
    res.clearCookie('token')
    res.redirect('/login')
  })

  router.post('/sign-up', async (req, res, next) => {
    try {
      const { username, password } = req.body
      if (!username || !password) {
        return next('you need an username and password')
      }

      const { status } = await axios({
        method: 'post',
        url: `${config.api}/api/auth/sign-up`,
        data: {
          username,
          password,
        },
      })

      if (status === 201) {
        res.status(201).json({ message: 'user created' })
      }
    } catch (err) {
      next(err)
    }
  })
}
module.exports = auth
