'use strict'
const express = require('express'),
    router = express.Router(),
    config = require('config')

router.get('/', async function(req, res, next) {
    const blockchain = config.get('blockchain')
    return res.json(blockchain)
})

module.exports = router
