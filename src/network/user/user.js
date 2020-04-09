import {
  finalRequest
} from '../index.js'

// 1.获取用户列表展示数据, 和查询用户列表数据
export function getUsersData(queryInfo) {
  return finalRequest({
    url: 'users',
    method: 'get',
    params: queryInfo
  })
}

// 2更新用户列表的数据
export function userStateChanged(uId, type) {
  return finalRequest({
    url: `users/${uId}/state/${type}`,
    method: 'put'
  })
}

// 3，添加用户数据
export function addUserData(obj) {
  return finalRequest({
    url: 'users',
    method: 'post',
    data: obj
  })
}

// 4,更新用户数据
export function updateUserData(id, obj) {
  return finalRequest({
    url: `users/${id}`,
    method: 'put',
    data: obj
  })
}

// 5.删除单个用户数据
export function deleteUserById(id) {
  return finalRequest({
    url: 'users/' + id,
    method: 'delete'
  })
}
/*
 * 踩坑集合
 */
// 踩过的坑：
//在使用axios时，注意到配置选项中包含params和data两者，以为他们是相同的，实则不然。
//因为params是添加到url的请求字符串中的，用于get请求。
//而data是添加到请求体（body）中的， 用于post请求。

// put 请求的参数好像 data 可以, params虽然不会报错但是携带参数是错误的