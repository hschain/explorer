import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import option from './modules/option'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    option
  },
  getters
})

export default store
