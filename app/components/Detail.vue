<template>
  <div class="detail">
    <div class="bold mb10">Address</div>
    <div class="detail-qr">
      <QRCode :value="address" :options="{ size: 150 }"></QRCode>
    </div>
    <div class="detail-address mt10">{{address}}</div>

    <div v-if="privateKey" class="mt40">
      <div class="bold">Private Key &nbsp;&nbsp;
        <div @click="disclosePrivateKey">
          <fa v-if="secretPrivateKey" icon="eye" class="fs50 handCursor"/>
          <fa v-if="!secretPrivateKey" icon="eye-slash" class="fs50 handCursor"/>
        </div>
      </div>
      <div id="detail-privateKey" class="detail-privateKey">&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;</div>
    </div>

    <div v-if="mnemonic" class="mt40">
      <div class="bold">Recovery Phrases &nbsp;&nbsp;
        <div @click="discloseRecoveryPhrases">
          <fa v-if="secretMnemonic" icon="eye" class="fs50 handCursor"/>
          <fa v-if="!secretMnemonic" icon="eye-slash" class="fs50 handCursor"/>
        </div>
      </div>
      <div id="detail-mnemonic" class="detail-privateKey">&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;</div>
    </div>
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
  data() {
    return {
      secretPrivateKey: true,
      secretMnemonic : true
    }
  },
  methods: {
    disclosePrivateKey() {
      if (this.secretPrivateKey) {
        document.getElementById("detail-privateKey").innerHTML = this.privateKey
        this.secretPrivateKey = false
      } else {
        document.getElementById("detail-privateKey").innerHTML =
          "&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
        this.secretPrivateKey = true
      }
    },
    discloseRecoveryPhrases() {
      if (this.secretMnemonic) {
        document.getElementById("detail-mnemonic").innerHTML = this.mnemonic
        this.secretMnemonic = false
      } else {
        document.getElementById("detail-mnemonic").innerHTML =
          "&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
        this.secretMnemonic = true
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

    .handCursor
      cursor: pointer
</style>
