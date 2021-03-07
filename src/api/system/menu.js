import request from '@/utils/request'

export function queryMenuListByPid(parentId) {
  return request({
    url: '/pika-upms/menu/list/' + parentId,
    method: 'get'
  })
}

export function getMenu(id) {
  return request({
    url: '/pika-upms/menu/' + id,
    method: 'get'
  })
}

export function queryAllMenu() {
  return request({
    url: '/pika-upms/menu/list',
    method: 'get'
  })
}

export function createMenu(data) {
  console.log(111)
  console.log(data)
  return request({
    url: '/pika-upms/menu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/pika-upms/menu',
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: '/pika-upms/menu/' + id,
    method: 'delete'
  })
}

export function queryMenuRouter() {
  return request({
    url: '/pika-upms/menu/router',
    method: 'get'
  })
}
