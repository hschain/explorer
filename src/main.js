import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VueClipboard from 'vue-clipboard2' // 剪切板
import echarts from 'echarts' //echarts可视化列表

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import http from '@/utils/http' // 引入封装的axios请求
import api from '@/api/ApiSetting' // 接口列表
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(VueClipboard)
Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
