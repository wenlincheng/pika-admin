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

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        :loading="downloadLoading"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="100px" align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="角色代码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="角色名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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

      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button type="primary" size="mini" @click="handleAuth(scope.row.id)">
            授权
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

    <!--添加或编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 80%; margin-left:30px;"
      >
        <el-form-item label="角色代码" prop="code">
          <el-input v-model="temp.code" placeholder="请输入角色代码" />
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="temp.description" type="textarea" :rows="2" placeholder="请输入描述内容" />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>

    <!--授权页面-->
    <el-dialog title="授权" :visible.sync="authFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="width: 90%; margin-left:40px;"
      >
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="temp.resourceIds" @change="handleCheckedChange">
          <span v-for="(resource) in resources">
            <el-checkbox :key="resource.id" :label="resource.id" style="height: 15px;margin: 10px">
              {{ resource.name }}
            </el-checkbox>
          </span>
        </el-checkbox-group>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="authFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateAuth">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryRole, createRole, updateRole, deleteRole, getRole } from '@/api/organization/role'
import { queryAllResource } from '@/api/organization/resource'
import waves from '@/directive/waves' // 水波纹指令

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
      temp: {
        code: '',
        name: '',
        description: '',
        resourceIds: []
      },
      downloadLoading: false
    }
  },
  created() {
    this.queryRole()
  },
  methods: {
    /**
       * 查询列表
       */
    queryRole() {
      this.listLoading = true
      queryRole(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.queryRole()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryRole()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryRole()
    },

    /**
       * 弹出新增角色对话框
       */
    handleCreate() {
      this.temp = {}
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
          createRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.queryRole()
          })
        }
      })
    },
    /**
       * 点击授权按钮
       */
    handleAuth(id) {
      this.temp.id = id
      this.temp.resourceIds = []
      // 查询所有资源
      queryAllResource().then(response => {
        this.resources = response.data
        this.authFormVisible = true
      })
      // 查询角色详细信息，拿到已授权的角色id
      getRole(id).then(response => {
        this.temp.resourceIds = response.data.resourceIds
        this.handleCheckedChange(this.temp.resourceIds)
      })
    },
    /**
       * 全选权限选项
       */
    handleCheckAllChange(val) {
      const ids = []
      for (let i = 0; i < this.resources.length; i++) {
        ids.push(this.resources[i].id)
      }
      this.temp.resourceIds = val ? ids : []
      this.isIndeterminate = false
    },
    /**
       * 选中选项
       */
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.resources.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.resources.length
    },
    /**
       * 更新权限
       */
    updateAuth() {
      const temp = {
        id: this.temp.id,
        resourceIds: this.temp.resourceIds
      }
      console.log(temp)
      updateRole(temp).then(() => {
        this.authFormVisible = false
        this.$notify({
          title: '权限编辑成功',
          message: '权限编辑成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    /**
       * 点击更新按钮
       */
    handleUpdate(row) {
      this.temp = Object.assign({}, row)// copy obj
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
          updateRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.queryRole()
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
        deleteRole(id).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryRole()
        })
      })
    },

    handleDownload() {
      console.log('download')
    }
  }
}
</script>

