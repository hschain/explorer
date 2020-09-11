/**
 * Created by Yee .
 */
const serviceModule = {
  // 获取区块信息
  getBlocksList: {
    url: '/v1/blocks',
    method: 'get'
  },
  getTransactionsList: {
    url: '/v1/txs',
    method: 'get'
  },
  getCurrency: {
    url: '/v1/total',
    method: 'get'
  },
  getAccountDetail: {
    url: '/v1/account',
    method: 'get'
  },
  getMinting: {
    url: '/v1/minting/status',
    method: 'get'
  }
}

const ApiSetting = {
  ...serviceModule
}

export default ApiSetting

