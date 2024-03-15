// cookies封装
const cookies = {
  // 设置cookie
  setCookie(name, value, expiredays) {
    const exDate = new Date()
    exDate.setDate(exDate.getDate() + expiredays)
    document.cookie = name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exDate.toGMTString())
  },

  // 获取cookie
  getCookie(name) {
    let arr
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg)) != null) {
      return (arr[2])
    } else {
      return null
    }
  },

  // 删除cookie
  removeCookie(name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = this.getCookie(name)
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }
}

export default cookies