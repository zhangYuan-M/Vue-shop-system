import {
  finalRequest
} from '../index.js'

// 1.获取权限列表全部数据，
// 和roleList 列表的方法是同一个
export function getRightsData(type) {
  return finalRequest({
    url: 'rights/' + type,
    method: 'get'
  })
}