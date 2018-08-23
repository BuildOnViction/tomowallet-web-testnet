<template>
  <div class="welcome">
    <h1 class="white">Tomo Wallet</h1>
    <div class="white">Network: Tomo testnet</div>
    <div class="white text-align center mt50 mb50">
      This a wallet for Tomochain testnet version. You can receive, send and earn some token to test. Don’t send any other token to this address.
      <br/>
      Create a new wallet and let’s experience!
    </div>
    <button class="btn-big btn-white" @click="$emit('createWalletClick')">
      Create new wallet
    </button>
  </div>
</template>

<style lang="stylus" scoped>
  .welcome
    width 600px
    background #191919
    box-shadow 0 3px 6px rgba(0,0,0,0.3)
    padding 50px 40px
    text-align center
</style>
