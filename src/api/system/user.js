import request from '@/utils/request'

// 列表
export function queryUser(data) {
  return request({
    url: '/ses-user/user/list',
    method: 'get',
    params: data
  })
}

// 详情
export function getUser(id) {
  return request({
    url: '/ses-user/user/' + id,
    method: 'get'
  })
}

// 创建
export function createUser(data) {
  return request({
    url: '/ses-user/user',
    method: 'post',
    data: data
  })
}

// 修改
export function updateUser(data) {
  return request({
    url: '/ses-user/user/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除
export function deleteUser(id) {
  return request({
    url: '/ses-user/user/' + id,
    method: 'delete'
  })
}
