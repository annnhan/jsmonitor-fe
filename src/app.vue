<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {

    data() {
      return {}
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  * {
    margin: 0;
    padding: 0;
  }

  body {
    color: #2c3e50;
    font-family: Roboto, Noto, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    background: #fff;
  }

  a {
    text-decoration: none;
    color: #2196f3;
  }

  a, input, textarea, button, select {
    resize: none;
    outline: 0;
  }

  .clear:after {
    height: 0;
    clear: both;
    content: ".";
    display: block;
    visibility: hidden;
  }
</style>
