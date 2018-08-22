'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Define User Schema
var Wallet = new Schema({
  walletAddress: {
    type: String,
    index: true
  },
  logs: [{
    time: Date,
    type: {type: String},
    change: String,
    message: String,
    tmcSidechain: String,
    tmcMainchain: String,
    txMainchain: String,
    txSidechain: String
  }]
}, {timestamps: true})

Wallet.statics = {}

module.exports = mongoose.model('Wallet', Wallet)
