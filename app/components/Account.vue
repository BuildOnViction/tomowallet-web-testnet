<template>
  <div class="account">
    <Address :address="address" @privateKeyClick="$emit('privateKeyClick')" />
    <div class="account-balance">
      <div class="fs15 text-right" style="color: rgba(255, 152, 0, 0.6)">Network: <b>Tomo Testnet</b></div>
      <div class="account-balance-number text-center" :style="{'font-size': `${balanceSize}px`}">
        {{myBalance.toLocaleString()}}
      </div>
      <div class="account-balance-symbol text-center">TOMO</div>
    </div>
    <div class="menu">
      <div class="menu-item" @click="$emit('transferClick')">
        <fa icon="arrow-alt-circle-right" class="fs25"/> <span class="ml30">Transfer</span>
      </div>
      <div class="menu-line"></div>
      <div class="menu-item" @click="$emit('transactionsClick')">
        <fa icon="history" class="fs25"/> <span class="ml30">Transactions</span>
      </div>
      <div class="menu-line"></div>
      <div class="menu-item">
        <fa icon="coins" class="fs25"/> <span class="ml30">Earn Tomo to test</span>
      </div>
    </div>
  </div>
</template>

<script>
import Address from './Address';

export default {
  props: ['address', 'balance'],
  components: {
    Address
  },
  data() {
    return {
      myBalance: this.$props.balance || Math.round(Math.random() * 10000000) / 100 || 500
    }
  },
  computed: {
    balanceSize() {
      var s = this.myBalance.toLocaleString();
      switch (s.length) {
        case 1: return 100;
        case 2: return 100;
        case 3: return 100;
        case 4: return 100;
        case 5: return 100;
        case 6: return 100;
        case 7: return 80;
        case 8: return 70;
        case 9: return 65;
        case 10: return 65;
      }
      return 50;
    }
  }
}
</script>


<style lang="stylus" scoped>
  .account
    background #2C2C2C
    width 380px
    color #ffffff
    position relative
    &-balance
      padding 15px 20px

      &-number
        font-size 100px
        font-weight 80
        margin-top 35px
        line-height 1.1

      &-symbol
        font-size 16px
        font-weight 300
        margin-bottom 10px
        opacity 0.5

    .menu
      position absolute
      bottom 0
      left 0
      right 0
      &-line
        border-top 1px solid rgba(256, 256, 256, 0.2)
      &-item
        font-size 25px
        font-weight 200
        opacity 0.7
        transition all 0.3s
        cursor pointer
        padding 0 25px
        height 70px
        display flex
        align-items center

        &:hover
          opacity 1
</style>

