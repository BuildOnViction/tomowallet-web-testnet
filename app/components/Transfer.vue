<template>
  <div class="transfer">
    <div class="fs18">Recipient Address</div>
    <div>
      <input type="text" class="transfer-address" placeholder="enter recipient address"
        v-model="address">
    </div>

    <div class="fs18 mt50">Amount</div>
    <div>
      <input
        ref="amountInput"
        type="number" class="transfer-amount"
        v-model="amount"
        >
      <div class="transfer-symbol">TOMO</div>
    </div>
    <div class="text-center">
      <button class="btn-big btn-black mt50">
        <span class="ml30">SEND</span> <fa icon="arrow-right" class="fs25 ml30"/>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: '',
      amount: 0
    }
  },
  methods: {
    amountKeyDown(e) {
      // console.log(this.$refs.amountInput.value, e);
      // if (this.$refs.amountInput.value === '0' && e.key !== '.') {
      //   this.$refs.amountInput.value = parseFloat(this.$refs.amountInput.value) || '';
      // }
    },
    changeAmount() {
      this.amount = parseFloat(this.$refs.amountInput.value) || 0;
      this.$refs.amountInput.value = this.amount;
    }
  }
}
</script>


<style lang="stylus" scoped>
  .transfer
    padding 30px
    &-address
      font-size 20px
      color #333333
      font-weight 300
      border 1px solid rgba(0,0,0,0.15)
      border-radius 5px
      padding 15px 10px
      width calc(100% - 15px)
      margin-top 5px
      text-align center
      outline none
      // font-family monospace

    &-amount
      font-size 80px
      color #333333
      font-weight 200
      border 1px solid rgba(0,0,0,0.15)
      border-radius 5px
      padding 30px 10px 30px 15px
      width calc(100% - 20px)
      margin-top 5px
      text-align center
      outline none

      &-none
        color gray

    &-symbol
      margin-top: -30px;
      text-align: center;
      font-size 16px;
      font-weight 300
</style>
