// https://github.com/shelljs/shelljs
require('shelljs/global');
env.NODE_ENV = 'testing'

var fs = require('fs')
var path = require('path')
var argv = require('optimist').argv
var express = require('express')
var config = require('../config')
var proxy = require('proxy-middleware');
var opn = require('opn')
var app = express()
var webpackConfig = require('./webpack.test.conf')
var apiMap = config.test.apis;
var port = process.env.PORT0 || config.test.port


// proxy api requests
Object.keys(apiMap).forEach(key => {
  const api = apiMap[key];
  app.use(api.path, proxy(api.proxy + api.path));
});

console.log(webpackConfig.output.path + '/index.html');

// serve pure static assets
var staticPath = path.posix.join(config.prod.assetsPublicPath, config.prod.assetsSubDirectory)
app.use(staticPath, express.static(path.resolve(__dirname, '../dist/static'), {
  maxAge: '1y'
}));

app.use(function (req, res) {
  res.sendFile(webpackConfig.output.path + '/index.html', {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'port': port,
      'env': process.env.env || 'none'
    }
  });
});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Build server listening at ' + uri + '\n')
  // opn(uri)
})