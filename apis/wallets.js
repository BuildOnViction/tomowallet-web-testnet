'use strict'
const express = require('express'),
  router = express.Router(),
  Web3 = require('web3'),
  { chain } = require('../models/blockchain')

// add new user device
router.post('/reward/:address', async function(req, res) {
  const receiver = req.params.address
  const web3 = new Web3(chain)
  if (!web3.utils.isAddress(receiver)) return res.status(400)

  const amount = 15e18
  const accounts = await web3.eth.getAccounts()
  const faucet = {
    gasPrice: 1,
    from: accounts[0],
    to: receiver,
    value: amount
  }

  const tx = await web3.eth.sendTransaction(faucet)
  return res.json(tx)
})

module.exports = router
