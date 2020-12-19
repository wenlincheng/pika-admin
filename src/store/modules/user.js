import { login, logout, getUserInfo } from '@/api/system/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
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
  }
}

const actions = {
  // 用户登录存储令牌
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 登录
      login({ username: username.trim(), password: password }).then(response => {
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
        const { data } = response
        if (!data) {
          reject('权限不足,无法访问')
        }
        const { name, avatar, description, roles } = data

        // 角色必须是非空数组
        // if (!roleIds || roleIds.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        commit('SET_ROLES', ['admin'])
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', description)
        data.roles = ['admin']
        resolve(data)
      }).catch(error => {
        reject(error)
      })
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
