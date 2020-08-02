import request from '@/utils/request'

export function queryRole(data) {
  return request({
    url: '/ses-user/role/list',
    method: 'get',
    params: data
  })
}

export function getRole(id) {
  return request({
    url: '/ses-user/role/' + id,
    method: 'get'
  })
}

export function getAllRoles() {
  return request({
    url: '/ses-user/role/all/1',
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/ses-user/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/ses-user/role/' + data.id,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/ses-user/role/' + id,
    method: 'delete'
  })
}

