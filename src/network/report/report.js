import {
  finalRequest
} from '../index.js'

export function getReportData() {
  return finalRequest({
    url: 'reports/type/1',
    method: 'get'
  })
}