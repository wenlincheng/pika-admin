import request from '@/utils/request'

// 用户登录
export function login(data) {
  const form = {
    username: data.username,
    password: data.password,
    grant_type: 'password',
    scope: 'read'
  }
  return request({
    url: '/ses-oauth/oauth/login/v1',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ='
    },
    method: 'post',
    params: form
  })
}

// 用户信息
export function getInfo(token) {
  return request({
    url: '/organization/user',
    method: 'get',
    params: { uniqueId: 'admin' }
  })
}

// 退出登录
export function logout() {
  return Promise.resolve({
    code: "000000",
    mesg: "成功",
    time: new Date(),
  })
}
