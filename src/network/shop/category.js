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

// 提价添加分类数据
export function addCategoryData(obj) {
  return finalRequest({
    url: 'categories',
    method: 'post',
    data: obj
  })
}

// 编辑提价的分类名称
export function updatedShopName(cat_id, obj) {
  return finalRequest({
    url: `categories/${cat_id}`,
    method: 'put',
    data: obj
  })
}

// 根据id删除一行数据
export function deleteRowById(id) {
  return finalRequest({
    url: 'categories/' + id,
    method: 'delete'
  })
}