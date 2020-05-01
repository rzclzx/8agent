let commonMethods = {
  /**
   * 格式化时间 2010-02-02 05:06:12
   * type = ymd 仅获得年月日
   * **/
  dateForm (dataTime ,type) {
    let time = new Date(dataTime)
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let date = time.getDate()
    let hours = time.getHours()
    let minutes = time.getMinutes()
    let seconds = time.getSeconds()
    function getTwo (str) {
      return str.toString().length === 1? ('0' + str): str
    }
    if (type === 'ymd') {
      return year + '-' + getTwo(month) + '-' + getTwo(date)
    } else {
      return year + '-' + getTwo(month) + '-' + getTwo(date) + ' ' + getTwo(hours) + ':' + getTwo(minutes) + ':' + getTwo(seconds)
    }
  },
  /**
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
    * */
  number_format (number, decimals, dec_point, thousands_sep,roundtag) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    roundtag = roundtag || "ceil" // "ceil","floor","round"
    let n = !isFinite(+number) ? 0 : +number
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep
    let dec = (typeof dec_point === 'undefined') ? '.' : dec_point
    let s = ''
    function toFixedFix (n, prec) {
      let k = Math.pow(10, prec)
      console.log()
      return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec*2)) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    let re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, "$1" + sep + "$2")
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  },
  /**
   * 用于提交或取消后清空本地属性
   */
  clearAttrs (obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        obj[prop] = ''
      }
    }
  }
}

export default commonMethods
