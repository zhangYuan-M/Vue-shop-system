import {
  finalRequest
} from '../index.js'

// 1.获取左侧菜单全部数据
export function getMenuList() {
  return finalRequest({
    url: '/menus',
    method: 'get'
  })
}