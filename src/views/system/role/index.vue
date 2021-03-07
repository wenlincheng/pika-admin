<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        style="width: 200px;"
        class="filter-item"
        placeholder="角色代码"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        placeholder="角色名"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        clearable
        style="width: 150px"
        class="filter-item"
        placeholder="角色状态"
      >
        <el-option
          v-for="item in userStatus"
          :key="item.key"
          :label="item.key"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <div style="margin-top: 20px">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-waves class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
      </div>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column width="150px" align="center" label="角色名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="角色代码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="关联用户数">
        <template slot-scope="scope">
          <span>{{ scope.row.relateUserCount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="80px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>

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

      <el-table-column fixed="right" header-align="center" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="deleteRole(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页工具条-->
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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
import { queryRole, createRole, updateRole, deleteRole } from '@/api/system/role'
import waves from '@/directive/waves'

export default {
  name: 'RoleManagement',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        0: '锁定',
        1: '激活'
      }
      return statusMap[status]
    }
  },
  components: {
    AddOrUpdate
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10
      },
      userStatus: [
        { key: '激活', value: 1 },
        { key: '锁定', value: 0 }
      ],
      dialogStatus: 'create',
      dialogFormVisible: false,
      authFormVisible: false,
      rules: {
        code: [{ required: true, message: '角色代码必填', trigger: 'blur' }],
        name: [{ required: true, message: '角色名必填', trigger: 'blur' }]
      },
      checkAll: false,
      resources: [],
      isIndeterminate: true,
      dataForm: {
        code: '',
        name: '',
        description: '',
        resourceIds: []
      },
      downloadLoading: false,
      addOrUpdateVisible: false,
      menuList: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    /**
       * 查询列表
       */
    getDataList() {
      this.listLoading = true
      queryRole(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getDataList()
    },
    // 重置搜索条件
    handleRefresh() {
      this.listQuery = {
        current: 1,
        size: 10
      }
      this.getDataList()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getDataList()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },

    /**
       * 弹出新增角色对话框
       */
    handleCreate() {
      this.dataForm = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 新增角色
       */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.dataForm).then((res) => {
            this.dialogFormVisible = false
            if (res === 200) {
              this.$notify({
                title: '创建成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getDataList()
            }
          })
        }
      })
    },
    /**
       * 点击更新按钮
       */
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)// copy obj
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 更新角色
       */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateRole(this.dataForm).then((res) => {
            this.dialogFormVisible = false
            if (res === 200) {
              this.$notify({
                title: '编辑成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
              this.getDataList()
            }
          })
        }
      })
    },
    /**
       * 删除角色
       * @param id
       */
    deleteRole(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(id).then((res) => {
          if (res.code === 200) {
            this.$notify({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getDataList()
          }
        })
      })
    },

    handleDownload() {
      console.log('download')
    }
  }
}
</script>

