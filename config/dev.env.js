var merge = require('webpack-merge')

module.exports = merge(require('./prod.env'), {
  NODE_ENV: '"development"',
  apis: JSON.stringify({
    default: {
      path: '/api',
      proxy: 'http://localhost:3000',
    },
  })
})
