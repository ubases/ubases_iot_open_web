import * as moment from 'moment';

export function timeFix() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9
    ? "早上好"
    : hour <= 11
    ? "上午好"
    : hour <= 13
    ? "中午好"
    : hour < 20
    ? "下午好"
    : "晚上好";
}

// 刷新菜单
export function refreshMenus() {
  getInfo().then((res) => {
    const permissions = res.data && res.data.permissions;
    store.dispatch("GetLatestRoutes", { permissions }).then((r) => {});
  });
}

/**
 * 判断路由是否相等
 */
 export const diff = (obj1, obj2) => {
  delete obj1.close
  var o1 = obj1 instanceof Object
  var o2 = obj2 instanceof Object
  if (!o1 || !o2) {
    /*  判断不是对象  */
    return obj1 === obj2
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
    // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object
    var t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr])
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}

/**
 * 判断路由是否相等
 */
 export const isObjectValueEqual = (a, b) => {
  let result = true
  Object.keys(a).forEach(ele => {
    const type = typeof a[ele]
    if (type === 'string' && a[ele] !== b[ele]) result = false
    else if (
      type === 'object' &&
      JSON.stringify(a[ele]) !== JSON.stringify(b[ele])
    ) {
      result = false
    }
  })
  return result
}

/**
 *  把Array Buffer转化为base64
 * @param {*} file 文件
 */
 export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * 获取树型接口的key，包括Children
 * @param {*} data 原始数据
 * @param {*} keys 要返回的key
 */
export function expandKeys(data, keys = []) {
  data.map((item) => {
    keys.push(item._id || item.id);
    if (item.children !== undefined) {
      expandKeys(item.children, keys);
    }
  });
}

/**
 * 普通数组转树级数组
 * @param {*} data 原始数组
 * @param {*} id id
 * @param {*} pid 父级id
 */
 export function arrToTree(data, id, pid) {
  let result = [];
  if (!Array.isArray(data)) {
    return result;
  }
  data.forEach((item) => {
    if(item.children){
      delete item.children
    }
  });
  let map = {};
  data.forEach((item) => {
    map[item[id]] = item;
  });
  data.forEach((item) => {
    let parent = map[item[pid]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

/**
 * 多维数据降维为一级数组
 * @param {*} data 原始数组
 * @param {*} id id
 * @param {*} pid 父级id
 */
 export const flatArr = (arr, children) => {
  return arr.reduce((pre, ele) => {
    return pre.concat(Array.isArray(ele[children]) ? [ele,...flatArr(ele[children], children)] : ele);
  }, []);
 }

/**
 * 递归寻找子类的父类
 */
 export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length !== 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id === id) {
          return menu[i]
        } else {
          if (menu[i].children[j].children.length !== 0) {
            return findParent(menu[i].children[j].children, id)
          }
        }
      }
    }
  }
}

/**
 * 递归树结构数据，获取匹配列表对应的属性
 * @param {*} treeData 树结构数据
 * @param {string[],number[]} array 列表数据
 * @param {*} props 属性
 * @return {string[]}
 */

 export const filterTreeData  = (treeData,array,props) => {
  return treeData.map(item => {
    if (array.includes(item[props])){
      let arr = []
      if(item.hasOwnProperty('children')){
        arr = filterTreeData(item.children,array,props)
      }
      return [item.id, ...arr]
    } else{
      if(item.hasOwnProperty('children')){
        return filterTreeData(item.children,array,props)
      }
    }
  })
}



// 表单序列化
export const serialize = data => {
  let list = []
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}
export const getObjType = obj => {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

/**
 * 设置灰度模式
 */
export const toggleGrayMode = status => {
  if (status) {
    document.body.className = document.body.className + ' grayMode'
  } else {
    document.body.className = document.body.className.replace(' grayMode', '')
  }
}

/**
 * 设置主题
 */
export const setTheme = name => {
  document.body.className = name
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen()
  } else {
    reqFullScreen()
  }
}

/**
 * esc监听全屏
 */
export const listenfullscreen = callback => {
  function listen () {
    callback()
  }

  document.addEventListener('fullscreenchange', function () {
    listen()
  })
  document.addEventListener('mozfullscreenchange', function () {
    listen()
  })
  document.addEventListener('webkitfullscreenchange', function () {
    listen()
  })
  document.addEventListener('msfullscreenchange', function () {
    listen()
  })
}

// 是否IE浏览器
export function isIE() {
  const bw = window.navigator.userAgent;
  const compare = (s) => bw.indexOf(s) >= 0;
  const ie11 = (() => "ActiveXObject" in window)();
  return compare("MSIE") || ie11;
}

// 是否手机端
export const isIPhoneMobile = () => {
  var u = navigator.userAgent
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

// 是否移动端
export const isMobile = () => {
  let mobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return mobile!= null
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  )
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen()
  }
}

/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen()
  }
}

/**
 * 获取时区
 * //
 */
 export const getDateGMT = () => {
  var resultTz = "GMT+0800"
  var dt = new Date()
  var strDate = dt.toString()
  var gmtIndex = strDate.indexOf("GMT+") 
  if (gmtIndex != -1) {
    resultTz = strDate.substring(gmtIndex).split(' ')[0]
  }
  return resultTz
}

/**
 * 动态插入css
 */
export const loadStyle = url => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}

/**
 * 动态插入js
 */
 export const loadScript = url => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(script)
}



/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len || 4)
  if (date) random = random + Date.now()
  return random
}

/**
 * 生成随机字符串
 * @param {*} len 长度
 */
 export const randomString = (len=32) => {  
  const t = "ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuvwxyz123456789"
  const a = t.length
  let n = ""
  for (let i = 0; i < len; i++) n += t.charAt(Math.floor(Math.random() * a))
  return n
}

/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = width / 2 - w / 2 + dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' +
    w +
    ', height=' +
    h +
    ', top=' +
    top +
    ', left=' +
    left
  )

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

// 获取身份证号的出生日期
export const getBirthDayByIDCard = (idCard) => {
  var birthday = ''
  if (idCard != null && idCard !== '') {
    if (idCard.length === 15) {
      birthday = '19' + idCard.substr(6, 6)
    } else if (idCard.length === 18) {
      birthday = idCard.substr(6, 8)
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
  }
  return birthday
}

/**
 * 日期格式化
 */
 export function dateFormat(date, format) {
  return moment(date).format(format);
}

/**
 * 字符串判空
 */
 export function isNull(data) {
  return data === undefined || data === '' || data === null
}


/**
 * 升序
 */
export function ascendingOrder(a,b){
  if(a.sort !== undefined &&  a.sort !== null){
    return a.sort - b.sort
  }
	return a-b
}

/**
 * 降序
 */
export function descendOrder(a,b){
  if(a.sort !== undefined &&  a.sort !== null){
    return b.sort - a.sort
  }
	return b-a
}

/**
* Url转为blob/Base64
* @param {String} url - 地址
*/

export function urlToBlobBase64(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.responseType = "blob";
    xhr.onload = function () {
      if (xhr.status == 200) {
        var blob = this.response;
        let oFileReader = new FileReader();
        oFileReader.onloadend = function (e) {
          resolve( { blob, base64: e.target.result });
        };
        oFileReader.readAsDataURL(blob);
      } else {
        reject(new Error("异常"));
      }
    };
    xhr.send();
    xhr.onerror = () => {
      reject(new Error("异常"));
    };
  });
}

/* 多区间判断
* @param area
* @returns {number}   错误类型(0正常 1区间重合 2最小值大于最大值 3区间没有连续)
*/
export function checkIfArrayIntervalOverLap(area) {
  let result = 0
  let areaLength = area.length
  if (areaLength > 0) {
    let maxStartArr = []
    let minEndArr = []
    let minStart1 = 0
    let minStart2 = 0
    let maxEnd1 = 0
    let maxEnd2 = 0
    let secondResult = false
    let seriesNumber = 0
    let newMaxEnd = 0
    for (let i = 0; i < areaLength; i++) {
      minStart1 = area[i][0]
      maxEnd1 = area[i][1]
      secondResult = false
      seriesNumber = 0
      // 判断最小值是否大于最大值
      if (minStart1 > maxEnd1 && maxEnd1 !== 0) {
        result = 2
        break;
      }
      for (let t = 0; t < areaLength; t++) {
        minStart2 = area[t][0]
        maxEnd2 = area[t][1]
        if (i !== t) { // 不与自身比  
          maxStartArr = [minStart1, minStart2];// 开始课时数组
          minEndArr = [maxEnd1, maxEnd2];// 结束课时数组
          newMaxEnd = Number(maxEnd1 + 1);
          // 判断数字是否连续
          if (newMaxEnd === minStart2) {
            seriesNumber = seriesNumber + 1;
          }
          // 判断是否有重合区间
          if (Math.max(...maxStartArr) <= Math.min(...minEndArr)) {
            secondResult = true
            result = 1
            break;
          }
        }
      }
      // 判断是否有重合区间返回结果
      if (secondResult === true) {
        break;
      }
      // 判断区间是否连续
      if (seriesNumber !== 1 && i !== areaLength - 1) {
        result = 3
        break;
      }
      
    }
  }
 
  return result
}

/* 获取页面缓存的参数
* @param route 路由
* @returns {}   
*/
export function getPageQuery(route){
  const pageQuery = Storage.get('pageQuery')
  if(pageQuery[route.name]){
    return pageQuery[route.name]
  }
  return null
}

/* 判断是否数组
* @param variable
* @returns Boolean  
*/
export function isArray(variable) {
  return Array.isArray(variable);
}