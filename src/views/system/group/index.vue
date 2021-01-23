<template>
  <div class="app-container">
<!--    <div class="filter-container">-->
<!--      <el-button-group>-->
<!--        <el-button type="primary" icon="plus" @click="handlerAdd">添加</el-button>-->
<!--        <el-button type="primary" icon="edit" @click="handlerUpdate">编辑</el-button>-->
<!--        <el-button type="primary" icon="delete" @click="handlerDelete">删除</el-button>-->
<!--      </el-button-group>-->
<!--    </div>-->
    <el-row>
      <el-col :span="5" style="padding-right:15px;">
        <el-card>
          <el-tree
            class="filter-tree"
            node-key="id"
            highlight-current
            lazy
            :load="loadNode"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="getNodeData"
          />
        </el-card>
      </el-col>
      <el-col :span="19">
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
      </el-col>
    </el-row>

    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
      <el-form ref="form" :label-position="labelPosition" label-width="100px" :model="form">
        <el-form-item label="节点编号" prop="id">
          <el-input v-model="form.id" :disabled="formRead" placeholder="节点编号" />
        </el-form-item>
        <el-form-item label="父级节点" prop="parentId">
          <el-input v-model="form.parentId" :disabled="formRead" placeholder="请选择父级节点" />
        </el-form-item>
        <el-form-item label="组名称" prop="name">
          <el-input v-model="form.name" :disabled="formRead" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="form.description" :disabled="formRead" />
        </el-form-item>
        <el-form-item label="创建时间" prop="description">
          <el-input v-model="form.createdTime" disabled />
        </el-form-item>
        <el-form-item label="创建人" prop="description">
          <el-input v-model="form.createdBy" disabled />
        </el-form-item>
        <el-form-item label="修改时间" prop="description">
          <el-input v-model="form.updatedTime" disabled />
        </el-form-item>
        <el-form-item label="修改人" prop="description">
          <el-input v-model="form.updatedBy" disabled />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveGroup">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchGroupByParentId, getGroup } from '@/api/system/group'
import { queryUser, getUser, createUser, updateUser, deleteUser } from '@/api/system/user'

export default {
  name: 'GroupManagement',
  filters: {},
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
      dialogStatus: 'create',
      dialogFormVisible: false,
      // 当前选中的节点id
      currentId: '',
      formEdit: false,
      formRead: !this.formEdit,
      formStatus: '',
      // 树数据
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      form: {
        parentId: 0,
        id: 0,
        name: '',
        description: '',
        createdTime: '',
        createdBy: '',
        updatedTime: '',
        updatedBy: ''
      }
    }
  },
  created() {
    this.fetchGroupByParentId(0)
    this.queryEmployee()
    this.resetForm()
  },
  methods: {
    /**
       * 根据父节点id，查询子节点
       * @param parentId 父节点id
       */
    fetchGroupByParentId(parentId) {
      fetchGroupByParentId(parentId).then(response => {
        this.treeData = response.data
      })
    },
    /**
       * 保存组
       */
    saveGroup() {

    },
    handlerAdd() {
      this.formEdit = true
    },
    handlerUpdate() {
      this.formEdit = true
      this.formRead = false
    },
    handlerDelete() {
    },
    onCancel() {
    },
    /**
       * 加载树数据
       * @param node 树节点
       * @param resolve
       *
       */
    loadNode(node, resolve) {
      fetchGroupByParentId(node.data.id).then(response => {
        resolve(response.data)
      })
    },
    /**
       * 获取节点数据
       * @param data
       */
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getGroup(data.id).then(response => {
        this.form = response.data
      })
      this.currentId = data.id
    },
    /**
       * 搜索node节点
       */
    filterNode() {
    },
    /**
     * 用户列表
     */
    queryEmployee() {
      this.listLoading = true
      queryUser(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
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
    }
  }
}
</script>
