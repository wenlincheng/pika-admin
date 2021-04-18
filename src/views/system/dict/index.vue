<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        style="width: 200px;"
        class="filter-item"
        placeholder="字典名称"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        clearable
        style="width: 150px"
        class="filter-item"
        placeholder="请选择路由类型"
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="item in routeType"
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
        type="danger"
        :loading="downloadLoading"
        icon="el-icon-refresh"
        @click="refreshDict"
      >
        发布路由
      </el-button>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column width="120px" align="left" label="路由ID">
        <template slot-scope="scope">
          <span>{{ scope.row.routeId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="left" label="uri路径">
        <template slot-scope="scope">
          <span>{{ scope.row.uri }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="left" label="路由规则配置">
        <template slot-scope="scope">
          <span>
            <li v-for="(predicates, index) in scope.row.predicates" :key="index">
              {{ predicates.name }}
              <ul>
                <li v-for="(args, index) in predicates.args" :key="index">
                  {{ args }}
                </li>
              </ul>
            </li>
          </span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="left" label="过滤配置">
        <template slot-scope="scope">
          <span>
            <li v-for="(filters,index) in scope.row.filters" :key="index">
              {{ filters.name }}
              <ul>
                <li v-for="(args,index) in filters.args" :key="index">
                  {{ args }}
                </li>
              </ul>
            </li>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.seq }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" label="状态">
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
          <el-button type="danger" size="mini" @click="deleteRoute(scope.row.id)">
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
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible" width="65%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 80%; margin-left:30px;"
      >
        <el-form-item label="路由id" prop="routeId">
          <el-input v-model="dataForm.routeId" placeholder="请输入路由id" />
        </el-form-item>

        <el-form-item label="uri路径" prop="uri">
          <el-input v-model="dataForm.uri" placeholder="请输入uri路径,如:lb://或http://" />
        </el-form-item>
        <!-- 路由规则输入框 -->
        <el-form-item
          v-for="(predicates, index) in dataForm.predicates"
          :key="0+index"
          :label="'路由规则【' + (index+1)+'】'"
          :rules="{ required: true, message: '路由规则不能为空', trigger: 'blur'}"
        >

          <el-input
            v-model="predicates.name"
            :prop="'predicates.' + index + '.name'"
            style="width: 40%"
            placeholder="请输入名称，如Path"
          />
          <el-input
            v-model="predicates.args.pattern"
            :prop="'predicates.' + index + '.args.pattern'"
            style="width: 40%"
            placeholder="请输入路由规则表达式"
          />
          <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="removePredicate(index)" />
          <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addPredicate" />
        </el-form-item>
        <!-- 过滤器 -->
        <el-form-item v-for="(filters, index) in dataForm.filters" :key="1+index" :label="'过滤器【' + (index+1)+'】'">
          <el-input
            v-model="filters.name"
            :prop="'filters.' + index + '.name'"
            style="width: 40%"
            placeholder="请输入名称，如StripPrefix"
          />
          <el-input
            v-model="filters.args.parts"
            :prop="'filters.' + index + '.args.parts'"
            style="width: 40%"
            placeholder="请输入过滤器配置"
          />
          <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="removeFilter(index)" />
          <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addFilter" />
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input v-model="dataForm.seq" type="number" placeholder="请输入优先级" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" type="textarea" :rows="3" placeholder="请输入描述内容" />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cleanDataForm">清空</el-button>
        <el-button @click="cleanDataForm">取消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import waves from '@/directive/waves'
import { queryDict, getDict, addDict, deleteDict, updateDict, refreshDict } from '@/api/system/dict'

export default {
  name: 'Index',
  directives: {
    waves
  },
  filters: {
    // 状态标签样式
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success'
      }
      return statusMap[status]
    },
    // 状态名称
    statusNameFilter(status) {
      const statusMap = {
        0: '锁定',
        1: '激活'
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        status: 'ok',
        current: 1,
        size: 10
      },
      routeType: [
        { key: 'ADMIN', value: 'ADMIN' },
        { key: 'APP', value: 'APP' },
        { key: 'WEB', value: 'WEB' }
      ],
      dialogStatus: 'create',
      dialogFormVisible: false,
      rules: {
        routeId: [{ required: true, message: '路由id必填', trigger: 'blur' }],
        uri: [{ required: true, message: 'uri路径必填', trigger: 'blur' }]
      },
      dataForm: {
        routeId: '',
        uri: '',
        seq: 0,
        description: '',
        predicates: [{
          name: '',
          args: {
            pattern: ''
          }
        }],
        filters: [{
          name: '',
          args: {
            parts: ''
          }
        }]
      },
      dictType: [{
        value: 'Y',
        label: 'Y'
      }, {
        value: 'N',
        label: 'N'
      }],
      defaultDict: 'Y',
      downloadLoading: false
    }
  },
  created() {
    this.queryDict()
  },
  methods: {
    /**
     * 删除路由规则
     */
    removePredicate(index) {
      this.dataForm.predicates.splice(index, 1)
    },
    /**
     * 添加路由规则
     */
    addPredicate() {
      this.dataForm.predicates.push({
        name: '',
        args: {
          pattern: ''
        }
      })
    },
    /**
     * 删除过滤器
     */
    removeFilter(index) {
      this.dataForm.filters.splice(index, 1)
    },
    /**
     * 添加过滤器
     */
    addFilter() {
      this.dataForm.filters.push({
        name: '',
        args: {
          parts: ''
        }
      })
    },
    /**
     * 查询路由列表
     */
    queryDict() {
      this.listLoading = true
      queryDict(this.listQuery).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
    },
    /**
     * 发布路由
     */
    refreshDict() {
      this.$confirm('此操作将发布网关路由到线上, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refreshDict().then(() => {
          this.$notify({
            title: '发布成功',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.queryDict()
    },
    /**
     * 修改每页显示条数
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryDict()
    },
    /**
     * 跳转到指定页
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryDict()
    },
    /**
     * 弹出新增路由对话框
     */
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.cleanDataForm()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 清空表单
     */
    cleanDataForm() {
      this.dataForm = {
        routeId: '',
        uri: '',
        seq: 0,
        description: '',
        predicates: [{
          name: '',
          args: {
            pattern: ''
          }
        }],
        filters: [{
          name: '',
          args: {
            parts: ''
          }
        }]
      }
    },
    /**
     * 新增路由
     */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.status = this.defaultDict
          addDict(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.queryDict()
          })
        }
      })
    },
    /**
     * 弹出更新路由对话框
     */
    handleUpdate(id) {
      getDict(id).then(({ data }) => {
        this.dataForm.id = data.id
        this.dataForm.routeId = data.routeId
        this.dataForm.uri = data.uri
        this.dataForm.seq = data.seq
        this.dataForm.description = data.description
        for (let i = 0; i < data.predicates.length; i++) {
          this.dataForm.predicates[i].name = data.predicates[i].name
          this.dataForm.predicates[i].args.pattern = data.predicates[i].args.pattern
        }
        for (let j = 0; j < data.filters.length; j++) {
          this.dataForm.filters[j].name = data.filters[j].name
          this.dataForm.filters[j].args.parts = data.filters[j].args.parts
        }
      })
      this.defaultDict = this.dataForm.status
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 更新路由
     */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateDict(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.queryDict()
          })
        }
      })
    },
    /**
     * 删除路由
     * @param id
     */
    deleteRoute(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDict(id).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryDict()
        })
      })
    },

    handleDownload() {
      console.log('download')
    }
  }
}
</script>

<style scoped>

</style>