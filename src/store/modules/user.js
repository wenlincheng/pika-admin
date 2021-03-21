import { login, logout, getUserInfo, updatePassword } from '@/api/system/login'
// import { queryMenuRouter } from '@/api/system/menu'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import store from '..'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  routers: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  }
}

const actions = {
  // 用户登录存储令牌
  login({ commit }, userInfo) {
    const { username, password, validateCode, uuid } = userInfo
    return new Promise((resolve, reject) => {
      // 登录
      login({ username: username.trim(), password: password, validateCode: validateCode.trim(), uuid: uuid }).then(response => {
        commit('SET_TOKEN', response.data.accessToken)
        setToken(response.data.accessToken)
        resolve()
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  },

  // 获取用户信息并存储
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 查询用户信息
      getUserInfo(state.token).then(response => {
        console.log(response)
        const { data } = response
        if (!data) {
          reject('权限不足,无法访问')
        }
        const { name, avatar, description, roleIds } = data

        // 角色必须是非空数组
        if (!roleIds || roleIds.length <= 0) {
          reject('权限不足,无法访问')
        }
        commit('SET_ROLES', roleIds)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', description)
        data.roles = roleIds
        resolve(data)
      }).catch(error => {
        reject(error)
      })
      // // 获取动态路由
      // queryMenuRouter().then(response => {
      //   commit('SET_ROUTERS', response.data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },
  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 修改密码
  updatePassword({ commit }, updatePasswordForm) {
    const { oldPassword, password, confirmPassword } = updatePasswordForm
    console.log(updatePasswordForm)
    return new Promise((resolve, reject) => {
      updatePassword({ oldPassword: oldPassword, password: password, confirmPassword: confirmPassword }).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除 token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // 动态修改权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // 根据角色生成可访问的路由
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // 动态添加可访问的路由
      router.addRoutes(accessRoutes)

      // 重置访问的视图和缓存的视图
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
