import request from '@/utils/request'

export function queryGateway(data) {
  data.orders = data.order
  return request({
    url: 'pika-upms/gateway/page',
    method: 'get',
    params: data
  })
}

export function getGateway(id) {
  return request({
    url: '/pika-upms/gateway/' + id,
    method: 'get'
  })
}

export function addGateway(data) {
  data.orders = data.order
  return request({
    url: 'pika-upms/gateway',
    method: 'post',
    data
  })
}

export function deleteGateway(id) {
  return request({
    url: 'pika-upms/gateway/' + id,
    method: 'delete'
  })
}

export function updateGateway(data) {
  data.orders = data.order
  return request({
    url: 'pika-upms/gateway',
    method: 'put',
    data
  })
}

export function refreshGateway() {
  return request({
    url: 'pika-upms/gateway/refresh',
    method: 'post'
  })
}
