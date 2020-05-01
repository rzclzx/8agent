import axios from '../axios/config'

let Profit = {
  backCount: () => {
    return axios({
      method: 'get',
      url: 'agent/brokerage/count'
    })
  },
  backRofit: (data) => {
    return axios({
      method: 'post',
      url: 'agent/brokerage/profit',
      data: data
    })
  },
  // /agent/config/rights
  configRights: () => {
    return axios({
      method: 'get',
      url: 'agent/config/rights'
    })
  }
}

export default Profit
