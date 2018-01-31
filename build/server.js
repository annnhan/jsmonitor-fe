/**
 * Created by hanan on 17/7/31.
 */

const env = process.env.env

if (env == 'production') {
  require('./prod-server')
}
else {
  require('./test-server')
}