import axios from '../axios/config'

let ManageActions = {
  /**
   * 登陆
   */
  login: (data) => {
    return axios.request({
      method: 'post',
      url: 'login',
      data: data
    })
  },
  /**
   * 退出发送请求
   */
  logout: () => {
    return axios.request({
      method: 'post',
      url: 'logout'
    })
  }
}

export default ManageActions
