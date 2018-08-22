'use strict'

const sockets = (io) => {
  io.on('connection', function (socket) {
    console.info('New socket connection', socket.id)
    socket.on('user', function (data) {
      const account = (data.address || '').toLowerCase()
      console.info('New user wallet =', account)

      socket.join(account)
    })
  })
}

module.exports = sockets
