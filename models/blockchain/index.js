'use strict'

const config = require('config')
const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')

const provider = new HDWalletProvider(config.get('mnemonic'), config.get('blockchain.rpc'))
const web3 = new Web3(provider)

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err)
  process.exit(1)
})

module.exports = {
  web3
}
