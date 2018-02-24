import Vue from 'vue'
import Vuex from 'vuex'
import { getData } from './service'

Vue.use(Vuex)

const state = {
  treeData: {}
}

const actions = {
  async getAreas ({ commit }) {
    const res = await getData();
    commit('getAreas', res);
  },
}

const mutations = {
  'getAreas' (state, treeData) {
    state.treeData = treeData
  },
}

export default new Vuex.Store({
  state,
  // getters,
  actions,
  mutations
})
