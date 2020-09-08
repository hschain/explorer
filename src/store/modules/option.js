const state = {
  path: '/',
  blockData: null,
  transactionData: null,
}

const mutations = {
  HIGHLIGHT_MENU: (state, path) => {
    state.path = path
  },
  GET_BLOCK_DATA: (state, blockData) => {
    state.blockData = blockData
  },
  GET_TRANSACTION_DATA: (state, transactionData) => {
    state.transactionData = transactionData
  },
}

const actions = {
  // 高亮菜单栏
  highlightMenu({ commit }, path) {
    commit('HIGHLIGHT_MENU', path)
  },
  // 获取区块详细信息
  getBlockData({ commit }, path) {
    commit('GET_BLOCK_DATA', path)
  },
  // 获取交易详细信息
  getTransactionData({ commit }, path) {
    commit('GET_TRANSACTION_DATA', path)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

