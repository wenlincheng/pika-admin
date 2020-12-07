import request from '@/utils/request'

export function queryRole(data) {
  return request({
    url: '/pika-upms/role/page',
    method: 'get',
    params: data
  })
}

export function getRole(id) {
  return request({
    url: '/pika-upms/role/' + id,
    method: 'get'
  })
}

export function getAllRoles() {
  return request({
    url: '/pika-upms/role/all/1',
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/pika-upms/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/pika-upms/role/',
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/pika-upms/role/' + id,
    method: 'delete'
  })
}

