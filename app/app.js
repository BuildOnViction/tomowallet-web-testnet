import Vue from 'vue'
import App from './App.vue'
import './style.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faInfo, faKey, faCopy, faHistory, faArrowAltCircleRight, faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
  color: '#2196f3',
  failedColor: 'red',
  height: '2px',
  position: 'absolute'
})

library.add(faKey);
library.add(faCopy);
library.add(faHistory);
library.add(faArrowAltCircleRight);
library.add(faCoins);
library.add(faArrowRight);
library.add(faInfo);

Vue.component('fa', FontAwesomeIcon);

Vue.config.productionTip = true


new Vue({
  el: '#app',
  render: h => h(App)
})
