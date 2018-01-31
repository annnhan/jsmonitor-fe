<template>
  <header class="components-header">
    <h1><a href="/">F E M</a></h1>
    <div class="middle">
      <slot></slot>
      <a href="###">Guide</a>
      <a href="###">Docment</a>
    </div>
    <i class="el-icon-remove-outline logout" title="logout" @click="logout"></i>
  </header>
</template>

<script>

  import {mapActions} from 'vuex';

  export default {
    methods: {
      ...mapActions(['logout']),
    },
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .components-header {
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    padding: 0 30px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    background: #fff;
    /*border-bottom: 1px solid #e6ebf5;*/
    /*box-shadow: 0 1px 8px 1px rgba(0,0,0,.2);*/

    h1 {
      a {
        width: 120px;
        font-size: 30px;
      }
    }
    .logout {
      font-size: 18px;
      margin-left: 15px;
      opacity: .5;
      cursor: pointer;
    }
    .middle {
      flex: 1;
      text-align: right;
      .time-rage {
        margin-left: 20px;
      }
      a , span{
        margin-left: 10px;
        color: #2c3e50;
      }
    }
  }
</style>
