var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  apis: JSON.stringify({
    default: {
      path: '/api',
      proxy: 'https://fem.online.com'
    },
  })
})
