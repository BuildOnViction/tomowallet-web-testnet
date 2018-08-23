<template>
  <div class="main">
    <div class="main-header text-center mt30">{{header || ''}}</div>
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

    &-header
      font-size 40px
      font-weight 200
      color #333333
      // text-transform uppercase

    &-container
      overflow: auto;
      height: 540px;
      margin-top: 15px;
</style>
