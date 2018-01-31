/**
 * Created by an.han on 16/10/15.
 */


// 生成 mutations 方法
function generate(name) {
  return function (state, value) {
    state[name] = value || state[name];
    if (name != 'errorList') {
      localStorage.setItem(name, typeof value == 'object' ? JSON.stringify(value) : value);
    }
  }
}

const options = {

  // 多页面共享数据
  state: {
    message: '',
    title: localStorage.getItem('title'),
    token: localStorage.getItem('token'),
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    project: localStorage.getItem('project'),
    timeRange: localStorage.getItem('timeRange') || 'Yesterday',
    query: localStorage.getItem('query') || '',
    total: localStorage.getItem('total'),
    pageNumber: 1,
    pageSize: 200,
    errorList: [],
    errorDetail: JSON.parse(localStorage.getItem('errorDetail') || '{}'),
  },

  // 操作
  actions: {
    logout () {
      $app.$router.replace({name: 'Login'});
      Object.keys(options.state).forEach((key) => {
        $app.$store.commit(key, '');
        localStorage.setItem(key, '');
      });
    }
  },

  // 数据变更
  mutations: {},
}

// 为每个 state 字段生成对应的 mutations 方法
Object.keys(options.state).forEach((key) => {
  options.mutations[key] = generate(key);
});

export default options;