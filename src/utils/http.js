/**
 * Created by Yee .
 */
import axios from 'axios'
import { Message } from 'element-ui'
// import qs from 'qs'
// import { getToken } from '@/utils/auth'
import router from '@/router/index'

const pending = [] // 用于存储每个请求的取消函数和axios标识
const CancelToken = axios.CancelToken
// create an axios instance

// 用于执行取消操作
const removePending = config => {
  for (const index in pending) {
    if (pending[index].url === config.url + JSON.stringify(config.data) + '&' + config.method) {
      pending[index].cancel('cancelOption')
      pending.splice(index, 1)
    }
  }
}

const httpServer = (opts, data) => {
  // const Public = { // 公共参数
  //   _: new Date().getTime()
  // }

  const httpDefaultOpts = { // http默认配置
    method: opts.method,
    // baseURL: '/api/',
    // baseURL: 'http://192.168.2.177/api/',
    baseURL: 'https://devnet.hschain.io/api/',
    // baseURL: 'http://172.16.3.10/wcy/api/',
    // baseURL: 'http://192.168.2.113/api/',
    // baseURL: '',
    // baseURL: 'http://hsc.tt-cool.com/admin/',

    // eslint-disable-next-line
    url: opts.url,
    timeout: 120000,
    // params: Object.assign(Public, data),
    params: data,
    withCredentials: true, // 允许携带cookie,但会影响本地跨域
    // data: qs.stringify(Object.assign(Public, data)),
    data: data,
    // 设置请求头
    // headers: opts.headers ? opts.headers : (opts.method === 'get' ? {
    //   'X-Requested-With': 'XMLHttpRequest',
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json; charset=UTF-8'
    // } : {
    //   'X-Requested-With': 'XMLHttpRequest',
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    // }),
  }

  if (opts.method === 'get') {
    delete httpDefaultOpts.data
  } else {
    delete httpDefaultOpts.params
  }
  // 创建 axios 实例
  const AxiosPromise = new Promise((resolve, reject) => {
    axios(httpDefaultOpts).then(
      (res) => {
        resolve(res)
      },
    ).catch(
      (response) => {
        reject(response)
      },
    )
  })
  return AxiosPromise
}

// request interceptor
axios.interceptors.request.use(
  config => {
    // 取消重复 请求
    removePending(config)
    config.cancelToken = new CancelToken((c) => {
      pending.push({ url: config.url + JSON.stringify(config.data) + '&' + config.method, cancel: c })
    })
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
axios.interceptors.response.use(
  /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

  /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
  response => {
    const res = response.data
    removePending(res)
    // if the custom code is not 200, it is judged as an error.
    // if (res.code !== 200) {
    //   console.log(res)
    //   if (res.code === 0) {
    //     Message({
    //       message: res.error.message,
    //       type: 'error',
    //       duration: 5 * 1000
    //     })
    //   } else {
    //     Message({
    //       message: res.error || 'Error',
    //       type: 'error',
    //       duration: 3 * 1000
    //     })
    //     if (res.code === 5061) {
    //     // 携带当前页面路由，以在登录页面完成登录后返回当前页面
    //       router.replace({
    //         path: '/login',
    //         query: {
    //           redirect: router.currentRoute.fullPath
    //         }
    //       })
    //     }
    //   }
    //   return Promise.reject(new Error(res.error || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    // console.log('err' + error) // for debug

    if (error.message !== 'cancelOption') {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default httpServer

