<template>
  <div class="earntomo">
    <div>Go <a href="https://faucet.testnet.tomochain.com/" target="_blank">here</a> and then enter your wallet address.<br/> We will send 15 TOMO to you.</div>

    <button class="btn-big btn-black mt50" @click="request">request 15 tomo</button>
  </div>
</template>

<script>
export default {
  methods: {
    request() {
      window.open('https://faucet.testnet.tomochain.com/', '_blank')
    }
  }
}
</script>


<style lang="stylus" scoped>
  .earntomo
    text-align center
    margin-top 100px
    font-size 30px
    font-weight 300
</style>
