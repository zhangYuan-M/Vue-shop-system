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

//  参数列表请求数据, 动态或者静态
export function getParamsList(id, obj) {
  return finalRequest({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: obj
  })
}
// 添加动态或者静态参数
export function addParams(id, obj) {
  return finalRequest({
    url: `categories/${id}/attributes`,
    method: 'post',
    data: obj
  })
}

// 编辑提交的参数请球
export function updateParams(cat_id, prop_id, obj) {
  return finalRequest({
    url: `categories/${cat_id}/attributes/${prop_id}`,
    method: 'put',
    data: obj
  })
}

// 删除动态表单参数
export function deleteFormParams(cat_id, attr_id) {
  return finalRequest({
    url: `categories/${cat_id}/attributes/${attr_id}`,
    method: 'delete',
  })
}