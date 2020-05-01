import axios from '../axios/config'

let Customer = {
  usersQuery: (data) => {
    return axios({
      method: 'post',
      url: 'agent/users/query',
      data: data
    })
  },
  positionsQuery: (data) => {
    return axios({
      method: 'post',
      url: 'agent/user/positions/query',
      data: data
    })
  },
  usersCount: () => {
    return axios({
      method: 'post',
      url: "agent/users/count"
    })
  },
  // 补贴返佣率/user/subsidy/config
  usersSubsidy: (data) => {
    return axios({
      method: 'post',
      url: "agent/user/subsidy/config",
      data: data
    })
  }
}

export default Customer
