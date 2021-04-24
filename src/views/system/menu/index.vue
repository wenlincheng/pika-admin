<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <el-table v-loading.body="listLoading" :data="list" border style="width: 100%;" row-key="id" lazy :load="lazyLoad" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        header-align="center"
        tree-key="id"
        width="150"
        label="名称"
      />
      <el-table-column
        prop="icon"
        header-align="center"
        align="center"
        label="图标"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ||''" />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.type === 0"
            size="small"
          >目录
          </el-tag>
          <el-tag
            v-else-if="scope.row.type === 1"
            size="small"
            type="success"
          >菜单
          </el-tag>
          <el-tag
            v-else-if="scope.row.type === 2"
            size="small"
            type="info"
          >按钮
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="uri"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="URI"
      />
      <el-table-column
        prop="method"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="请求方法"
      />
      <el-table-column
        prop="code"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
      />
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="排序号"
      />
      <el-table-column width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addChildren(scope.row.id)">新增子菜单</el-button>
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script>
import AddOrUpdate from './form'
import { treeDataTranslate } from '@/utils'
import { deleteMenu, queryMenuListByPid } from '@/api/system/menu'

import waves from '@/directive/waves'

export default {
  name: 'MenuManagement',
  // 水波文效果
  directives: {
    waves
  },
  filters: {
  },
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {},
      addOrUpdateVisible: false,
      list: [],
      total: 0,
      listLoading: true,
      dialogStatus: 'create',
      dialogFormVisible: false,
      authFormVisible: false,
      checkAll: false,
      isIndeterminate: true,
      downloadLoading: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.listLoading = true
      queryMenuListByPid(0).then(response => {
        this.list = treeDataTranslate(response.data, 'id')
        this.listLoading = false
      })
    },
    lazyLoad(tree, treeNode, resolve) {
      queryMenuListByPid(tree.id).then(response => {
        resolve(treeDataTranslate(response.data, 'id'))
      })
    },
    // 刷新
    handleRefresh() {
      this.getDataList()
    },
    // 添加子菜单
    addChildren(parentId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.initAddChildren(parentId)
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`确定进行【删除】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(id).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      })
    }
  }
}
</script>
