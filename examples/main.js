import Vue from 'vue'
import App from './App.vue'
import VueOrgChart from '../src/index'

Vue.use(VueOrgChart)

new Vue({
  el: '#app',
  render: h => h(App)
})

