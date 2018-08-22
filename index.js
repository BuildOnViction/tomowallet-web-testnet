'use strict'

const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const validator = require('express-validator')

// body parse
const app = express()

// add websocket
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(validator({}))

app.set('views', './views')
app.set('view engine', 'ejs')
app.use('/assets', express.static('./build'))
app.use('/media', express.static('./media'))
app.use(require('./apis'))
app.use('/', function(req, res) {
  res.render('app')
})

// error handler
app.use(require('./middlewares/error'))
require('./sockets')(io)

// start server
server.listen(config.get('server.port'), config.get('server.host'), function () {
  const host = server.address().address
  const port = server.address().port
  console.info('Server start at http://%s:%s', host, port)
})

module.exports = app
