'use strict'

const config = require('config')
const HDWalletProvider = require('truffle-hdwallet-provider')

const chain = new HDWalletProvider(config.get('mnemonic'), config.get('blockchain.rpc'))

module.exports = {
  chain
}
