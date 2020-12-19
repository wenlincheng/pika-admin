import request from '@/utils/request'

// 用户登录
export function login(data) {
  const loginParams = {
    username: data.username,
    password: data.password,
    grant_type: 'password',
    scope: 'read'
  }
  return request({
    url: '/pika-auth/login/v1',
    method: 'post',
    data: loginParams
  })
}

// 用户信息
export function getUserInfo() {
  return request({
    url: '/pika-auth/auth/token/user/info',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/pika-auth/auth/token/logout',
    method: 'get'
  })
}
