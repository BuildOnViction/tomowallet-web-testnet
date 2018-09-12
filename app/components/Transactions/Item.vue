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
import BigNumber from 'bignumber.js'
export default {
  props: ['isIn', 'data'],
  computed: {
    isProcessing() {
      var now = new Date().getTime();
      var t = new Date(this.data.createdAt).getTime();
      if (now - t > 2000 && this.data._id) {
        return false;
      }

      return true;
    },
    value() {
      let v =  new BigNumber(this.data.value).div(1e18);
      if (v.comparedTo(1) > 0) {
          return v.toFixed(2).toString(10);
      }
      return v.toString(10);
    }
  },
  methods: {
    getSelected() {
      if (window.getSelection) {
          return window.getSelection().toString();
      } else if (document.getSelection) {
          return document.getSelection().toString();
      } else {
          var selection = document.selection && document.selection.createRange();
          if (selection.text) {
              return selection.text.toString();
          }
          return "";
      }
      return "";
    },
    openTomoScan() {
      if (!this.getSelected()) {
        window.open(`https://scan.testnet.tomochain.com/txs/${this.data.hash}`, '_blank')
      }
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
