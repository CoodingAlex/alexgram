const express = require('express')
const router = express.Router()
const mocks = require('../utils/mocks/chats')
const axios = require('axios')
const { api } = require('../config')
function chats(app) {
  app.use('/chats', router)

  router.get('/', async (req, res, next) => {
    if (!req.cookies.token) {
      return res.redirect('/login')
    }
    const { token } = req.cookies

    const { data } = await axios({
      url: `${api}/api/chats`,
      headers: {
        "Authorization": `Bearer ${token}` //prettier-ignore
      },
    })

    res.render('chats', { chats: data })
  })

  router.get('/:chat', async (req, res, next) => {
    if (!req.cookies.token) {
      return res.redirect('/login')
    }
    const { token } = req.cookies
    const { chat } = req.params

    const { data } = await axios({
      method: 'GET',
      url: `${api}/api/chats/${chat}/messages`,
      headers: {
        "Authorization": `Bearer ${token}` //prettier-ignore
      },
    })

    res.render('chat', { messages: data.messages, chat, users: data.users })
  })

  router.post('/:chat', async (req, res, next) => {
    if (!req.cookies.token) {
      return res.redirect('/login')
    }

    const { value } = req.body
    const { token } = req.cookies
    const { chat } = req.params

    const { data } = await axios({
      method: 'POST',
      url: `${api}/api/messages`,
      data: {
        chat,
        value,
      },
      headers: {
        "Authorization": `Bearer ${token}` //prettier-ignore
      },
    })
    res.status(200).json({ message: 'Ok' })
  })
  router.post('/:chat/add/users', async (req, res, next) => {
    if (!req.cookies.token) {
      return res.redirect('/login')
    }

    const { users } = req.body
    const { token } = req.cookies
    const { chat } = req.params
    try {
      const { data } = await axios({
        method: 'patch',
        url: `${api}/api/chats/${chat}/add/users`,
        data: {
          users,
        },
        headers: {
          "Authorization": `Bearer ${token}` //prettier-ignore
        },
      })

      const usersAdded = data.data

      res.status(201).json({ message: 'User added', usersAdded })
    } catch (err) {
      next(err.response ? err.response.data : err)
    }
  })
  router.delete('/:chat/delete/users', async (req, res, next) => {
    if (!req.cookies.token) {
      return res.redirect('/login')
    }

    const { users } = req.body
    const { token } = req.cookies
    const { chat } = req.params
    try {
      const { data } = await axios({
        method: 'patch',
        url: `${api}/api/chats/${chat}/delete/users`,
        data: {
          users,
        },
        headers: {
          "Authorization": `Bearer ${token}` //prettier-ignore
        },
      })

      const usersAdded = data.data

      res.status(200).json({ message: 'User added', usersAdded })
    } catch (err) {
      console.log(err)

      next(err)
    }
  })
}

module.exports = chats
