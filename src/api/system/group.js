import request from '@/utils/request'

export function fetchGroupByParentId(id) {
  if (id === 'undefined') {
    id = 0
  }

  return request({
    url: '/pika-upms/group/parent/' + id,
    method: 'get'
  })
}

export function getGroup(id) {
  return request({
    url: '/pika-upms/group/' + id,
    method: 'get'
  })
}

export function createGroup(data) {
  return request({
    url: '/pika-upms/group',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: '/pika-upms/group/' + data.id,
    method: 'put',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: '/pika-upms/group/' + id,
    method: 'delete'
  })
}

