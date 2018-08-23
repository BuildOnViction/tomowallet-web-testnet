'use strict'
const express = require('express'),
  router = express.Router(),
  Web3 = require('web3'),
  db = require('../models/mongodb'),
  { chain } = require('../models/blockchain')

// add new user device
router.post('/reward/:address', async function(req, res, next) {
  const receiver = (req.params.address || '').toLowerCase()
  const web3 = new Web3(chain)
  if (!web3.utils.isAddress(receiver)) return next(Error('Wrong address'))

  let wallet = await db.Wallet.findOne({walletAddress: receiver})
  if (!wallet) {
    wallet = await db.Wallet.create({walletAddress: receiver})
  }
  if ((wallet || {}).reward) {
    return next(Error('Already rewarded'))
  }

  const amount = 15e18
  const accounts = await web3.eth.getAccounts()
  const faucet = {
    gasPrice: 1,
    from: accounts[0],
    to: receiver,
    value: amount
  }

  const tx = await web3.eth.sendTransaction(faucet)
  wallet.reward = (tx || {}).transactionHash
  wallet.save()

  return res.json(tx)
})

module.exports = router
