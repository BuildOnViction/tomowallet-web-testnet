'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Define User Schema
var Tx = new Schema({
    blockHash: String,
    blockNumber: Number,
    nonce: Number,
    cumulativeGasUsed: Number,
    from: { type: String, index: true },
    to: { type: String, index: true },
    hash: { type: String, unique: true },
    gas: Number,
    gasPrice: String,
    value: String
}, {timestamps: true})

Tx.statics = {}

module.exports = mongoose.model('Tx', Tx)
