const redis = require('redis')
const config = require('config')

const options = {
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    prefix: config.get('redis.prefix')
}
if (config.get('redis.password')) {
    options.password = config.get('redis.password')
}
const cache = redis.createClient(options)

module.exports = cache
