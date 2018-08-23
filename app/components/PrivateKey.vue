<template>
  <div class="key">
    <div class="key-qr">
      <QRCode :value="privateKey" :options="{ size: 240 }"></QRCode>
    </div>
    <div class="text-center black key-k">
      <div>{{privateKey}}</div>
      <button class="btn-small btn-black mt10">
        <fa icon="copy" class="fs10"/>&nbsp;&nbsp;copy
      </button>
    </div>
  </div>
</template>

<script>

import QRCode from '@xkeshi/vue-qrcode'
export default {
  props: ['privateKey'],
  components: {
    QRCode
  }
}
</script>

<style lang="stylus" scoped>
  .key
    &-qr
      border-radius 5px
      border 1px solid rgba(0,0,0,0.2);
      padding 5px;
      width: 240px;
      height 240px;
      margin: auto

    &-k
      width: 75%
      word-wrap: break-word;
      margin: auto;
      margin-top: 20px;
      font-weight: 400;
</style>
