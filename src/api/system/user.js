import request from '@/utils/request'

// 列表
export function queryUser(data) {
  return request({
    url: '/pika-upms/user/page',
    method: 'get',
    params: data
  })
}

// 查看
export function getUser(id) {
  return request({
    url: '/pika-upms/user/' + id,
    method: 'get'
  })
}

// 创建
export function createUser(data) {
  return request({
    url: '/pika-upms/user',
    method: 'post',
    data: data
  })
}

// 修改
export function updateUser(data) {
  return request({
    url: '/pika-upms/user',
    method: 'put',
    data: data
  })
}

// 删除
export function deleteUser(id) {
  return request({
    url: '/pika-upms/user/' + id,
    method: 'delete'
  })
}
