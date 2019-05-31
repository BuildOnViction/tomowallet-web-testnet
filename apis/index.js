'use strict'
const express = require('express'),
    router = express.Router()

router.use('/api/wallets', require('./wallets'))
router.use('/api/config', require('./config'))

module.exports = router
