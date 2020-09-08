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
}

const ApiSetting = {
  ...serviceModule
}

export default ApiSetting

