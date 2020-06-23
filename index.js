//server and socket io
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

//modules
const consolidate = require('consolidate')
const cookieParser = require('cookie-parser')
const path = require('path')

//router
const socketHandler = require('./routes/sockets')
const chats = require('./routes/chats')
const auth = require('./routes/auth')

const errorHandler = require('./utils/middlewares/errorHandler')

app.use(express.json())
app.use(cookieParser())
app.use('/public', express.static(path.join(__dirname + '/public')))
app.engine('hbs', consolidate.handlebars)

// Registrar el directorio de vistas y la extensión de archivos que renderizará nuestro motor de plantillas
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
const port = process.env.PORT || 3001
//socket
socketHandler(io)

//routes
app.get('/', (req, res) => {
  res.redirect('/chats')
})
chats(app)
auth(app)

//error handler
app.use(errorHandler)

server.listen(port, () => {
  console.log('app listening 3001')
})
