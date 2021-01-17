<template>
  <div class="app-container">
    <div class="filter-container">

      <!--查询条件-->
      <el-input
        v-model="listQuery.title"
        label="日志标题"
        style="width: 200px;"
        class="filter-item"
        placeholder="请输入日志标题"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.serviceId"
        clearable
        label="微服务ID"
        style="width: 200px;"
        class="filter-item"
        placeholder="请输入微服务ID"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.username"
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="请输入操作用户"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.method"
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="请输入请求方法"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.time"
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="请输入执行时长 单位:ms"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        clearable
        style="width: 150px"
        class="filter-item"
        placeholder="请选择日志类型"
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="item in logType"
          :key="item.key"
          :label="item.key"
          :value="item.value"
        />
      </el-select>
      <br>
      <el-date-picker
        v-model="listQuery.createTimeStart"
        align="right"
        class="filter-item"
        type="date"
        placeholder="选择开始日期"
        :picker-options="pickerOptions"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.createTimeEnd"
        align="right"
        class="filter-item"
        type="date"
        placeholder="选择结束日期"
        :picker-options="pickerOptions"
        @keyup.enter.native="handleFilter"
      />

      <!--动作按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
    </div>

    <!--列表-->
    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="100" align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="日志标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="微服务ID">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="操作用户">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="请求URI" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.uri }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="请求方法">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="执行时长">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}  ms</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="日志类型" width="80px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeFilter">{{ scope.row.type | typeNameFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="执行时长">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}  ms</span>
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
          <el-button type="primary" size="mini" @click="handleDetail(scope.row.id)">
            详情
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

    <!--详情对话框-->
    <el-dialog title="详情" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 80%; margin-left:60px;"
      >
        <el-form-item label="日志标题" prop="username">
          <el-input v-model="dataForm.title" placeholder="日志标题" />
        </el-form-item>
        <el-form-item label="操作用户" prop="username">
          <el-input v-model="dataForm.username" placeholder="操作用户" />
        </el-form-item>
        <el-form-item label="客户端IP" prop="clientIp">
          <el-input v-model="dataForm.clientIp" placeholder="客户端IP" />
        </el-form-item>
        <el-form-item label="用户代理" prop="userAgent">
          <el-input v-model="dataForm.userAgent" placeholder="用户代理" />
        </el-form-item>
        <el-form-item label="请求URL" prop="url">
          <el-input v-model="dataForm.url" placeholder="请求URL" />
        </el-form-item>
        <el-form-item label="请求URI" prop="uri">
          <el-input v-model="dataForm.uri" placeholder="请求URI" />
        </el-form-item>
        <el-form-item label="请求方法" prop="method">
          <el-input v-model="dataForm.method" placeholder="请求方法" />
        </el-form-item>
        <el-form-item label="请求参数" prop="params">
          <el-input v-model="dataForm.params" placeholder="请求参数" />
        </el-form-item>
        <el-form-item label="执行时长" prop="time">
          <el-input v-model="dataForm.time" placeholder="执行时长" />
        </el-form-item>
        <el-form-item label="异常信息" prop="exceptionMessage">
          <el-input v-model="dataForm.exceptionMessage" placeholder="异常信息" />
        </el-form-item>
        <el-form-item label="日志类型" prop="type">
          <el-input v-model="dataForm.type" placeholder="日志类型" />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryLog, getLog } from '@/api/system/log'

import waves from '@/directive/waves'

export default {
  name: 'LogManagement',
  // 水波文效果
  directives: {
    waves
  },
  filters: {
    // 日志类型标签样式
    typeFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    typeNameFilter(status) {
      const statusMap = {
        1: '正常',
        2: '异常'
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      logType: [
        { key: '正常', value: 1 },
        { key: '异常', value: 2 }
      ],
      dialogFormVisible: false,
      // 创建或修改日志临时对象
      dataForm: {
        id: '',
        title: '',
        serviceId: '',
        userId: '',
        username: '',
        clientIp: '',
        userAgent: '',
        url: '',
        uri: '',
        method: '',
        params: '',
        time: 0,
        exceptionMessage: '',
        type: 0,
        createTime: ''
      }
    }
  },
  // 页面加载完成后显示列表页
  created() {
    this.queryLog()
    this.resetForm()
  },
  methods: {
    /**
       * 日志列表
       */
    queryLog() {
      this.listLoading = true
      queryLog(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 查询过滤器
    handleFilter() {
      this.listQuery.current = 1
      this.queryLog()
    },
    // 重置搜索条件
    handleRefresh() {
      this.listQuery = {
        current: 1,
        size: 10
      }
      this.queryLog()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryLog()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryLog()
    },
    /**
       * 重置添加表单
       */
    resetForm() {
      this.dataForm = {
        id: 0,
        title: '',
        serviceId: '',
        userId: '',
        username: '',
        clientIp: '',
        userAgent: '',
        url: '',
        uri: '',
        method: '',
        params: '',
        time: 0,
        exceptionMessage: '',
        type: 0
      }
    },
    /**
       * 弹出日志详情
       */
    handleDetail(id) {
      this.dialogFormVisible = true
      this.resetForm()
      getLog(id).then(response => {
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
       * 导出列表
       */
    handleDownload() {
      console.log('download')
    }
  }
}
</script>

