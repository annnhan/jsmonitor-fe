module.exports = {
  NODE_ENV: '"production"',
  apis: JSON.stringify({
    default: {
      path: '/api',
      proxy: 'https://fem.online.com'
    },
  })
}
