const state = {
  path: '/',
  blockData: null,
  transactionData: null,
  accountDetail: null,
  transactionList: []
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
  GET_ACCOUNT_DETAIL: (state, accountDetail) => {
    state.accountDetail = accountDetail
  },
  SET_TRANSACTION_LIST: (state, transactionList) => {
    state.transactionList = transactionList
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
  // 获取账户详细信息
  getAccountDetail({ commit }, path) {
    commit('GET_ACCOUNT_DETAIL', path)
  },
  setTransactionList({ commit }, path) {
    commit('SET_TRANSACTION_LIST', path)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

