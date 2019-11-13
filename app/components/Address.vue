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
          <button class="btn-small btn-white btn-copy mt5 mr5" :data-clipboard-text="address">
            <fa icon="copy" class="fs10"/>&nbsp;&nbsp;{{isCopied ? 'copied' : 'copy'}}
          </button>
          <!-- <button class="btn-small btn-white mt5 mr5" @click="$emit('privateKeyClick')">
            <fa icon="info" class="fs10"/>
          </button> -->
          <button class="btn-small btn-white mt5" @click="$emit('detailClick')">
            <fa icon="info" class="fs10"/>&nbsp;&nbsp;details
          </button>
        </div>
      </div>
      <div class="flex" style="margin-top: 20px;">
        <div class="account-header-qr">
          <QRCode :value="addresses.pubAddr" :options="{ size: 100 }"></QRCode>
        </div>
        <div class="account-header-address">
          <div >{{addresses.pubAddr}}</div>
          <button class="btn-small btn-white btn-copy mt5 mr5 privacy" :data-clipboard-text="addresses.pubAddr">
            <fa icon="copy" class="fs10"/>&nbsp;&nbsp;{{isPrivacyCopied ? 'copied' : 'copy'}}
          </button>
          <!-- <button class="btn-small btn-white mt5 mr5" @click="$emit('privateKeyClick')">
            <fa icon="info" class="fs10"/>
          </button> -->
          <button class="btn-small btn-white mt5" @click="$emit('detailClick')">
            <fa icon="info" class="fs10"/>&nbsp;&nbsp;details
          </button>
        </div>
      </div>
      <div class="mt10">
        <button class="btn-small btn-white btn-sign-out mt5" @click="deleteWallet">
          <fa icon="sign-out-alt" class="fs10" />&nbsp;&nbsp;Log out
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import QRCode from '@xkeshi/vue-qrcode';
import ClipboardJS from 'clipboard';
import {Address, Wallet} from 'tomoprivacyjs';

console.log (Address);
console.log(Wallet);
export default {
  props: ['address'],
  components: {
    QRCode
  },
  data() {
    const addressData = JSON.parse(localStorage.getItem("wallet"));

    const addresses = Address.generateKeys(
      addressData.privateKey
    );

    return {
      isCopied: false,
      isPrivacyCopied: false,
      addresses
    }
  },
  mounted() {
    var clipboard = new ClipboardJS('.btn-copy');
    clipboard.on('success', (e) => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 5000);
      e.clearSelection();
    });

    var clipboardPrivacy = new ClipboardJS('.btn-copy.prvacy');
    clipboardPrivacy.on('success', (e) => {
      this.isPrivacyCopied = true;
      setTimeout(() => {
        this.isPrivacyCopied = false;
      }, 5000);
      e.clearSelection();
    });
  },

  methods: {
    deleteWallet() {
      if (confirm("Please make sure you already backup your wallet private key before logging out.")){
        localStorage.clear();
        window.location.reload();
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .account
    &-header
      color #ffffff
      background #191919
      // background-image: url(/media/bg.jpg);
      // background-size: cover;
      // background-repeat: no-repeat;
      // background-position: center;
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
