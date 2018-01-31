require('shelljs/global')
env.NODE_ENV = process.env.NODE_ENV || 'development';

var path = require('path')
var fs = require('fs')
var argv = require('optimist').argv;
var express = require('express')
var webpack = require('webpack')
var config = require('../config')
var opn = require('opn')
// var proxyMiddleware = require('http-proxy-middleware')
var proxy = require('proxy-middleware');
var webpackConfig = require('./webpack.dev.conf')
var apiMap = config.dev.apis;
var port = process.env.PORT || config.dev.port

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
global.apiMap = apiMap;
if (argv.proxy) {
  Object.keys(apiMap).forEach(key => {
    const api = apiMap[key];
    app.use(api.path, proxy(api.proxy + api.path));
  });
}
// mock api requests
else {
  let mockDir = path.resolve(__dirname, '../mock');
  (function setMock(mockDir) {
    fs.readdirSync(mockDir).forEach(function (file) {
      var filePath = path.resolve(mockDir, file);
      var mock;
      if (fs.statSync(filePath).isDirectory()) {
        setMock(filePath);
      }
      else {
        if (/\.js$/.test(file)) {
          mock = require(filePath);
          app.use(mock.api, mock.response);
        }
      }
    });
  })(mockDir);
}

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')({
  logger: console.log.bind(console),
  index: webpackConfig.output.publicPath + 'index.html'
}));

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static(path.resolve(__dirname, '../static')))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Dev server listening at ' + uri + '\n')
  // opn(uri)
})
