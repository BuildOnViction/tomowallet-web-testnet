<template>
  <div class="welcome">
    <div class="text-center">
      <img src="/media/logo.svg" width="50px" class="mb20"/>
    </div>
    <h1 class="white">Tomo Wallet</h1>
    <div class="white">Network: Tomo testnet</div>
    <div v-if="!isImporting">
      <div class="white text-align center mt50 mb50">
        This is a wallet for Tomochain testnet version. You can receive, send and earn some token to test. Don’t send any other tokens to this address.
        <br/>
        Create a new wallet and let’s experience!
      </div>
      <button class="btn-big btn-white" @click="$emit('createWalletClick')">
        Create new wallet
      </button>
      <div class="white mt10 mb10">or</div>
      <button class="btn-big btn-white" @click="importWallet">
        Import your wallet
      </button>
    </div>
    <div v-else class="mt50">
      <div class="white fs16">Private Key or Recovery Phrases</div>
      <textarea class="welcome-privatekey" v-model="privateKey" type="text"
        placeholder="enter your private key or recovery phrases" />
      <div :style="{opacity: error ? 1 : 0}" class="welcome-error text-center">{{error || '&nbsp;'}}</div>
      <div>
        <button class="btn-big btn-white mt15" @click="importByPrivateKey">
          Import
        </button>
      </div>
      <div>
        <button class="btn-cancel mt15" @click="cancelImport">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isImporting: false,
      privateKey: '',
      error: ''
    }
  },
  methods: {
    importWallet() {
      this.isImporting = true;
    },
    cancelImport() {
      this.privateKey = '';
      this.error = '';
      this.isImporting = false;
    },
    importByPrivateKey() {
      this.privateKey = (this.privateKey || '').trim();
      if (!this.privateKey) {
        this.error = 'enter your private key, please';
        return;
      }

      if (this.privateKey.indexOf(' ') > 0) {
        if (this.privateKey.split(' ').length < 12) {
          this.error = 'recovery phrases is invalid';
          return;
        }
      }
      else {
        if (this.privateKey.length != 64) {
          this.error = 'your private key is invalid';
          return;
        }
      }

      this.$emit('importByPrivateKey', this.privateKey);
    }
  }
}
</script>


<style lang="stylus" scoped>
  .welcome
    width 650px
    background-image: url(/media/bg.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    box-shadow 0 3px 20px rgba(0,0,0,0.5)
    padding 30px 40px
    text-align center
    @media(min-width 768px) {
      border-radius 7px
    }

    &-privatekey
      padding 15px 20px
      resize none
      border 1px solid rgba(255,255,255,0.1);
      border-radius 5px
      outline none
      font-size 18px
      font-weight 400
      margin-top 5px
      width calc(100% - 40px)
      text-align center
      background rgba(255,255,255,0.9)

      &:focus
        border 1px solid rgba(255,255,255,0.4);

    &-error
      color red
      font-size 14px
      opacity 0
      transition all 0.3s

    .btn-cancel
      color #ffffff
      font-size 16px
      font-weight 400
      cursor pointer
      border none
      outline none
      background transparent

</style>
