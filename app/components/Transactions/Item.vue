<template>
  <div class="t-item" @click="openTomoScan">
    <div>
      <div>
        <span class="t-item-label" :class="isIn ? 'in' : 'out'">{{isIn ? 'in' : 'out'}}</span>
        <span v-if="isProcessing" class="t-item-label processing">processing</span>
        <span v-else class="t-item-label success">success</span>
      </div>
      <div class="t-item-des">
        <b>{{isIn ? 'From' : 'To'}}:</b> <span class="t-item-des-address">{{isIn ? data.from : data.to}}</span>
      </div>
    </div>
    <div class="text-right">
      <div class="t-item-amount" :class="isIn ? 'in' : 'out'">
        {{isIn ? '+' : '-'}}{{value}}
      </div>
      <div class="t-item-time">
        {{new Date(data.createdAt).toLocaleString()}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isIn', 'data'],
  computed: {
    isProcessing() {
      var now = new Date().getTime();
      var t = new Date(this.data.createdAt).getTime();
      if (now - t > 2000) {
        return false;
      }

      return true;
    },
    value() {
      return (parseInt(this.data.value) / (10 ** 18)).toFixed(2)
    }
  },
  methods: {
    openTomoScan() {
      window.open(`https://scan.testnet.tomochain.com/txs/${this.data.hash}`, '_blank')
    }
  }
}
</script>


<style lang="stylus" scoped>
  .t-item
    padding 10px 20px
    border-bottom 1px solid rgba(0,0,0,0.07)
    cursor pointer
    transition all 0.3s
    display flex
    align-items center
    justify-content space-between
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
        background gray

      &.success
        background #2196f3

    &-des
      font-size 13px
      margin-top 5px

      @media(max-width 767px) {
        width: calc(100vw - 200px)
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

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
