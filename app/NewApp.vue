<template>
  <div id="app">
    <Welcome v-if="!address" @createWalletClick="createWallet"/>
    <div v-else class="maincontent">
      <Account :address="address" :balance="balance"
        @privateKeyClick="mainContent = 'privateKey'"
        @transferClick="mainContent = 'transfer'"
        @transactionsClick="mainContent = 'transactions'"
        @earnClick="mainContent = 'earntomo'"/>
      <MainContainer :header="mainContainerHeader">
        <PrivateKey v-if="mainContent === 'privateKey'" :privateKey="privateKey" class="mt50" />
        <Transfer v-else-if="mainContent === 'transfer'"
          :address="address" :balance="balance"
          :isSending="isProcessing"
          :hasError="error"
          @sendClick="transfer"/>
        <Transactions v-else-if="mainContent === 'transactions'" />
        <EarnTomo v-else-if="mainContent === 'earntomo'" />
      </MainContainer>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';

import VueSocketio from 'vue-socket.io';

import bip39 from 'bip39'
import hdkey from 'ethereumjs-wallet/hdkey'

import Web3 from 'web3'
import BigNumber from 'bignumber.js';
import EthereumTx from 'ethereumjs-tx';
import HDWalletProvider from 'truffle-hdwallet-provider'
import PrivateKeyProvider from 'truffle-privatekey-provider'

import Welcome from './components/Welcome';
import Account from './components/Account';
import MainContainer from './components/MainContainer';
import PrivateKey from './components/PrivateKey';
import Transfer from './components/Transfer';
import Transactions from './components/Transactions';
import EarnTomo from './components/EarnTomo';
import { setInterval, clearInterval } from 'timers';

Vue.use(VueSocketio, '/')

export default {
  name: 'app',
  components: {
    Welcome,
    Account,
    MainContainer,
    PrivateKey,
    Transfer,
    Transactions,
    EarnTomo
  },
  data() {
    var address = '';
    var privateKey = '';
    var mnemonic = '';

    if (localStorage.wallet) {
      var localWallet = JSON.parse(localStorage.wallet);
      address = localWallet.address
      privateKey = localWallet.privateKey;
      mnemonic = localWallet.mnemonic;
    }
    return {
      mainContent: 'transfer',
      web3: {},
      address: address,
      privateKey: privateKey,
      mnemonic: mnemonic,
      balance: 0,
      error: '',
      isProcessing: false,
    };
  },
  computed: {
    mainContainerHeader() {
      if (this.mainContent === 'privateKey') {
        return 'Your Private Key';
      }
      else if (this.mainContent === 'transfer') {
        return 'Transfer TomoCoin'
      }
      else if (this.mainContent === 'transactions') {
        return 'Transactions'
      }
      else if (this.mainContent === 'earntomo') {
        return 'Earn Tomo To Test'
      }

      return 'Welcome To Tomo Wallet'
    }
  },
  sockets:{
    connect: function(){
      this.$socket.emit('user', {address: this.address})
    },
    user: function(user){
      this.logs = user.logs;
      this.balance = user.balance;
      localStorage.logs = JSON.stringify(this.logs);
    },
    transfer: function(res){
      this.isProcessing = false;
      this.tmcSidechain = parseFloat(res.sidechain/10**18);
      this.tmcMainchain = parseFloat(res.mainchain/10**18);

      this.logs.unshift({
        time: new Date(),
        message: res.log.message,
        tmcSidechain: parseFloat(res.log.tmcSidechain),
        tmcMainchain: parseFloat(res.log.tmcMainchain),
        txMainchain: res.log.txMainchain,
        txSidechain: res.log.txSidechain,
        total: this.tmcSidechain + this.tmcMainchain,
        type: 'transfer'
      });
      this.showAlert = true;
      this.msgAlert = res.log.message;
      localStorage.logs = JSON.stringify(this.logs);
      this.cashInValue = '';
    },
    receive: function(res){
      this.tmcSidechain = parseFloat(res.sidechain/10**18);
      this.tmcMainchain = parseFloat(res.mainchain/10**18);

      this.logs.unshift({
        time: new Date(),
        message: res.log.message,
        tmcSidechain: parseFloat(res.log.tmcSidechain),
        tmcMainchain: parseFloat(res.log.tmcMainchain),
        txMainchain: res.log.txMainchain,
        txSidechain: res.log.txSidechain,
        total: this.tmcSidechain + this.tmcMainchain,
        type: 'receive'
      });
      this.showAlert = true;
      this.msgAlert = res.log.message;
      localStorage.logs = JSON.stringify(this.logs);
      this.cashInValue = '';
    }
  },
  created() {
    if (this.address) {
      this.initWeb3();
    }
  },
  methods: {
    initWeb3() {
      let url = 'https://testnet.tomochain.com';

      // this.web3 = new Web3(url);
      const walletProvider =
          (this.privateKey.indexOf(' ') >= 0)
          ? new HDWalletProvider(this.privateKey, url)
          : new PrivateKeyProvider(this.privateKey, url)

      this.web3 = new Web3(walletProvider)

      this.web3.eth.defaultAccount = this.address;
      this.getBalance();
      setInterval(() => {
        this.getBalance();
      }, 1000);
    },
    getBalance() {
      this.web3.eth.getBalance(this.address, (err, v) => {
        this.balance = Math.floor(parseFloat(v) / (10 ** 18) * 100) / 100;
      });
    },
    createWallet() {
      const mnemonic = bip39.generateMnemonic();
      const key = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
      const wallet = key.derivePath("m/44'/60'/0'/0/0").getWallet();

      this.address = '0x' + wallet.getAddress().toString('hex');
      this.privateKey = wallet.getPrivateKey().toString('hex');
      this.mnemonic = mnemonic;

      localStorage.wallet = JSON.stringify({
        address: this.address,
        privateKey: this.privateKey,
        mnemonic: this.mnemonic
      });

      this.initWeb3();

      this.state = 'mainScreen';
    },
    transfer({toAddress, amount}) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.web3.eth.sendTransaction({
          from: this.address,
          to: toAddress,
          value: amount * (10 ** 18),
          gasLimit: 21000,
          gasPrice: 1
        }, (err, hash) => {
          if (err) {
            this.error = err.toString();
          }
          this.isProcessing = false;
        })
    }
  }
};
</script>

<style lang="stylus" scoped>
  #app
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    min-height: 640px;

    .maincontent
      box-shadow 3px 3px 40px rgba(0,0,0,0.1);
      display flex;
</style>
