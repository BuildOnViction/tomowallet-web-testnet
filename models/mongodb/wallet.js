'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Define User Schema
var Wallet = new Schema({
  walletAddress: {
    type: String,
    index: true
  },
  reward: String
}, {timestamps: true})

Wallet.statics = {}

module.exports = mongoose.model('Wallet', Wallet)
