import Profit from './profit'
import ManageActions from './manageActions'
import Customer from './customer'
// Vue插件 如果插件是一个对象，必须提供install方法
export default {
  install (Vue) {
    // 为Vue注册实例方法
    Vue.prototype.profit = Profit
    Vue.prototype.manageAction = ManageActions
    Vue.prototype.customer = Customer
  }
}
