'use strict'
const express = require('express'),
  router = express.Router(),
  BigNumber = require('bignumber.js'),
  db = require('../models/mongodb'),
  { web3 } = require('../models/blockchain')

router.post('/create/:address', async function(req, res, next) {
  const address = (req.params.address || '').toLowerCase()
  if (!web3.utils.isAddress(address)) return next(Error('Wrong address'))

  db.Wallet.update({walletAddress: address}, {$set: {walletAddress: address}}, {upsert: true})
  return res.json({})
})

router.post('/reward/:address', async function(req, res, next) {
  const receiver = (req.params.address || '').toLowerCase()
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

  const ret = await web3.eth.sendTransaction(faucet)
  let hash = (ret || {}).transactionHash
  wallet.reward = hash
  wallet.save()
  if (hash) {
    let tx = await web3.eth.getTransaction(hash)
    tx.value = new BigNumber(tx.value).toString()
    tx.from = (tx.from || '').toLowerCase()
    tx.to = (tx.to || '').toLowerCase()
    db.Tx.update({hash: tx.hash}, {$set: tx}, {upsert: true})
  }

  return res.json(ret)
})

router.get('/txs/:address', async function(req, res, next) {
  let limit = req.query.limit || 100
  let skip = req.query.skip || 0
  let address = (req.params.address || '').toLowerCase()
  if (!web3.utils.isAddress(address)) return next(Error('Wrong address'))
  let txs = await db.Tx.find({
    $or: [{ to: address },{ from: address }]
  }).sort({createdAt: -1}).limit(limit).skip(skip)

  return res.json(txs)
})

module.exports = router
