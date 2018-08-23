<template>
  <div class="account-header">
    <h1 class="white text-center">TOMO WALLET</h1>
    <div class="mt40">
      <div class="flex">
        <div class="account-header-qr">
          <QRCode :value="address" :options="{ size: 100 }"></QRCode>
        </div>
        <div class="account-header-address">
          <div >{{address}}</div>
          <button class="btn-small btn-white mt5 mr5">
            <fa icon="copy" class="fs10"/>&nbsp;&nbsp;copy
          </button>
          <button class="btn-small btn-white mt5" @click="$emit('privateKeyClick')">
            <fa icon="key" class="fs10"/>&nbsp;&nbsp;private key
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import QRCode from '@xkeshi/vue-qrcode'
export default {
  props: ['address'],
  components: {
    QRCode
  }
}
</script>

<style lang="stylus" scoped>
  .account
    &-header
      color #ffffff
      background #191919
      box-shadow 0 3px 6px rgba(0,0,0,0.3)
      padding 30px 25px

      &-qr
        width: 70px;
        height 70px;
        canvas
          width 70px;
          height 70px;

      &-address
        font-size 14px;
        font-weight 300;
        word-wrap break-word
        width: calc(100% - 80px)
        margin-left: 10px;
</style>
