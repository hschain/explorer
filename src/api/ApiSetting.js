/**
 * Created by Yee .
 */
const serviceModule = {
  // 登录
  getBlocksList: {
    url: '/v1/blocks',
    method: 'get'
  }
}

const ApiSetting = {
  ...serviceModule
}

export default ApiSetting

