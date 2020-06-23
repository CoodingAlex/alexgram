const cookie = require('cookie')
const { verify } = require('../utils/auth/jwt')
let Users = new Map()

function socketHandler(io) {
  io.on('connection', async (socket) => {
    if (!Users.get(socket.id)) {
      let { token } = cookie.parse(socket.handshake.headers.cookie)
      let { username } = await verify(token)
      Users.set(socket.id, username)
    }

    socket.on('new:message', (data) => {
      console.log(data)

      const message = {
        value: data.value,
        chat: data.chat,
        user: Users.get(socket.id),
      }
      io.sockets.emit('chat:message', message)
    })

    socket.on('disconnect', () => {
      Users.delete(socket.id)
    })
  })
}

module.exports = socketHandler
