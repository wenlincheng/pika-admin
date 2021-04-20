<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        placeholder="字典名称"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.code"
        style="width: 200px;"
        class="filter-item"
        placeholder="字典编码"
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
          v-for="item in dictTypeStatus"
          :key="item.key"
          :label="item.key"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column width="120px" align="left" label="字典名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="left" label="字典编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="字典值数量">
        <template slot-scope="scope">
          <span>{{ scope.row.valueNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
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
    <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 90%; margin:30px;"
      >
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入字典名称" />
        </el-form-item>

        <el-form-item label="字典编码" prop="code">
          <el-input v-model="dataForm.code" placeholder="请输入字典编码" />
        </el-form-item>
        <!-- 字典值输入框 -->
        <el-form-item
          v-for="(dictValue, index) in dataForm.dictValues"
          :key="0 + index"
          :label="'字典值【' + (index+1)+'】'"
          :rules="{ required: true, message: '字典值不能为空', trigger: 'blur'}"
        >
          <el-input
            v-model="dictValue.name"
            :prop="'dictValue.' + index + '.name'"
            style="width: 20%"
            placeholder="请输入名称"
          />
          <el-input
            v-model="dictValue.value"
            :prop="'dictValue.' + index + '.value'"
            style="width: 25%"
            placeholder="请输入字典值"
          />
          <el-input
            v-model="dictValue.status"
            :prop="'dictValue.' + index + '.status'"
            style="width: 20%"
            placeholder="请输入状态"
          />
          <el-input
            v-model="dictValue.sort"
            :prop="'dictValue.' + index + '.sort'"
            style="width: 15%"
            type="number"
            placeholder="请输入排序"
          />
          <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="removeDictValue(index)" />
          <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addDictValue" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio v-model="dataForm.status" label="1">启用</el-radio>
          <el-radio v-model="dataForm.status" label="2">禁用</el-radio>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" type="textarea" :rows="3" placeholder="请输入描述内容" />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cleanDataForm">取消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import waves from '@/directive/waves'
import { queryDict, getDict, addDict, deleteDict, updateDict } from '@/api/system/dict'

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
    }
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
      dictTypeStatus: [
        { key: '启用', value: 1 },
        { key: '禁用', value: 2 }
      ],
      dialogStatus: 'create',
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '字典编码不能为空', trigger: 'blur' }]
      },
      dataForm: {
        id: undefined,
        name: '',
        code: '',
        status: '1',
        description: '',
        dictValues: [{
          name: '',
          value: '',
          status: '',
          sort: undefined,
          description: ''
        }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.queryDict()
  },
  methods: {
    /**
     * 删除字典值
     */
    removeDictValue(index) {
      this.dataForm.dictValues.splice(index, 1)
    },
    /**
     * 添加字典值
     */
    addDictValue() {
      this.dataForm.dictValues.push({
        name: '',
        value: '',
        status: '',
        sort: undefined,
        description: ''
      })
    },
    /**
     * 查询字典列表
     */
    queryDict() {
      this.listLoading = true
      queryDict(this.listQuery).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
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
     * 弹出新增对话框
     */
    handleCreate() {
      this.dialogStatus = 'create'
      this.cleanDataForm()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 清空表单
     */
    cleanDataForm() {
      this.dataForm = {
        name: '',
        code: '',
        status: 1,
        description: '',
        dictValues: [{
          name: '',
          value: '',
          status: '',
          sort: 0,
          description: ''
        }]
      }
      this.dialogFormVisible = false
    },
    /**
     * 新增字典
     */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
     * 弹出更新字典对话框
     */
    handleUpdate(id) {
      getDict(id).then(({ data }) => {
        this.dataForm = {
          id: data.id,
          name: data.name,
          code: data.code,
          status: data.status,
          description: data.description,
          dictValues: data.dictValues
        }
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
