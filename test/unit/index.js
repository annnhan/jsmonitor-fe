// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind');

require('whatwg-fetch');
window.Promise = require('es6-promise').Promise;
window.console.error = function () {};

// 接口根路径
window.$rootPath = '/lend-app';

// 页面根路径
window.$rootPath = '/spa';

// native 方法回调挂载这这个属性
window.native = {};

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /(\/componentes\/|\/utils\/)/)
srcContext.keys().forEach(srcContext)
