import request from '@/utils/request'

export function queryGateway(data) {
  data.orders = data.order
  return request({
    url: 'pika-gateway-admin/gateway/route/list',
    method: 'get',
    params: data
  })
}

export function addGateway(data) {
  data.orders = data.order
  return request({
    url: 'pika-gateway-admin/gateway/route',
    method: 'post',
    data
  })
}

export function deleteGateway(id) {
  return request({
    url: 'pika-gateway-admin/gateway/route/' + id,
    method: 'delete'
  })
}

export function updateGateway(data) {
  data.orders = data.order
  return request({
    url: 'pika-gateway-admin/gateway/route/' + data.id,
    method: 'put',
    data
  })
}

export function refreshGateway() {
  return request({
    url: 'pika-gateway-admin/gateway/route/overload',
    method: 'post'
  })
}
