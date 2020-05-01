// 过滤时间 将时间戳变成 2010-01-01 12:08:07这种格式
// type 为日期类型 'ymd' 只显示2010-01-01
export function dateFrom (dataTime ,type) {
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
}

// 数值放大1000倍
export function multiple1000 (num) {
  return num * 1000
}

// 数值缩小1000倍
export function shrink1000 (number) {
  return number * 0.001
}

// 转为比率
export function toRate (num, precision, thous) {
  if (!num && num !== 0 || num === '--') return num
  num = thous ? num * 1000 : num * 100
  return num.toFixed(precision) + (thous ? '‰' : '%')
}

// 加单位
export function addUnit (str, val) {
  return str + ' ' + val
}

// 多空
export function toSide (num) {
  return num === 1 ? '多' : '空'
}

// transToObj
export function toBool (num, obj) {
  num = num + ''
  return obj[num]
}

/*
* 数字增大或缩小相应的倍数
* multitple 倍数 number 可以为小数
* */
export function zoomNumber (number, multiple) {
  return number * multiple
}
export function number_format (number, decimals, dec_point, thousands_sep,roundtag) {
  /*
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
  * */
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
}
