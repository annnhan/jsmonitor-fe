/**
 * Created by an.han on 16/10/15.
 * 基于 express 的接口处理定义
 * See http://expressjs.com/zh-cn/4x/api.html
 */

module.exports = {
  api: global.apiMap.default.path + '/login',
  response: function (req, res) {
    res.json({
      code: '00000',
      message: '00000',
      value: {
        token: 'dev token',
        userInfo: {
          name: 'hanan',
          mail: 'hanan@finupgroup.com',
          project: ['localhost', 'bestbuy-website']
        }
      },
    });
  }
}