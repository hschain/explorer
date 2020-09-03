const state = {
  path: '/',
}

const mutations = {
  HIGHLIGHT_MENU: (state, path) => {
    state.path = path
  },
}

const actions = {
  // 高亮菜单栏
  highlightMenu({ commit }, path) {
    commit('HIGHLIGHT_MENU', path)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

