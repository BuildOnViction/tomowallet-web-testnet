<template>
  <div id="mainContainer" class="main">
    <vue-progress-bar></vue-progress-bar>
    <div class="main-header text-center">{{header || ''}}</div>
    <div class="main-container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ['header']
}
</script>


<style lang="stylus" scoped>
  .main
    width 620px
    max-width 100vw
    background #ffffff
    position relative

    @media(max-width: 767px) {
      width 100vw
      min-height 100vh
    }

    &-header
      font-size 40px
      font-weight 200
      color #333333
      padding-top 30px
      // text-transform uppercase

    &-container
      overflow: auto;
      padding-top: 15px;
      padding-bottom: 15px;
      @media(min-width: 768px) {
        height: 540px;
      }
</style>
