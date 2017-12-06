/* eslint-disable*/
import Vue from 'vue'
import chartData from '../examples/data/index.js'

window.Promise = require('es6-promise').Promise
import {
  VoBasic,
  VoEdit
} from '../dist/vue-orgchart.esm.js'

const comps = {
  basic: VoBasic,
  edit: VoEdit,
}

let box
let vm = {}
createBox()

afterEach(() => {
  if (vm.$el) document.body.removeChild(vm.$el)
  createBox()
})

Object.keys(comps).forEach(type => {
  chartData[type].data.forEach(item => {
    describe(type + ': ', () => {
      testMount(type, comps[type], item)
    })
  })
})

function testMount (type, comp, item) {
  it(item.name, () => {
    const Ctor = Vue.extend(comp)
    const vm = new Ctor({
      propsData: { data: item.data }
    }).$mount(box)
    expect(vm.$el.classList.contains('vo-' + type)).toEqual(true)
  })
}

function createBox () {
  box = document.createElement('div')
  box.id = 'app'
  document.body.appendChild(box)
}
