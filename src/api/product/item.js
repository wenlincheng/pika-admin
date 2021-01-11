import request from '@/utils/request'

export function queryPageList(data) {
  return request({
    url: '/pika-item/item/page',
    method: 'get',
    params: data
  })
}

export function getItemStepOne(id) {
  return request({
    url: '/pika-item/item/step1/' + id,
    method: 'get'
  })
}

export function getItemStepTwo(id) {
  return request({
    url: '/pika-item/item/step2/' + id,
    method: 'get'
  })
}

export function createItemStepOne(data) {
  console.log(data)
  return request({
    url: '/pika-item/item/step1',
    method: 'post',
    data
  })
}

export function createItemStepTwo(data) {
  console.log(data)
  return request({
    url: '/pika-item/item/step2',
    method: 'post',
    data
  })
}

export function updateItemStepOne(data) {
  return request({
    url: '/pika-item/item/step1',
    method: 'put',
    data
  })
}

export function updateItemStepTwo(data) {
  return request({
    url: '/pika-item/item/step2',
    method: 'put',
    data
  })
}

export function deleteItem(id) {
  return request({
    url: '/pika-item/item/' + id,
    method: 'delete'
  })
}
