/**
 * Created by Yee .
 */
const serviceModule = {
  // 获取区块信息
  getBlocksList: {
    url: '/v1/blocks',
    method: 'get'
  },
  // 获取交易信息
  getTransactionsList: {
    url: '/v1/txs',
    method: 'get'
  },
  // 获取资产信息
  getCurrency: {
    url: '/v1/total',
    method: 'get'
  },
  // 获取资产详情信息
  getAccountDetail: {
    url: '/v1/account',
    method: 'get'
  },
  // 获取总流通量和tps
  getMinting: {
    url: '/v1/minting/status',
    method: 'get'
  },
  // 获取页面头部下拉框信息
  getNodes: {
    url: '/v1/nodes',
    method: 'get'
  },
  // 获取tps
  getTps: {
    url: '/v1/tps',
    method: 'get'
  }
}

const ApiSetting = {
  ...serviceModule
}

export default ApiSetting

