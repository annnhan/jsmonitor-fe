/**
 * @file
 * Created by hanan on 16/10/15.
 */
const NotFound = r => require(['views/notfound'], r);
const Login = r => require(['views/login'], r);
const Home = r => require(['views/Home'], r);
const Detail = r => require(['views/detail'], r);


// 根目录
const rootPath = process.env.spaRootPath || '';

// 页面路由
const routes = [
  {path: '/', component: Home, name: 'Home'},
  {path: '/detail', component: Detail, name: 'Detail'},
  {path: '/login', component: Login, name: 'Login', meta: {visible: true}}
].map(route => {
  route.path = rootPath + route.path;
  return route;
});

// 404 页
routes.push({path: '*', component: NotFound, name: 'notfound', meta: {visible: true}});

export default routes;