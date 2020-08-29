import { getToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
}

const actions = {
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

