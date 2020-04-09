// 2.格式化时间戳
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }

  function padLeftZero(str) {
    return ('00' + str).substr(str.length)
  }
  return fmt
}

// 现在我要把obj字面量创建里的属性深拷贝
export function deepClone(obj) {
  // 根据类型制造一个新的数组或对象 => 指向一个新的空间
  // 由于数组的typeof也是'object',所以用Array.isArray(obj)
  var new_obj = Array.isArray(obj) ? [] : {};
  // 首先判断obj的类型
  // 普通类型
  if (typeof obj != 'object') {
    // 这里不能直接返回obj,不然就是浅拷贝的性质
    return new_obj = obj
  }
  //引用类型
  //数组
  if (obj instanceof Array) {
    for (i = 0; i < obj.length; i++) {
      new_obj[i] = obj[i]
      if (typeof new_obj[i] == 'object') {
        deepClone(new_obj[i])
      }
    }
  } else { //对象
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 对象中的数组和对象
        if (typeof obj[key] == 'object') {
          new_obj[key] = deepClone(obj[key])
        } else { //对象中没有引用类型
          new_obj[key] = obj[key]
        }
      }
    }
  }
  return new_obj
}