import VoBasic from '../src/components/VoBasic.vue'
import VoEdit from '../src/components/VoEdit.vue'

export {
  VoBasic,
  VoEdit
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('VoBasic', VoBasic)
  window.Vue.component('VoEdit', VoEdit)
}
