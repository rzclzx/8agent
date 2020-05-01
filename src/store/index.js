import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
let titlenav =[
  {
    name: '首页',
    path: '/home'
  }
]
sessionStorage.setItem("title_list",sessionStorage.getItem('title_list')?sessionStorage.getItem('title_list'):JSON.stringify(titlenav))
const module = {
  state: {
    user: {},
    title_nav_main1: JSON.parse(sessionStorage.getItem('title_list'))
  },
  mutations: {
    setUser (state, data) {
      state.user = data || {}
    },
    setTitleSession (state,val) {
      if (val) {
        state.title_nav_main1.push(val)
      }
      sessionStorage.setItem("title_list",JSON.stringify(state.title_nav_main1))
    },
    replaceQuery (state,val) {
      if (val) {
        state.title_nav_main1.map((item) => {
          if (item.path === val.path) {
            item.query = val.query
          }
        })
      }
      sessionStorage.setItem("title_list",JSON.stringify(state.title_nav_main1))
    },
    clearTitle (state,val) {
      state.title_nav_main1 = val
      sessionStorage.setItem("title_list",JSON.stringify(state.title_nav_main1))
    },
    closeTitle (state,val) {
      sessionStorage.setItem("title_list",JSON.stringify(val))
    }
  }
}

const store = new Vuex.Store(module)

export default store
