import Vue from 'vue'
import App from './App.vue'
import store from './store'
import '../dist/style.min.css'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
