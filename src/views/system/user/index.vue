<template>
  <div class="app-container">
    <div class="filter-container">

      <!--查询条件-->
      <el-input
        v-model="listQuery.username"
        style="width: 200px;"
        class="filter-item"
        placeholder="用户名"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        placeholder="姓名"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.mobile"
        style="width: 200px;"
        class="filter-item"
        placeholder="手机号"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        clearable
        style="width: 150px"
        class="filter-item"
        placeholder="用户状态"
      >
        <el-option
          v-for="item in userStatus"
          :key="item.key"
          :label="item.key"
          :value="item.value"
        />
      </el-select>

      <!--动作按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        :loading="downloadLoading"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <!--列表-->
    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="100" align="center" label="ID" >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.gender | genderFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="角色">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.roleNames" style="margin: 2px;" type="info">{{ item }}</el-tag>
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row.id)">
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
        :model="dataForm"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 80%; margin-left:60px;"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dataForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="dataForm.mobile" placeholder="请输入用户手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="dataForm.password"
            :disabled="dialogStatus==='edit'"
            placeholder="请输入用户密码"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
            v-model="dataForm.roleIds"
            multiple
            clearable
            style="width: 100%;"
            placeholder="请选择"
            @visible-change="getRoles"
          >
            <el-option
              v-for="item in roleList"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="用户详情" prop="description">
          <el-input
            v-model="dataForm.description"
            :rows="5"
            type="textarea"
            placeholder="请输入用户简介"
          />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-if="dialogStatus==='edit'" type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryUser, getUser, createUser, updateUser, deleteUser } from '@/api/system/user'
import { getAllRoles } from '@/api/system/role'

import waves from '@/directive/waves'

export default {
  name: 'UserManagement',
  // 水波文效果
  directives: {
    waves
  },
  filters: {
    // 用户状态标签样式
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
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
    },
    genderFilter(gender) {
      const genderMap = {
        0: '未知',
        1: '男',
        2: '女'
      }
      return genderMap[gender]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      downloadLoading: false,
      // 查询参数
      listQuery: {
        current: 1,
        size: 10
      },
      // 用户状态
      userStatus: [
        { key: '激活', value: 1 },
        { key: '锁定', value: 0 }],
      roleList: [],
      dialogStatus: 'create',
      dialogFormVisible: false,
      // 表单校验规则
      rules: {
        username: [
          { required: true, message: '用户名必填', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '用户手机号不能为空', trigger: 'blur' }],
        password: [
          { required: this.dialogStatus === 'create', message: '用户密码为必填', trigger: 'blur' },
          { min: 5, max: 20, message: '用户密码长度在5到20个字符', trigger: 'blur' }
        ]
      },
      // 创建或修改用户临时对象
      dataForm: {}
    }
  },
  // 页面加载完成后显示列表页
  created() {
    this.queryUser()
    this.resetForm()
  },
  methods: {
    /**
       * 用户列表
       */
    queryUser() {
      this.listLoading = true
      queryUser(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /**
       * 角色列表
       */
    getRoles(isShow) {
      if (isShow) {
        getAllRoles().then(response => {
          this.roleList = response.data
        })
      }
    },
    // 查询过滤器
    handleFilter() {
      this.listQuery.current = 1
      this.queryUser()
    },
    // 重置搜索条件
    handleRefresh() {
      this.listQuery = {
        current: 1,
        size: 10
      }
      this.queryUser()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryUser()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryUser()
    },
    /**
       * 重置添加表单
       */
    resetForm() {
      this.dataForm = {
        username: '',
        avatar: '',
        status: 0,
        name: '',
        password: '',
        roleIds: [],
        description: '',
        mobile: ''
      }
    },
    /**
       * 弹出创建用户表单
       */
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetForm()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 创建用户
       */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.dataForm.roleIds = []
            this.queryUser()
          })
        }
      })
    },
    /**
       * 弹出修改用户表单
       */
    handleUpdate(id) {
      this.listLoading = true
      getUser(id).then(response => {
        this.dataForm = response.data
        this.getRoles(1)
        this.listLoading = false
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 修改用户信息
       */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.dataForm.roleIds = []
            this.queryUser()
          })
        }
      })
    },
    /**
       * 删除用户
       */
    deleteData(id) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryUser()
        })
      })
    },
    /**
       * 重置用户密码
       */
    resetPass(id) {

    },
    /**
       * 导出列表
       */
    handleDownload() {
      console.log('download')
    }
  }
}
</script>

