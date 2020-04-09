import {
  finalRequest
} from '../index.js'

// 1.请求登录权限的数据
export function getLoginData(obj) {
  return finalRequest({
    url: '/login',
    method: 'post',
    data: obj
  })
}