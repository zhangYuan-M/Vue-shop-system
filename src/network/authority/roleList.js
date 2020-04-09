import {
  finalRequest
} from '../index.js'

// 获取角色列表数据
export function getRolesListData() {
  return finalRequest({
    url: 'roles',
    method: 'get'
  })
}

// 提交编辑角色的数据
export function updatedEditDate(id, obj) {
  return finalRequest({
    url: 'roles/' + id,
    method: 'put',
    data: obj
  })
}

// 根据ID删除一个角色数据
export function deleteRoleById(id) {
  return finalRequest({
    url: 'roles/' + id,
    method: 'delete'
  })
}

// 根据角色id和权限id删除指定角色的指定权限
export function deleteRoleByDoubleId(roleId, rightId) {
  return finalRequest({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 更新分配权限数据
export function updatedRoleLevels(roleId, str) {
  return finalRequest({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids: str
    }
  })
}

// 获取树形控件的数据
export function getRightsData(type) {
  return finalRequest({
    url: 'rights/' + type,
    method: 'get'
  })
}

// 添加一个角色
export function addRole(obj) {
  return finalRequest({
    url: 'roles',
    method: 'post',
    data: obj
  })
}