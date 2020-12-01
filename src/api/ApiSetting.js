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
  // 获取每秒交易数、总用户量、日产总量 、总流通量
  getFrame: {
    url: '/v1/frame',
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
  },
  // 获取Top500表格信息
  getTop500List: {
    url: '/v1/topaccounts',
    method: 'get'
  }
}

const ApiSetting = {
  ...serviceModule
}

export default ApiSetting

