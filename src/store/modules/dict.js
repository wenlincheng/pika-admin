import { getDictTypeList } from '@/api/system/dict'

const state = {
  dictList: {}
}

const mutations = {
  SET_DICT_LIST: (state, dictList) => {
    state.dictList = dictList
  }
}

const actions = {
  getDictList({ commit }) {
    getDictTypeList().then(({ data }) => {

      const dictMap = {}
      data.forEach(dictType => {
        const dictValues = []
        dictType.dictValues.forEach(dictValueVO => {
          const dictValue = {}
          dictValue['key'] = dictValueVO.name
          dictValue['value'] = dictValueVO.value
          dictValues.push(dictValue)
        })
        dictMap[dictType.code] = dictValues
      })
      commit('SET_DICT_LIST', dictMap)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
