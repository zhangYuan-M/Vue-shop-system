import {
  finalRequest
} from '../index.js'

// 获取商品分类全部数据
export function getCategoryData(obj) {
  return finalRequest({
    url: 'categories',
    method: 'get',
    params: obj
  })
}

//  参数列表请求数据 动态或者静态
export function getParamsList(id, obj) {
  return finalRequest({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: obj
  })
}
// 添加一个商品
export function addShopItem(obj) {
  return finalRequest({
    url: 'goods',
    method: 'post',
    data: obj
  })
}