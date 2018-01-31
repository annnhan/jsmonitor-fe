<template>
  <i v-if="show" class="el-icon-d-arrow-left" @click="gotop">{{fullTitle}}</i>
</template>

<script>
  export default {

    data(){
      return {
        show: window.scrollY > 100
      }
    },
    methods: {
      gotop () {
        window.scrollTo(0, 0);
      }
    },

    mounted () {
      window.onscroll = () => {
        this.show = window.scrollY > 100;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/css/variable";
  i {
    transform: rotate(90deg);
    cursor: pointer;
    position: fixed;
    right: 11px;
    bottom: 30px;
    font-size: 20px;
    font-weight: bold;
    z-index: 99;
  }

</style>