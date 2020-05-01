// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from '@/router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from '@/store/index'
import "./assets/icon/iconfont.css"
import './assets/css/style.less'
import "./assets/css/input.less"
Vue.use(ElementUI)

Vue.config.productionTip = false

// 导入基本样式
import '@/assets/css/base.css'

// 导入Api
import Api from '@/assets/js/api/index'
Vue.use(Api)

// 导入自定义过滤器
import Filter from '@/assets/js/common/index'
Vue.use(Filter)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
