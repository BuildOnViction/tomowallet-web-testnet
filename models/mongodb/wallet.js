'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Define User Schema
var Wallet = new Schema({
    walletAddress: {
        type: String,
        unique: true
    },
    reward: Number
}, {timestamps: true})

Wallet.statics = {}

module.exports = mongoose.model('Wallet', Wallet)
