/**
 * Created by an.han on 16/10/15.
 * 基于 express 的接口处理定义
 * See http://expressjs.com/zh-cn/4x/api.html
 */
const moment = require('moment');
const error = {
  "name": "ReferenceError",
  "message": "Uncaught ReferenceError: 韩安2222 is not defined",
  "content": "Uncaught ReferenceError: 韩安2222 is not defined",
  "errorType": "js",
  "url": "http://localhost:8081/",
  "errorLevel": 1,
  "time": "2018-1-17T08:29:26.535Z",
  "requestUrl": "",
  "requestMethod": "",
  "responseStatusCode": "",
  "responseStatusText": "",
  "response": "",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
  "stack": [{
    "columnNumber": 2,
    "lineNumber": 23557,
    "fileName": "http://localhost:8081/spa/main.js",
    "functionName": "Object.__vue_styles__",
    "source": "    at Object.__vue_styles__ (http://localhost:8081/spa/main.js:23557:2)"
  }, {
    "columnNumber": 30,
    "lineNumber": 585,
    "fileName": "http://localhost:8081/spa/main.js",
    "functionName": "__webpack_require__",
    "source": "    at __webpack_require__ (http://localhost:8081/spa/main.js:585:30)"
  }, {
    "columnNumber": 20,
    "lineNumber": 109,
    "fileName": "http://localhost:8081/spa/main.js",
    "functionName": "fn",
    "source": "    at fn (http://localhost:8081/spa/main.js:109:20)"
  }, {
    "columnNumber": 15,
    "lineNumber": 23324,
    "fileName": "http://localhost:8081/spa/main.js",
    "functionName": "Object.defineProperty.value",
    "source": "    at Object.defineProperty.value (http://localhost:8081/spa/main.js:23324:15)"
  }, {
    "columnNumber": 30,
    "lineNumber": 585,
    "fileName": "http://localhost:8081/spa/main.js",
    "functionName": "__webpack_require__",
    "source": "    at __webpack_require__ (http://localhost:8081/spa/main.js:585:30)"
  }, {
    "columnNumber": 20,
    "lineNumber": 109,
    "fileName": "http://localhost:8081/spa/main.js",
    "functionName": "fn",
    "source": "    at fn (http://localhost:8081/spa/main.js:109:20)"
  }, {
    "columnNumber": 19,
    "lineNumber": 639,
    "fileName": "http://localhost:8081/spa/main.js",
    "functionName": "Object.module.exports.list",
    "source": "    at Object.module.exports.list (http://localhost:8081/spa/main.js:639:19)"
  }, {
    "columnNumber": 30,
    "lineNumber": 585,
    "fileName": "http://localhost:8081/spa/main.js",
    "functionName": "__webpack_require__",
    "source": "    at __webpack_require__ (http://localhost:8081/spa/main.js:585:30)"
  }, {
    "columnNumber": 37,
    "lineNumber": 631,
    "fileName": "http://localhost:8081/spa/main.js",
    "source": "    at http://localhost:8081/spa/main.js:631:37"
  }, {
    "columnNumber": 10,
    "lineNumber": 634,
    "fileName": "http://localhost:8081/spa/main.js",
    "source": "    at http://localhost:8081/spa/main.js:634:10"
  }],
  "lineNumber": 23557,
  "columnNumber": 2,
  "fileName": "http://localhost:8081/spa/main.js"
};
let errorList = [];
for (let max = 200, i = 0; i < max; i++) {
  errorList.push(Object.assign({}, error));
}


module.exports = {
  api: global.apiMap.default.path + '/logs',
  response: function (req, res) {
    let one = 24 * 60 * 60 * 1000;
    let maxTime = Date.now();
    let timeRange = req.query.timeRange;
    let day = ({
      'Today': 0,
      'Yesterday': 1,
      'Last 7 days': 6,
      'Last 14 days': 13,
      'Last 30 days': 29,
    })[timeRange] || 0;

    function min(day) {
      return new Date(moment(maxTime - day * one).format('YYYY-MM-DD 00:00:00')).getTime();
    }

    errorList.forEach(item => {
      let minTime = min(day);
      if (day == 1) {
        maxTime = minTime + one;
      }
      let randomTime = parseInt(Math.random() * (maxTime - minTime) + minTime, 10);
      item.time = new Date(randomTime).toJSON();
    })

    res.json({
      code: '00000',
      message: '00000',
      value: {
        total: errorList.length,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        list: errorList
      },
    });
  }
}