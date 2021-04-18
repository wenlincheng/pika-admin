import request from '@/utils/request'

export function queryDict(data) {
  data.orders = data.order
  return request({
    url: 'pika-upms/dict/page',
    method: 'get',
    params: data
  })
}

export function getDict(id) {
  return request({
    url: '/pika-upms/dict/' + id,
    method: 'get'
  })
}

export function addDict(data) {
  data.orders = data.order
  return request({
    url: 'pika-upms/dict',
    method: 'post',
    data
  })
}

export function deleteDict(id) {
  return request({
    url: 'pika-upms/dict/' + id,
    method: 'delete'
  })
}

export function updateDict(data) {
  data.orders = data.order
  return request({
    url: 'pika-upms/dict',
    method: 'put',
    data
  })
}

export function refreshDict() {
  return request({
    url: 'pika-upms/dict/refresh',
    method: 'post'
  })
}
