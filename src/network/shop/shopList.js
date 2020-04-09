import {
  finalRequest
} from '../index.js'

export function getGoodsInfo(obj) {
  return finalRequest({
    url: `goods`,
    method: 'get',
    params: obj
  })
}
export function deleteShopById(goodId) {
  return finalRequest({
    url: 'goods/' + goodId,
    method: 'delete'
  })
}