'use strict'
const db = require('../models/mongodb')
const BigNumber = require('bignumber.js')
const { web3 } = require('../models/blockchain')
let sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

const sockets = async (io) => {
  io.on('connection', function (socket) {
    console.info('New socket connection', socket.id)
    socket.on('user', function (data) {
      const account = (data.address || '').toLowerCase()
      console.info('New user wallet =', account)
      if (web3.utils.isAddress(account)) {
        db.Wallet.update({
          walletAddress: account
        }, { $set: {
          walletAddress: account
        } }, { upsert: true })
        socket.join(account)
      }
    })
  })
  watch()
}

const watch = async function() {
  let blockNumber = 0
  while (true) {
    let blk = await web3.eth.getBlock('latest')
    if (blockNumber !== blk.number) {
      let txs = blk.transactions
      let map = txs.map(async tx => {
        tx = await web3.eth.getTransaction(tx)
        tx.value = new BigNumber(tx.value).toString()
        tx.from = (tx.from || '').toLowerCase()
        tx.to = (tx.to || '').toLowerCase()
        const w = await db.Wallet.findOne({$or: [{walletAddress: tx.to}, {walletAddress: tx.from}]})

        return !w || db.Tx.update({hash: tx.hash}, {$set: tx}, {upsert: true})
      })
      await Promise.all(map)
    }
    blockNumber = blk.number

    await sleep(500)
  }
}

module.exports = sockets
