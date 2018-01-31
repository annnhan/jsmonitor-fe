/**
 * Created by hanan on 17/7/31.
 */

const env = process.env.env

console.log(process.env.env);
console.log(process.env.PORT0);

if (env == 'production') {
  require('./prod-build')
}
else {
  require('./test-build')
}
