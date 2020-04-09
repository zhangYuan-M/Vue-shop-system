import {
  finalRequest
} from '../index.js'

export function getOrdersData(obj) {
  return finalRequest({
    url: 'orders',
    method: 'get',
    params: obj
  })
}

export function getExpressData(id) {
  return finalRequest({
    url: `/kuaidi/${id}`,
    method: 'get'
  })
}