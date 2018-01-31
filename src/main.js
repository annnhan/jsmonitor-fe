// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import axios from './utils/axios';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import routes from './routes';
import storeOption from './vuex/store';
import App from './app';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(monitor.vuePlugin);

// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
  mode: 'history',
  routes: routes
});

// 创建一个 store 对象用于管理应用状态
const store = new Vuex.Store(storeOption);

// 路由钩子
router.beforeEach((to, from, next) => {

  // 用户已登录或访问可见页面
  if (to.matched.some(route => route.meta.visible) || store.state.token) {
    next();
  }
  else {
    next({name: 'Login'});
  }
});

window.$app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

axios.decorate(window.$app, store, router);
