/**
 * Created by hanan on 17/9/5.
 */

import axios from 'axios';
import {MessageBox, Loading} from 'element-ui';

window.axios = axios;

axios.decorate = function (app, store, router) {

  function msg(response, config) {
    console.log(response);
    if (config.hideMessage) {
      if (response.data.code == '11114') {
        store.dispatch('logout');
      }
    }
    else {
      MessageBox.alert(response.data.message || '网络错误').then(() => {
        if (response.data.code == '11114') {
          store.dispatch('logout');
        }
      });
    };
  }

  axios.interceptors.request.use(config => {
    config.headers.Authorization = store.state.token;
    app.$loading = Loading.service(Object.assign({background: 'rgba(0,0,0,0)'}, config.loading));
    if (typeof config.data == 'object') {
      Object.keys(config.data).forEach(key => {
        if (typeof config.data[key] == 'string') {
          config.data[key] = config.data[key].trim();
        }
      })
    }

    return config;
  });

  axios.interceptors.response.use(
    response => {
      app.$loading.close();
      if (typeof response.data == 'object' && response.data.code && response.data.code != '00000') {
        msg(response, response.config);
        return Promise.reject(response.data);
      }
      else {
        return response.data;
      }
    },
    error => {
      app.$loading.close();
      let response = error.response;
      if (response) {
        msg(response, response.config);
      }
      return Promise.reject(error);
    }
  );
};

export default axios;