// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = process.env.NODE_ENV || 'testing'

var path = require('path')
var fs = require('fs')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.test.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for test ...')
spinner.start()

var assetsPath = path.join(config.prod.assetsRoot, config.prod.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, function (err, stats) {

  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
});

