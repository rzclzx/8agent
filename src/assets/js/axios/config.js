// axios配置
import axios from 'axios'
import Router from '@/router/index'
import Api from '../../../../myConfig/api.config'
import Cookie from '@/assets/js/common/cookie'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.withCredentials = true
axios.defaults.baseURL = Api.baseURL
axios.interceptors.request.use((config) => {
  if (config.data) {
    for (let i in config.data) {
      if (!config.data[i] && config.data[i] !== 0) delete config.data[i]
    }
  }
  if (Cookie.getCookie('access_token')) config.headers['access_token'] = Cookie.getCookie('access_token')
  return config
},(error) => {
  console.log('错误的传参')
  return Promise.reject(error)
})

// code状态码拦截
axios.interceptors.response.use((res) => {
  if (res.data.code === 0) {
    return res.data
  } else if (res.data.code === -999) {
    Router.replace({
      path: '/login'
    })
  } else {
    return Promise.reject(res)
  }
}, (error) => {
  return Promise.reject(error.response.data)
})

export default axios
