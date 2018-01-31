<template>
  <div class="views-login">
    <c-title :text="title"></c-title>
    <div class="main">

      <h1 class="item">F E M</h1>

      <div class="input-container item mail">
        <img src="../assets/images/signin-icon01.png">
        <input autocomplete="off" placeholder="请输入邮箱" v-model="mail"/>
      </div>

      <div class="input-container item password">
        <img src="../assets/images/signin-icon02.png">
        <input autocomplete="off" v-if="showPassword" placeholder="请输入密码" v-model="password"/>
        <input autocomplete="off" v-else type="password" placeholder="请输入密码" v-model="password"/>
        <!--<img v-if="showPassword" src="../assets/images/signin-icon05.png" @click="showPassword = false">-->
        <!--<img v-else src="../assets/images/signin-icon04.png" @click="showPassword = true">-->
      </div>

      <div class="item remember" @click="remember = !remember">
        <img v-if="remember" src="../assets/images/checkbox-sel.png">
        <img v-else="remember" src="../assets/images/checkbox-nor.png">
        <a href="javascript:;">记住密码</a>
      </div>

      <a href="javascript:;" class="item submit" @click="submit">登 录</a>

    </div>
  </div>
</template>

<script>

  import cTitle from 'components/title';
  import {mapState} from 'vuex';

  const API_ROOT = process.env.apis.default.path;
  const API_LOGIN = `${API_ROOT}/login`;

  export default {

    data() {
      return {
        title: '登录',
        showPassword: false,
        mail: '',
        password: '',
        sessionId: '',
        remember: false,
      }
    },

    computed: {
      ...mapState(['token',])
    },

    watch: {
      mail() {
        this.remember && this.save();
      },
      password() {
        this.remember && this.save();
      },
      remember(value) {
        if (value) {
          this.save();
        }
        else {
          localStorage.removeItem('user');
        }
      },
    },

    methods: {

      // 设置页面高度，使登录框居中
      setHeight() {
        console.log('set height');
        this.$el.style.height = window.innerHeight + 'px';
      },

      // 记住密码
      save() {
        localStorage.setItem('user', JSON.stringify({
          mail: this.mail,
          password: this.password,
        }))
      },

      // 登录
      submit() {
        axios
          .post(API_LOGIN, {
            mail: this.mail,
            password: this.password,
          })
          .then(data => {
            this.$store.commit('token', data.value.token);
            localStorage.setItem('token', data.value.token);
            this.$store.commit('userInfo', data.value.userInfo);
            localStorage.setItem('userInfo', JSON.stringify(data.value.userInfo));
            this.$router.replace({name: 'Home'});
          })
          .catch((err) => {
          });
      },
    },

    created() {

      // 获取记住的密码填入
      let user = localStorage.getItem('user');
      if (user) {
        user = JSON.parse(user);
        this.mail = user.mail;
        this.password = user.password;
        this.remember = true;
      }

      // 浏览器窗口变化大小时，调整页面大小，保持登录框居中
      window.addEventListener('resize', this.setHeight, false);

    },

    mounted() {
      this.setHeight();
    },

    components: {cTitle,}
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/css/variable";

  .views-login {
    width: 100%;
    height: 100%;
    background: url("../assets/images/signin-bg.png") no-repeat;
    background-size: cover;
    position: relative;
    .main {
      width: 436px;
      height: 330px;
      padding: 30px;
      position: absolute;
      background: rgba(0, 0, 0, .6);
      left: 50%;
      top: 50%;
      color: #ffffff;
      transform: translate(-50%, -50%);
      /*border-radius: 10px;*/

      a {
        cursor: pointer;
        color: #ffffff;
      }

      .item {
        margin: 16px auto 0 auto;
      }

      .logo {
        display: block;
        margin-top: 0;
      }

      h1.item {
        margin-top: 10px;
        font-size: 36px;
        /*font-weight: normal;*/
        text-align: center;
      }

      .input-container {
        height: 36px;
        display: flex;
        padding: 8px;
        /*border-radius: 10px;*/
        background: #ffffff;
        /*border: 1px solid #333;*/
        overflow: hidden;
        background: rgba(0, 0, 0, .5);

        img {
          width: 16px;
          height: 16px;
          margin-top: 11px;
        }

        input {
          background-color: rgba(0, 0, 0, 0) !important;
          font-size: 14px;
          border: none;
          margin: 0 8px;
          color: #ffffff !important;
          flex: 1;
          &:last-child {
            margin-right: 0;
          }
        }

      }

      .mail {
        margin-top: 30px;
      }

      .code {
        .input-container {
          float: left;
          width: 120px;
          input {
            width: 100%;
          }
        }
      }

      .code-pic, .code-update {
        margin-left: 10px;
        height: 36px;
        float: left;
      }
      .code-pic {
        width: 100px;
      }
      .code-update {
        line-height: 36px;
        font-size: 12px;
        text-decoration: underline;
      }

      .remember {
        /*width: 85px;*/
        text-align: left;
        margin: 16px 0 0 5px;
        cursor: pointer;
        a {
          position: relative;
          top: -3px
        }
      }

      .submit {
        margin-top: 20px;
        display: block;
        width: 30%;
        height: 45px;
        /*border-radius: 10px;*/
        background: #000;
        text-align: center;
        line-height: 45px;
        opacity: 1;


        &:active {
          background: #444;
        }
      }
    }
  }
</style>
