// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var os = require('os');
var networkInterfaces = os.networkInterfaces();
var ip;

for (var key in networkInterfaces) {
  networkInterfaces[key].forEach(item => {
    if (!item.internal && item.family === 'IPv4') {
      ip = item.address;
    }
  });
}

module.exports = {
  prod: {
    apis: JSON.parse(require('./prod.env').apis),
    port: 9527,
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all staticø assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  test: {
    apis: JSON.parse(require('./test.env').apis),
    port: 9527,
    env: require('./test.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all staticø assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    apis: JSON.parse(require('./dev.env').apis),
    env: require('./dev.env'),
    port: 8080,
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
