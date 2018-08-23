import Vue from 'vue'
import App from './NewApp.vue'
import './style.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faKey, faCopy, faHistory, faArrowAltCircleRight, faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faKey);
library.add(faCopy);
library.add(faHistory);
library.add(faArrowAltCircleRight);
library.add(faCoins);
library.add(faArrowRight);

Vue.component('fa', FontAwesomeIcon);

Vue.config.productionTip = true


new Vue({
  el: '#app',
  render: h => h(App)
})
