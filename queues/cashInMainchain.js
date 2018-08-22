'use strict'
const consumer = {}
const {
  rootAddressMainchain,
  CashInMainchain
} = require('../models/blockchain')

consumer.name = 'cashInMainchain'

consumer.task = function(job, done) {
  const {account, cashInValue} = job.data
  console.info('cashInMainchain', account, cashInValue)
  CashInMainchain.deployed().then((cim) => {
    return cim.cashIn(account, cashInValue, {from: rootAddressMainchain})
  }).then((res) => {
    return done(null, res.tx)
  }).catch(e => done(e))
}

module.exports = consumer
