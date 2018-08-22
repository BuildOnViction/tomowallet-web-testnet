'use strict'
const consumer = {}
const {
  rootAddressMainchain,
  CashOutMainchain
} = require('../models/blockchain')

consumer.name = 'cashOutMainchain'

consumer.task = function(job, done) {
  const {account, cashOutValue} = job.data
  console.info('cashOutMainchain', account, cashOutValue)
  CashOutMainchain.deployed().then((com) => {
    return com.cashOut(account, cashOutValue, {from: rootAddressMainchain})
  }).then((res) => {
    return done(null, res.tx)
  }).catch(e => done(e))
}

module.exports = consumer
