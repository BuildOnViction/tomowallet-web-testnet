<template>
  <div class="earntomo">
    <div v-if="isRequested">
      We sent 15 TOMO to your wallet.<br/>Each wallet can only receive once
    </div>
    <div v-else>
      <div>Hello friends, click <b>Request</b> button bellow to receive your first TOMO</div>
      <button class="btn-big btn-black mt50" @click="request">{{isRepuesting ? 'requesting' : 'request'}}</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['address'],
  data() {
    return {
      isRepuesting: false,
      isRequested: !!localStorage.requestedTomo || false
    }
  },
  methods: {
    request() {
      if (this.isRequested) return;

      this.isRepuesting = true;
      axios.post('api/wallets/reward/' + this.address)
      .then(({data}) => {
        this.isRequested = true;
        localStorage.requestedTomo = 'true';
      })
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
    padding 30px
</style>
