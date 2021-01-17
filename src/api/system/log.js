import request from '@/utils/request'

// 列表
export function queryLog(data) {
  return request({
    url: '/pika-upms/log/page',
    method: 'get',
    params: data
  })
}

// 查看
export function getLog(id) {
  return request({
    url: '/pika-upms/log/' + id,
    method: 'get'
  })
}
