import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const svgFiles = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
const iconList = svgFiles.keys().map(item => svgFiles(item))
requireAll(svgFiles)

export default {
  // 获取图标icon-(*).svg名称列表, 例如[shouye, xitong, zhedie, ...]
  getNameList() {
    return iconList.map(item => item.default.id.replace('icon-', ''))
  }
}
