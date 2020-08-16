import request from '@/utils/request'

export function queryResource(data) {
  return request({
    url: '/pika-upms/resource/list',
    method: 'get',
    params: data
  })
}

export function getResource(id) {
  return request({
    url: '/pika-upms/resource/' + { id },
    method: 'get'
  })
}

export function queryAllResource() {
  return request({
    url: '/pika-upms/resource/all',
    method: 'get'
  })
}

export function createResource(data) {
  return request({
    url: '/pika-upms/resource',
    method: 'post',
    data
  })
}

export function updateResource(data) {
  return request({
    url: '/pika-upms/resource/' + data.id,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return request({
    url: '/pika-upms/resource/' + id,
    method: 'delete'
  })
}

