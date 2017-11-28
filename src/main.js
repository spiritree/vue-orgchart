import Vue from 'vue'
import App from './components/App.vue'
import VueOrgChart from './index'

Vue.use(VueOrgChart)

new Vue({
  el: '#app',
  render: h => h(App)
})

