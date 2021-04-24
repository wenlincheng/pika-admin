import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 设置令牌
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(response.status)
    // HTTP Status
    if (response.status !== 200) {
      if (res.code === 401) {
        Message({
          message: '无权限访问',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: res.msg || '系统错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else if (response.status === 503) {
      Message({
        message: '服务未就绪',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      // 判断自定义的错误码
      // 重新登录
      if (res.code === 20403 || res.code === 20406 || res.code === 20407 || res.code === 20408) {
        // to re-login
        MessageBox.confirm('登录已注销，可以取消以保留在该页面上，或者再次登录', '登录失效', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.code !== 200) {
        Message({
          message: res.msg || '系统错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return res
    }
  },
  error => {
    Message({
      message: '系统错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
