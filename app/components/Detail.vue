<template>
  <div class="detail">
    <div class="bold mb10">Address</div>
    <div class="detail-qr">
      <QRCode :value="address" :options="{ size: 150 }"></QRCode>
    </div>
    <div class="detail-address mt10">{{address}}</div>

    <div v-if="privateKey" class="mt40">
      <div class="bold">Private Key</div>
      <div class="detail-privateKey">{{privateKey}}</div>
    </div>

    <div v-if="mnemonic" class="mt40">
      <div class="bold">Recovery Phrases</div>
      <div class="detail-privateKey">{{mnemonic}}</div>
    </div>

    <button class="btn-big btn-black btn-delete mt40" @click="deleteWallet">DELETE THIS WALLET</button>
    <!-- <div class="mt40">
      <div class="bold">Recovery Phrases</div>
      <div class="detail-privateKey">{{mnemonic}}</div>
    </div> -->
  </div>
</template>

<script>

import QRCode from '@xkeshi/vue-qrcode'
export default {
  props: ['address', 'mnemonic', 'privateKey'],
  components: {
    QRCode
  },
  methods: {
    deleteWallet() {
      if (confirm("When wallet was deleted, you cannot recover your wallet. But don't worry, this is testnet only :)")){
        localStorage.clear();
        window.location.reload();
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .detail
    margin-top 20px
    text-align center
    padding 0 30px
    .bold
      font-weight 600
    &-qr
      border-radius 5px
      border 1px solid rgba(0,0,0,0.2);
      padding 5px;
      width: 150px;
      height 150px;
      margin: auto
      overflow hidden

    &-address
      font-size 18px
      color #333333
      font-weight 400
      text-align center
      word-wrap: break-word;

    &-privateKey
      word-wrap: break-word;
      font-size 18px
      color #333333
      font-weight 400
      border 1px solid rgba(0,0,0,0.15)
      border-radius 5px
      padding 15px 10px
      margin-top 5px
      text-align center
      outline none
      transition all 0.3s

    .btn-delete
      color red
      border 1px solid red
      background transparent
      opacity 0.7
      &:hover
        opacity 1
</style>
