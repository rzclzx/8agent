import {dateFrom,multiple1000,shrink1000,number_format,zoomNumber,toRate,addUnit,toSide,toBool} from './filter'
import commonMethods from './common'
export default {
  install (Vue) {
    Vue.filter('formDate', dateFrom)
    Vue.filter('multiple1000', multiple1000)
    Vue.filter('shrink1000', shrink1000)
    Vue.filter('number_format', number_format)
    Vue.filter('zoomNumber', zoomNumber)
    Vue.filter('toRate', toRate)
    Vue.filter('addUnit', addUnit)
    Vue.filter('toSide', toSide)
    Vue.filter('toBool', toBool)
    Vue.prototype.$commonMethods = commonMethods
  }
}
