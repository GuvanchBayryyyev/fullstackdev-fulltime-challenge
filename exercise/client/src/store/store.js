import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    statusColor: null,
    statusText: null
  },
  mutations: {
    setStatusColor(state, color) {
        state.statusColor = color
    },
    setStatusText(state, text) {
      state.statusText = text
  },
  },
  getters: {
    statusColor: state => state.statusColor
  }
});