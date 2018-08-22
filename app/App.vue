<template>
  <div id="app">
    <div v-if="state=='getStart'" class="page-layout getStartScreen">
      <div class="page-bg"></div>
      <div class="logo">
        <img src="/media/logo.svg">
      </div>
      <md-card class="md-primary welcome-board" md-with-hover>
        <md-ripple>
          <md-card-header>
            <div class="md-title">Welcome to TomoWallet</div>
            <div class="md-subhead">Testnet mode</div>
          </md-card-header>

          <md-card-content>
            This demo will show you how to earn Tomocoins (TOMO) from RewardEngine, how to transfer TOMO from Tomochain to Ethereum (CashOut) and how to transfer TOMO from Ethereum from Tomochain.
          </md-card-content>
          <md-card-content>
            Create a new wallet and let's experience!
          </md-card-content>

          <md-card-actions>
            <md-button class="md-raised" :md-ripple="true" @click="createWallet">
              <md-icon>add</md-icon> Create New Wallet
            </md-button>
          </md-card-actions>
        </md-ripple>
      </md-card>
    </div>
    <div v-if="state == 'mainScreen'" class="page-layout mainScreen">
      <md-toolbar class="md-large md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <h3 class="md-title" style="flex: 1">Your TomoWallet</h3>
          </div>

          <div class="md-toolbar-section-end">
            <md-menu md-direction="bottom-start" md-align-trigger>
              <md-button md-menu-trigger>
                <md-icon>more_vert</md-icon>
              </md-button>

              <md-menu-content>
                <md-menu-item><md-button class="md-primary" @click="showQRCode = true">Show Your QR Code</md-button></md-menu-item>
                <md-menu-item><md-button class="md-primary" @click="showPrivateKey = true">Show Your Private Key</md-button></md-menu-item>
                <md-menu-item><md-button class="md-primary" @click="showBackupKey = true">Show Your Backup Key</md-button></md-menu-item>
                <md-menu-item><md-button class="md-accent" @click="deleteWallet">Delete My Wallet</md-button></md-menu-item>
              </md-menu-content>
            </md-menu>
            <md-dialog :md-active.sync="showQRCode">
            <md-tabs md-dynamic-height>
            <md-tab md-label="Your Address">
            <md-content><qrcode :value="walletAddress" :options="{ size: 500 }"></qrcode></md-content>
            </md-tab>
            <md-tab md-label="Your Private Key">
            <md-content><qrcode :value="walletPrivateKey" :options="{ size: 500 }"></qrcode></md-content>
            </md-tab>
            <md-tab md-label="Your Backup Words">
            <md-content><qrcode :value="walletMnemonic" :options="{ size: 500 }"></qrcode></md-content>
            </md-tab>
            </md-tabs>
            <md-dialog-actions>
            <md-button class="md-primary" @click="showQRCode = false">Close</md-button>
            </md-dialog-actions>
            </md-dialog>

            <md-dialog-alert
              :md-active.sync="showPrivateKey"
              md-title="Your private key"
              :md-content="`Make it safe: <br/><strong>${walletPrivateKey}</strong> <br />You can import this private key to Metamask, MEW wallet to check your balance.`" />
            <md-dialog-alert
              :md-active.sync="showBackupKey"
              md-title="Your backup key"
              :md-content="`Make it safe: <br/><strong>${walletMnemonic}</strong>`" />
          </div>
        </div>
        <div class="sumaryCoin">
          <h3>You have:</h3>
          <h1>
            <strong>{{(tmcSidechain + tmcMainchain).toFixed(2)}}</strong>
            <small>TOMO</small>
            <span v-if="expandSumaryCoin">
              = {{tmcSidechain}}
            </span>
            <md-button class="md-icon-button" @click="toggleExpandSumaryCoin">
              <md-icon v-if="expandSumaryCoin">keyboard_arrow_left</md-icon>
              <md-icon v-else>info_outline</md-icon>
            </md-button>
          </h1>
          <h4>{{walletAddress}}</h4>
        </div>
      </md-toolbar>


      <md-empty-state v-if="!hasCoin"
        md-icon="devices_other"
        md-label="Get your first Tomocoins"
        md-description="Hello friends, click MINE TomoCoin to receive your first Tomocoins from Tomo Reward Engine">
        <md-button class="md-raised md-primary" @click="reward()">Mine TomoCoin</md-button>
      </md-empty-state>
      <div v-else>

        <div class="transfer-tmc">
          <div class="md-layout md-gutter md-alignment-center">
            <div class="md-layout-item md-medium-size-50 md-small-size-70 md-xsmall-size-100">
              <md-card>
                <md-card-header>
                  <div class="md-title">Send TOMO</div>
                  <div class="md-subhead">Only in <b>tomochain - nearly zero fee, fast confirmation</b></div>
                </md-card-header>
                <md-card-content>
                  <md-field>
                    <label>To Address</label>
                    <md-input v-model="toAddress"></md-input>
                  </md-field>
                  <md-field>
                    <label>Value (TOMO)</label>
                    <md-input v-model="transferValue"></md-input>
                  </md-field>
                </md-card-content>

                <md-card-actions>
                  <md-button class="md-primary md-raised" @click="transfer">
                    Send <md-icon>arrow_forward</md-icon>
                  </md-button>
                </md-card-actions>
              </md-card>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="log-table" v-if="logs.length > 0">
          <md-table md-card>
            <md-table-row>
              <md-table-head style="width: 230px">Time</md-table-head>
              <md-table-head style="width: 250px">Type</md-table-head>
              <md-table-head>Detail</md-table-head>
              <md-table-head md-numeric>TOMO in Tomochain</md-table-head>
              <md-table-head>Transaction in Tomochain</md-table-head>
              <md-table-head md-numeric>TOMO in Ethereum</md-table-head>
              <md-table-head>Transaction in Ethereum</md-table-head>
              <md-table-head md-numeric>Total TOMO</md-table-head>
            </md-table-row>

            <md-table-row v-for="(e, i) in logs" :key="i">
              <md-table-cell>{{new Date(e.time).toLocaleString()}}</md-table-cell>
              <md-table-cell>
                <span class="type" :class="`type-${e.type}`">
                  {{e.type}}
                  <md-icon v-if="e.type == 'message'">chat_bubble_outline</md-icon>
                  <md-icon v-if="e.type == 'reward'">attach_money</md-icon>
                  <md-icon v-if="e.type == 'cashOut'">arrow_forward</md-icon>
                  <md-icon v-if="e.type == 'cashIn'">arrow_back</md-icon>
                  <md-icon v-if="e.type == 'transfer'">arrow_back</md-icon>
                  <md-icon v-if="e.type == 'receive'">arrow_forward</md-icon>
                </span>
              </md-table-cell>
              <md-table-cell>
                {{e.message}}
              </md-table-cell>
              <md-table-cell md-numeric>
                <span class="color-side-chain">
                  <a target="_blank" :href="(e.tmcSidechain)?'https://explorer-testnet.tomochain.com/txs/' + e.txSidechain:'#'">{{(e.tmcSidechain || tmcSidechain) .toFixed(2)}}</a></span>
              </md-table-cell>
              <md-table-cell>
                <span class="color-side-chain">
                  <a v-if="e.txSidechain" target="_blank" :href="'https://explorer-testnet.tomochain.com/txs/' + e.txSidechain">{{ e.txSidechain.substring(2, 10) }}...</a>
                </span>
              </md-table-cell>
              <md-table-cell md-numeric>
                <a target="_blank" :href="(e.txMainchain)?'https://rinkeby.etherscan.io/tx/' + e.txMainchain:'#'"><span class="color-main-chain">
                  {{(e.tmcMainchain || tmcMainchain).toFixed(2)}}</span></a> 
              </md-table-cell>
              <md-table-cell>
                <a v-if="e.txMainchain" target="_blank" :href="'https://rinkeby.etherscan.io/tx/' + e.txMainchain"><span class="color-main-chain">
                  {{ e.txMainchain.substring(2, 10) }}...
                </span></a>
              </md-table-cell>
              <md-table-cell md-numeric>{{(e.total || (tmcSidechain + tmcMainchain)).toFixed(2)}}</md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </div>
    </div>
    <md-dialog-confirm
      :md-active.sync="showDialogConfirmDeleteWallet"
      md-title="Do you want delete this wallet?"
      md-content="When wallet was deleted, you cannot recover your wallet. But don't worry, this is testnet only :)"
      md-confirm-text="Delete"
      md-cancel-text="Cancel"
      @md-confirm="onConfirm" />
    <md-dialog-prompt
      :md-active.sync="showPromptCashIn"
      v-model="cashInValue"
      md-title="How many coins do you want to transfer (cash in)?"
      md-input-placeholder="Amount"
      md-confirm-text="Done"
      @md-confirm="cashIn" />
    <md-dialog-prompt
      :md-active.sync="showPromptCashOut"
      v-model="cashOutValue"
      md-title="How many coins do you want to transfer (cash out)?"
      md-input-placeholder="Amount"
      md-confirm-text="Done"
      @md-confirm="cashOut" />

    <md-snackbar md-position="left"
      :md-duration="4000"
      :md-active.sync="showAlert" md-persistent>
      <span>{{msgAlert}}</span>
      <md-button class="md-primary" @click="showAlert = false">Got it!</md-button>
    </md-snackbar>
    <div style="position: fixed; top: 0; left: 0; right: 0; z-index: 9999">
      <md-progress-bar v-if="isProcessing" class="md-accent" md-mode="indeterminate"></md-progress-bar>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import axios from 'axios';

import VueQrcode from '@xkeshi/vue-qrcode'

import VueSocketio from 'vue-socket.io';

import bip39 from 'bip39'
import hdkey from 'ethereumjs-wallet/hdkey'

import Web3 from 'web3'
import BigNumber from 'bignumber.js'
const HDWalletProvider = require('truffle-hdwallet-provider')
const PrivateKeyProvider = require('truffle-privatekey-provider')

const mnemonic = bip39.generateMnemonic()
const key = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
const wallet = key.derivePath("m/44'/60'/0'/0/0").getWallet()

Vue.use(VueMaterial)
Vue.use(VueSocketio, '/')

Vue.use(VueMaterial)
Vue.component('qrcode', VueQrcode)


export default {
  name: 'app',
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
  watch: {
    '$route'() { }
  },
  created() {
      let url = 'https://t️️estnet.tomochain.com';
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

<style>

  .color-side-chain {
    color: #448aff;
  }

  .color-main-chain {
    color: #ff5252;
  }

  .getStartScreen {
    padding-top: 100px;
    width: 100vw;
    height: 100vh;
    position: relative;
  }

  .getStartScreen .logo {
    text-align: center;
    position: relative;
    margin-bottom: 20px;
  }

  .getStartScreen .logo image {
    width: 60px;
  }

  .getStartScreen .page-bg {
    background-size: 100vw 100vh;
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
  }
  .getStartScreen .md-primary {
    width: 400px;
    max-width: 90%;
    margin: auto;
  }

  .getStartScreen .md-primary .md-ripple .md-button-content {
    color: #333333;
  }

  .mainScreen .md-toolbar .md-button.md-accent {
    color: #333333 !important;
  }

  .sumaryCoin {
    padding: 0 8px;
    width: 100%;
  }

  .sumaryCoin h3 {
    margin-bottom: 40px;
  }
  .sumaryCoin h1 {
    font-size: 40px;
    line-height: 0px;
  }

  .sumaryCoin h1 strong {
    font-size: 70px;
  }

  .sumaryCoin h1 small {
    font-size: 16px;
    font-weight: 400;
    opacity: 0.8;
  }

  .sumaryCoin h1 .md-icon-button {
    height: 35px;
    min-width: 35px;
    width: 35px;
    opacity: 0.8;
  }
  .sumaryCoin h1 .md-icon-button .md-icon {
    font-size: 18px !important;
  }

  .sumaryCoin h4 {
    line-height: 0px;
  }

  .transfer-tmc {
    margin: 20px;
  }

  .cash-in-out {
    margin: 20px;
  }

  .cash-in-out .md-title {
    font-size: 70px;
    line-height: 90px;
    color: #448aff;
  }

  .cash-in-out .md-card .side-chain {
    color: #448aff;
  }

  .cash-in-out .md-card .main-chain {
    color: #ff5252;
  }

  .cash-in-out .md-title small{
    font-size: 20px;
    opacity: 0.8;
  }

  .cash-in-out .md-subhead {
    font-size: 18px;
    opacity: 0.8;
  }

  .cash-action {
    text-align: center;
  }

  .cash-action .md-button {
    width: 100%;
    margin: 10px 0;
  }

  .cash-action:first-child {
    margin-top: 30px;
  }

  .log-table {
    padding: 20px;
  }

  .log-table .type {
    padding: 2px 3px 0 10px;
    display: inline-block;
    color: #ffffff;
    border-radius: 100px;
    font-weight: bold;
  }

  .log-table .type-message {
    background: gray;
  }

  .log-table .type-reward {
    background: #009688;
  }

  .log-table .type-cashOut {
    background: #448aff;
  }

  .log-table .type-transfer {
    background: #448aff;
  }

  .log-table .type-cashIn {
    background: #ff5252;
  }

  .log-table .type-receive {
    background: #4CAF50;
  }

  .log-table .type .md-icon {
    font-size: 15px !important;
    color: inherit;
  }
  .welcome-board a {
    color: white !important;
  }
</style>
