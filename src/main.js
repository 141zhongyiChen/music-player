// Es6 api 转义补丁
import 'babel-polyfill'
// 遇到错误： body 用到 自定义变量 , 应在 之前引入[ 否则报错]
import './common/stylus/index.styl'

import Vue from 'vue'
import App from './App'
import router from './router'

/* 解决 屏幕点击 300毫秒 延时 */
import fastclick from 'fastclick'

/* LazyLoad */
import VLazyLoad from 'vue-lazyload'

import store from './store'
Vue.use(VLazyLoad, {
  loading: require('common/image/logo.png')
})

fastclick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  /* components: { App },
  template: '<App/>' */
  store,
  render: h => h(App)
})
