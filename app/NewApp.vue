<template>
  <div id="app">
    <Welcome v-if="state == 'getStart'" @createWalletClick="createWallet"/>
    <div v-else class="maincontent">
      <Account :address="walletAddress"
        @privateKeyClick="mainContent = 'privateKey'"
        @transferClick="mainContent = 'transfer'"
        @transactionsClick="mainContent = 'transactions'"/>
      <MainContainer :header="mainContainerHeader">
        <PrivateKey v-if="mainContent === 'privateKey'" :privateKey="walletPrivateKey" class="mt50" />
        <Transfer v-else-if="mainContent === 'transfer'" />
        <Transactions v-else-if="mainContent === 'transactions'" />
      </MainContainer>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';

import VueQrcode from '@xkeshi/vue-qrcode'

import VueSocketio from 'vue-socket.io';

import bip39 from 'bip39'
import hdkey from 'ethereumjs-wallet/hdkey'

import Web3 from 'web3'
import BigNumber from 'bignumber.js';

import Welcome from './components/Welcome';
import Account from './components/Account';
import MainContainer from './components/MainContainer';
import PrivateKey from './components/PrivateKey';
import Transfer from './components/Transfer';
import Transactions from './components/Transactions';

const HDWalletProvider = require('truffle-hdwallet-provider')
const PrivateKeyProvider = require('truffle-privatekey-provider')

const mnemonic = bip39.generateMnemonic()
const key = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
const wallet = key.derivePath("m/44'/60'/0'/0/0").getWallet()

Vue.use(VueSocketio, '/')

// Vue.component('qrcode', VueQrcode)

export default {
  name: 'app',
  components: {
    Welcome,
    Account,
    MainContainer,
    PrivateKey,
    Transfer,
    Transactions
  },
  data() {
    var walletAddress = '0x' + wallet.getAddress().toString('hex');
    var walletPrivateKey = wallet.getPrivateKey().toString('hex');
    var walletMnemonic = mnemonic;
    if (localStorage.wallet) {
      var localWallet = JSON.parse(localStorage.wallet);
      walletAddress = localWallet.walletAddress
      walletPrivateKey = localWallet.walletPrivateKey;
      walletMnemonic = localWallet.walletMnemonic;
    }
    return {
      mainContent: 'transactions',
      web3: {},
      showDialogConfirmDeleteWallet: false,
      showPromptCashOut: false,
      showPromptCashIn: false,
      showAlert: false,
      showPrivateKey: false,
      showQRCode: false,
      showBackupKey: false,
      showMoreInfoMainChain: false,
      showMoreInfoSideChain: false,
      msgAlert: '',
      expandSumaryCoin: false,
      state: localStorage.wallet ? 'mainScreen' : 'getStart',
      walletAddress: walletAddress,
      walletPrivateKey: walletPrivateKey,
      walletMnemonic: walletMnemonic,
      mainchainInformation: '',
      sidechainInformation: '',
      tmcSidechain: 0,
      tmcMainchain: 0,
      cashOutValue: '',
      cashInValue: '',
      isProcessing: false,
      logs: [{
        time: new Date(),
        message: 'Your TomoWallet created',
        tmcMainchain: 0,
        tmcSidechain: 0,
        total: 0,
        type: 'message'
      }]
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

      return 'Welcome To Tomo Wallet'
    },
    hasCoin() {
      return this.tmcSidechain + this.tmcMainchain > 0
    },
    cashOutValidation () {
      var isCashOutValidated = isNaN(parseFloat(this.cashOutValue)) ||
        parseFloat(this.cashOutValue) <= 0 ||
        parseFloat(this.cashOutValue) > parseFloat(this.tmcSidechain)
      return isCashOutValidated ? `Cash out value must be less than ${this.tmcSidechain} and greater than zero` : ''
    },
    cashInValidation () {
      var isCashInValidated = isNaN(parseFloat(this.cashInValue)) ||
        parseFloat(this.cashInValue) <= 0 ||
        parseFloat(this.cashInValue) > parseFloat(this.tmcMainchain)
      return isCashInValidated ? `Cash in value must be less than ${this.tmcMainchain} and greater than zero` : ''
    },
  },
  sockets:{
    connect: function(){
      this.$socket.emit('user', {address: this.walletAddress})
    },
    user: function(user){
      this.logs = user.logs;
      this.mainchainInformation = user.mainchainInformation;
      this.sidechainInformation = user.sidechainInformation;
      this.tmcSidechain = parseFloat(user.tmcSidechain);
      this.tmcMainchain = parseFloat(user.tmcMainchain);
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
      let url = 'https://testnet.tomochain.com';
      const walletProvider =
          (this.walletPrivateKey.indexOf(' ') >= 0)
          ? new HDWalletProvider(this.walletPrivateKey, url)
          : new PrivateKeyProvider(this.walletPrivateKey, url)

      this.web3 = new Web3(walletProvider)
  },
  mounted() { },
  methods: {
    transferValidation () {
      var isTransferValidated = isNaN(parseFloat(this.transferValue)) ||
        parseFloat(this.transferValue) <= 0 ||
        parseFloat(this.transferValue) > parseFloat(this.tmcSidechain)
      return isTransferValidated ? `Value must be less than ${this.tmcSidechain} and greater than zero` : ''
    },
    createWallet() {
      localStorage.wallet = JSON.stringify({
        walletAddress: this.walletAddress,
        walletPrivateKey: this.walletPrivateKey,
        walletMnemonic: this.walletMnemonic
      });

      this.state = 'mainScreen';
    },
    deleteWallet() {
      this.showDialogConfirmDeleteWallet = true;
    },
    onConfirm() {
      delete localStorage.wallet;
      delete localStorage.logs;
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    toggleExpandSumaryCoin() {
      this.expandSumaryCoin = !this.expandSumaryCoin;
    },
    showCashOut() {
      this.showPromptCashOut = true;
    },
    showCashIn() {
      this.showPromptCashIn = true;
    },
      transfer() {
          if (this.transferValidation()) {
              this.msgAlert = this.transferValidation();
              this.showAlert = true;
              return;
          }
          if (this.isProcessing) return;
          this.isProcessing = true;
          const privateKeyHex = Buffer.from(this.walletPrivateKey, 'hex')
          if (!web3.isAddress(this.toAddress)) return;

          var gasPrice = 1;
          var gasPriceHex = web3.toHex(gasPrice);
          var amount = parseInt(web3.toWei(this.transferValue, 'ether'));
          var nonce = web3.eth.getTransactionCount(this.walletAddr️ess);
          var nonceHex = web3.toHex(nonce);
          const rawTx = {
              nonce: nonceHex,
              gasPrice: gasPriceHex,
              gasLimit: config.Ethereum.gasLimit,
              to: toAddress,
              value: web3.toHex(amount),
              data: '0x00',
              chainId: 89
          };

          var tx = new EthereumTx(rawTx);
          tx.sign(privateKeyHex);

          var serializedTx = tx.serialize();

          web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), function(err, hash) {
              this.isProcessing = true;
              // sendRawTransactionResponse(err, hash, response);
          });
          /*
          axios.post('/api/wallets/transfer', {
              from: this.walletAddress,
              to: this.toAddress,
              value: this.transferValue
          });
          */
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
