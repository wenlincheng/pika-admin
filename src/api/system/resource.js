import request from '@/utils/request'

export function queryResource(data) {
  return request({
    url: '/ses-user/resource/list',
    method: 'get',
    params: data
  })
}

export function getResource(id) {
  return request({
    url: '/ses-user/resource/' + { id },
    method: 'get'
  })
}

export function queryAllResource() {
  return request({
    url: '/ses-user/resource/all',
    method: 'get'
  })
}

export function createResource(data) {
  return request({
    url: '/ses-user/resource',
    method: 'post',
    data
  })
}

export function updateResource(data) {
  return request({
    url: '/ses-user/resource/' + data.id,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return request({
    url: '/ses-user/resource/' + id,
    method: 'delete'
  })
}

