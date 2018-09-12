<template>
  <div class="transfer">
    <div v-if="showSummary && !error" class="transfer-summary">
      <div>Your transaction is in process!<br/>
        Click <a target="_blank" :href="`https://scan.testnet.tomochain.com/txs/${hash}`">here</a> to check your transaction on TomoScan
      </div>
      <button class="btn-big btn-black outline mt30" @click="doAnotherTransaction">
        Do another transaction
      </button>
    </div>
    <div v-else>
      <div class="fs16">Recipient Address</div>
      <div>
        <input type="text" class="transfer-address" placeholder="enter recipient address"
          v-model="toAddress" @change="changeAddress">
        <div :style="{opacity: errorAddress ? 1 : 0}" class="transfer-error text-right mt5">{{errorAddress || '&nbsp;'}}</div>
      </div>

      <div class="fs16 mt30">Amount (Not include Tx Fee: 0.000000000000021 TOMO)</div>
      <div>
        <input
          ref="amountInput"
          type="number" class="transfer-amount"
          placeholder="0"
          @change="changeAmount">
        <div class="transfer-symbol">TOMO</div>
        <div :style="{opacity: errorAmount ? 1 : 0}"  class="transfer-error text-right mt15">{{errorAmount || '&nbsp;'}}</div>
      </div>
      <div :style="{opacity: error ? 1 : 0}" class="transfer-error text-center mt15">{{error || '&nbsp;'}}</div>
      <div class="text-center">
        <button v-if="!isSending" class="btn-big btn-black mt30" @click="send">
          <span class="ml30">SEND</span> <fa icon="arrow-right" class="fs15 ml30"/>
        </button>
        <button v-else class="btn-big btn-black mt30" >
          SENDING...
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';

export default {
  props: ['address', 'balance', 'isSending', 'error'],
  data() {
    return {
      toAddress: '',
      amount: 0,
      errorAmount: '',
      errorAddress: '',
      showSummary: false,
      hash: ''
    }
  },
  methods: {
    amountKeyDown(e) {
      // console.log(this.$refs.amountInput.value, e);
      // if (this.$refs.amountInput.value === '0' && e.key !== '.') {
      //   this.$refs.amountInput.value = parseFloat(this.$refs.amountInput.value) || '';
      // }
    },
    changeAddress() {
      this.toAddress = (this.toAddress || '').trim();
      if (!this.toAddress) {
        this.errorAddress = 'enter recipient address, please';
        return;
      }
      if (!Web3.utils.isAddress(this.toAddress)) {
        this.errorAddress = 'address is invalid, please try again';
        return;
      };

      // if (this.toAddress === this.address) {
      //   this.errorAddress = 'recipient address is your, please try again';
      //   return;
      // }

      this.errorAddress = '';
    },
    formatBalance() {
      if (this.balance < 0.01) {
        var result = Math.floor(this.balance * 10000) / 10000
        return result.toFixed(4);
      }
      else {
        result = Math.floor(this.balance * 100) / 100
        return result.toFixed(2);
      }
    },
    changeAmount() {
      this.amount = parseFloat(this.$refs.amountInput.value) || 0;
      if (isNaN(this.amount)) {
        this.errorAmount = 'Value must be a number';
        return;
      }
      if (this.amount <= 0 || this.amount > this.balance) {
        this.errorAmount = `Value must be less than ${this.formatBalance()} and greater than 0`
        return;
      }

      this.errorAmount = '';
    },
    doAnotherTransaction() {
      this.showSummary = false;
      this.amount = 0;
      this.toAddress = '';
      this.hash = '';
    },
    send() {
      if (!this.toAddress) {
        this.errorAddress = 'enter recipient address, please';
        return;
      }
      if (!Web3.utils.isAddress(this.toAddress)) {
        this.errorAddress = 'address is invalid, please try again';
        return;
      };
      if (!this.amount) {
        this.errorAmount = 'enter amount, please';
        return;
      }
      if (isNaN(this.amount) || this.amount <= 0 || this.amount > this.balance) {
        this.errorAmount = `Value must be less than ${this.balance.toLocaleString()} and greater than 0`
        return;
      }

      if (this.isSending) {
        return;
      }
      if (!this.errorAmount && !this.errorAddress && this.amount && this.toAddress) {
        this.$emit('sendClick', {toAddress: this.toAddress, amount: this.amount, callback: (hash) => {
          this.showSummary = true;
          this.hash = hash;
        }});
      }
    }
  }
}
</script>


<style lang="stylus" scoped>
  .transfer
    padding 30px
    &-summary
      margin-top 100px
      text-align center
      font-size 30px
      font-weight 300

    &-address
      font-size 20px
      color #333333
      font-weight 300
      border 1px solid rgba(0,0,0,0.15)
      border-radius 5px
      padding 15px 10px
      width calc(100% - 20px)
      margin-top 5px
      text-align center
      outline none
      transition all 0.3s
      // font-family monospace
      &:focus
        border 1px solid rgba(0,0,0,0.4)

    &-amount
      font-size 80px
      color #333333
      font-weight 200
      border 1px solid rgba(0,0,0,0.15)
      border-radius 5px
      padding 30px 10px
      width calc(100% - 20px)
      margin-top 5px
      text-align center
      outline none
      transition all 0.3s
      &:focus
        border 1px solid rgba(0,0,0,0.4)

      &-none
        color gray

    &-symbol
      margin-top: -30px;
      text-align: center;
      font-size 14px;
      font-weight 400
      opacity 0.5

    &-error
      color red
      font-size 14px
      opacity 0
      transition all 0.3s
</style>
