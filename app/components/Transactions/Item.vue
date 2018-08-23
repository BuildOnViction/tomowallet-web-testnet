<template>
  <div class="t-item">
    <div>
      <div>
        <span class="t-item-label" :class="isIn ? 'in' : 'out'">{{isIn ? 'in' : 'out'}}</span>
        <span class="t-item-label processing">processing</span>
      </div>
      <div class="t-item-des">
        <b>{{isIn ? 'From' : 'To'}}:</b> <span class="t-item-des-address">0x9626af8b7500cd99673967ea73fc35f0daa2f7e1</span>
      </div>
    </div>
    <div class="text-right">
      <div class="t-item-amount" :class="isIn ? 'in' : 'out'">
        {{isIn ? '+' : '-'}}{{Math.round(Math.random() * 10000)/100}}
      </div>
      <div class="t-item-time">
        {{(new Date()).toLocaleString()}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isIn']
}
</script>


<style lang="stylus" scoped>
  .t-item
    padding 10px 20px
    display flex
    align-items center
    justify-content space-between
    border-bottom 1px solid rgba(0,0,0,0.07)
    cursor pointer
    transition all 0.3s
    &:hover
      background rgba(0,0,0,0.05)

    &-label
      padding 1px 10px
      border-radius 3px
      color #ffffff
      font-size 12px
      display inline-block

      &.in
        background #5CB85C

      &.out
        background #FF5D5D

      &.processing
        background #2196f3

    &-des
      font-size 13px
      margin-top 5px

      &-address
        // font-family monospace
        font-weight 400

    &-amount
      font-size 22px
      font-weight 400

      &.in
        color #5CB85C
      &.out
        color #FF5D5D
    &-time
      color #909090
      font-size 12px
</style>
