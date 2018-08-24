<template>
  <div class="earntomo">
    <div>Hello friends, click <b>Request</b> button bellow to receive your first Tomocoins from Tomo Reward Engine</div>
    <button class="btn-big btn-black mt50" @click="request">{{isRequested ? 'requested' : 'request'}}</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['address'],
  data() {
    return {
      isRequested: !!localStorage.requestedTomo || false
    }
  },
  methods: {
    request() {
      if (this.isRequested) return;

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
