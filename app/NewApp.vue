<template>
  <div id="app">
    <Welcome v-if="!address"
      @createWalletClick="createWallet"
      @importByPrivateKey="importWallet"/>
    <div v-else class="maincontent">
      <Account :address="address" :balance="balance"
        @detailClick="mainContent = 'detail'"
        @transferClick="mainContent = 'transfer'"
        @transactionsClick="mainContent = 'transactions'"
        @earnClick="mainContent = 'earntomo'"/>

      <MainContainer :header="mainContainerHeader">
        <Detail v-if="mainContent === 'detail'"
          :address="address"
          :mnemonic="mnemonic"
          :privateKey="privateKey"/>
        <Transfer v-else-if="mainContent === 'transfer'"
          :address="address" :balance="balance"
          :isSending="isProcessing"
          :error="error"
          @sendClick="transfer"/>
        <Transactions v-else-if="mainContent === 'transactions'"
          :logs="logs"
          :address="address"/>
        <EarnTomo v-else-if="mainContent === 'earntomo'" />
      </MainContainer>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';

import VueSocketio from 'vue-socket.io';

// import bip39 from 'bip39'
// import hdkey from 'ethereumjs-wallet/hdkey'

import Web3 from 'web3'
import BigNumber from 'bignumber.js';
import EthereumTx from 'ethereumjs-tx';
import HDWalletProvider from 'truffle-hdwallet-provider'
import PrivateKeyProvider from 'truffle-privatekey-provider'

import Welcome from './components/Welcome';
import Account from './components/Account';
import MainContainer from './components/MainContainer';
import Detail from './components/Detail';
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
    Detail,
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

    var logs = [];
    try {
      logs = JSON.parse(localStorage.logs) || [];
    }
    catch (ex) {

    }

    return {
      mainContent: 'transactions',
      web3: {},
      address: address,
      privateKey: privateKey,
      mnemonic: mnemonic,
      balance: 0,
      error: '',
      isProcessing: false,
      logs: logs
    };
  },
  computed: {
    mainContainerHeader() {
      if (this.mainContent === 'detail') {
        return 'Your Wallet Detail';
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

      this.logs.unshift({
        time: new Date(),

      });
      localStorage.logs = JSON.stringify(this.logs);
    },
    receive: function(res){
      this.tmcSidechain = parseFloat(res.sidechain/10**18);
      this.tmcMainchain = parseFloat(res.mainchain/10**18);

      this.logs.unshift({

      });
      this.showAlert = true;
      this.msgAlert = res.log.message;
      localStorage.logs = JSON.stringify(this.logs);
      this.cashInValue = '';
    }
  },
  created() {
    let url = 'https://testnet.tomochain.com';
    this.web3 = new Web3(url);

    if (this.address) {
      this.initWallet();
      if (this.logs && this.logs.length > 0) {
        this.mainContent = 'transactions';
      }
      else {
        this.mainContent = 'transfer';
      }
      this.mainContent = 'detail'
    }
  },
  methods: {
    initWallet() {
      let url = 'https://testnet.tomochain.com';
      const walletProvider =
        (this.privateKey.indexOf(' ') >= 0)
        ? new HDWalletProvider(this.privateKey, url)
        : new PrivateKeyProvider(this.privateKey, url)

      this.web3.eth.setProvider(walletProvider);
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
      this.mainContent = 'earntomo';

      // const mnemonic = bip39.generateMnemonic();
      // const key = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
      // const wallet = key.derivePath("m/44'/60'/0'/0/0").getWallet();

      // this.address = '0x' + wallet.getAddress().toString('hex');
      // this.privateKey = wallet.getPrivateKey().toString('hex');

      const wallet = this.web3.eth.accounts.create();
      this.address = wallet.address;
      this.privateKey = wallet.privateKey.slice(2);
      this.mnemonic = '';

      localStorage.wallet = JSON.stringify({
        address: this.address,
        privateKey: this.privateKey,
        mnemonic: this.mnemonic
      });

      this.initWallet();
    },
    importWallet(privatekeyOrMnemonic) {
      this.mainContent = 'earntomo';
      // if (privatekeyOrMnemonic.indexOf(' ') > 0) {
      //   const key = hdkey.fromMasterSeed(bip39.mnemonicToSeed(privatekeyOrMnemonic));
      //   const wallet = key.derivePath("m/44'/60'/0'/0/0").getWallet();

      //   this.address = '0x' + wallet.getAddress().toString('hex');
      //   this.privateKey = wallet.getPrivateKey().toString('hex');
      //   this.mnemonic = privatekeyOrMnemonic;
      // }
      // else {
      if (privatekeyOrMnemonic[0] !== '0' || privatekeyOrMnemonic[1] !== 'x') {
        privatekeyOrMnemonic = '0x' + privatekeyOrMnemonic;
      }
      const wallet = this.web3.eth.accounts.privateKeyToAccount(privatekeyOrMnemonic);
      this.address = wallet.address;
      this.privateKey = privatekeyOrMnemonic.slice(2);
      this.mnemonic = '';
      // }

      localStorage.wallet = JSON.stringify({
        address: this.address,
        privateKey: this.privateKey,
        mnemonic: this.mnemonic
      });

      this.initWallet();
    },
    transfer({toAddress, amount}) {
      if (this.isProcessing) return;
      this.isProcessing = true;
      this.web3.eth.sendTransaction({
        from: this.address,
        to: toAddress,
        value: this.web3.utils.toWei(amount + '', 'ether'),
        gasLimit: 21000,
        gasPrice: 1
      }, (err, hash) => {
        if (err) {
          this.error = err.toString();
        }

        this.addNewLog({
          txHash: hash,
          time: new Date(),
          from: this.address,
          to: toAddress,
          amount: amount
        })

        this.isProcessing = false;
      })
    },
    addNewLog(log) {
      this.logs.unshift(log);
      localStorage.logs = JSON.stringify(this.logs);
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
