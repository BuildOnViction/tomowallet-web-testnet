'use strict'
const Web3 = require('web3')
const db = require('../models/mongodb')
const sockets = (io) => {
  io.on('connection', function (socket) {
    console.info('New socket connection', socket.id)
    socket.on('user', function (data) {
      const account = (data.address || '').toLowerCase()
      console.info('New user wallet =', account)
      if (Web3.utils.isAddress(account)) {
        db.Wallet.update({
          walletAddress: account
        }, { $set: {
          walletAddress: account
        } }, { upsert: true })
        socket.join(account)
      }
    })
  })
}

module.exports = sockets
