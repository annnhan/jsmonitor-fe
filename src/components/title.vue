<template>
  <h1 v-show="show">{{fullTitle}}</h1>
</template>

<script>
  export default {
    props: ['text', 'show'],

    computed: {
      fullTitle () {
        return this.text + ' - FEM';
      }
    },

    mounted () {
      document.title = this.fullTitle;
    },

    updated (){
      document.title = this.fullTitle;
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/css/variable";


</style>