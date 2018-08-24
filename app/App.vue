<template>
  <div id="app">
    <Welcome v-if="!address"
      @createWalletClick="createWallet"
      @importByPrivateKey="importWallet"/>
    <div v-else class="maincontent">
      <Account :address="address" :balance="balance"
        @detailClick="changeMainContent('detail')"
        @transferClick="changeMainContent('transfer')"
        @transactionsClick="changeMainContent('transactions')"
        @earnClick="changeMainContent('earntomo')"/>

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
        <EarnTomo v-else-if="mainContent === 'earntomo' || mainContent === 'welcome'"
          :address="address"/>
      </MainContainer>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';

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

function scrollTo(to, duration) {
    const element = document.scrollingElement || document.documentElement;
    var start = element.scrollTop;
    var change = to - start;
    var startDate = new Date();
    var easeInOutQuad = function(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };
    var animateScroll = function() {
        const currentDate = +new Date();
        const currentTime = currentDate - startDate;
        element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
        if(currentTime < duration) {
            requestAnimationFrame(animateScroll);
        }
        else {
            element.scrollTop = to;
        }
    };
    animateScroll();
};

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
      else if (this.mainContent === 'welcome') {
        return 'Welcome To Tomo Wallet'
      }

      return 'Welcome To Tomo Wallet'
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
    }
  },
  methods: {
    changeMainContent(v) {
      this.mainContent = v;
      var elmnt = document.getElementById("mainContainer");
      scrollTo(elmnt.offsetHeight, 500);
    },
    initWallet() {
      let url = 'https://testnet.tomochain.com';
      const walletProvider =
        (this.privateKey.indexOf(' ') >= 0)
        ? new HDWalletProvider(this.privateKey, url)
        : new PrivateKeyProvider(this.privateKey, url)

      this.web3.eth.setProvider(walletProvider);
      this.web3.eth.defaultAccount = this.address;
      axios.post('/api/wallets/create/' + this.address)
      axios.get('/api/wallets/txs/' + this.address)
        .then(({data}) => {
          var filter = data.filter(e => {
            return !this.logs.find(i => e.hash === e.hash);
          });
          this.logs = this.logs.concat(filter);
          this.logs = this.logs.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          localStorage.logs = JSON.stringify(this.logs);
        });
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
      this.mainContent = 'welcome';

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
      this.mainContent = 'welcome';
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
          hash: hash,
          createdAt: new Date(),
          from: this.address,
          to: toAddress,
          value: this.web3.utils.toWei(amount + '', 'ether')
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
    @media(min-width: 768px) {
      height: 100vh;
      min-height: 640px;
    }

    .maincontent
      box-shadow 3px 3px 40px rgba(0,0,0,0.1);
      display flex;

      @media(max-width 767px) {
        display block;
      }
</style>
