import orgchart from '../src/components/vue-orgchart.vue'

export default orgchart

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('v-orgchart', orgchart)
}
