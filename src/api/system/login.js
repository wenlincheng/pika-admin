import request from '@/utils/request'

// 用户登录
export function login(data) {
  const loginParams = {
    username: data.username,
    password: data.password,
    validateCode: data.validateCode,
    uuid: data.uuid,
    grant_type: 'password',
    scope: 'read'
  }
  return request({
    url: '/pika-auth/login/v1',
    method: 'post',
    data: loginParams
  })
}

// 获取验证码
export function getCode() {
  return request({
    url: '/pika-auth/auth/code',
    method: 'get'
  })
}

// 修改密码
export function updatePassword(data) {
  const updatePasswordParams = {
    oldPassword: data.oldPassword,
    password: data.password,
    confirmPassword: data.confirmPassword,
    grant_type: 'password',
    scope: 'read'
  }
  return request({
    url: '/pika-upms/user/password',
    method: 'put',
    data: updatePasswordParams
  })
}

// 用户信息
export function getUserInfo() {
  return request({
    url: '/pika-upms/user/info',
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
