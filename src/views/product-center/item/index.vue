<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        style="width: 200px;"
        class="filter-item"
        placeholder="商品编号"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        placeholder="商品名称"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.saleStatus"
        clearable
        style="width: 150px"
        class="filter-item"
        placeholder="销售状态"
      >
        <el-option
          v-for="item in itemSaleStatus"
          :key="item.key"
          :label="item.key"
          :value="item.value"
        />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateStepOne"
      >新增
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
<!--      <el-table-column type="index" width="100px" align="center" label="ID" >-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.id }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column width="150px" align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="商品编号">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="商品主图">
        <template slot-scope="scope">
          <el-image style="width: 40px; height: 40px" :src="scope.row.mainPicUrl" :fit="cover" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="最低划线价">
        <template slot-scope="scope">
          <span style="color: red">{{ scope.row.minLinePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="最大划线价">
        <template slot-scope="scope">
          <span style="color: red">{{ scope.row.maxLinePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="最小单价">
        <template slot-scope="scope">
          <span style="color: red">{{ scope.row.minUnitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="最大单价">
        <template slot-scope="scope">
          <span style="color: red">{{ scope.row.maxUnitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="销售状态" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.saleStatus | statusNameFilter }}</span>
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

      <el-table-column align="center" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdateStepOne(scope.row)">
            修改
          </el-button>
          <el-button type="primary" size="mini" @click="handleAuth(scope.row.id)">
            授权
          </el-button>
          <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">
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
        style="width: 80%; margin-left:30px;"
      >
        <el-form-item label="商品代码" prop="code">
          <el-input v-model="dataForm.code" placeholder="请输入商品代码" />
        </el-form-item>
        <el-form-item label="商品名" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入商品名" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="dataForm.description" type="textarea" :rows="2" placeholder="请输入描述内容" />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="createDataStepOne">创建</el-button>
        <el-button v-else type="primary" @click="updateDataStepOne">保存</el-button>
      </div>
    </el-dialog>

    <!--授权页面-->
    <!--    <el-dialog title="授权" :visible.sync="authFormVisible">-->
    <!--      <el-form-->
    <!--        ref="dataForm"-->
    <!--        :model="dataForm"-->
    <!--        label-position="right"-->
    <!--        label-width="120px"-->
    <!--        style="width: 90%; margin-left:40px;"-->
    <!--      >-->
    <!--        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>-->
    <!--        <div style="margin: 15px 0;" />-->
    <!--        <el-checkbox-group v-model="dataForm.resourceIds" @change="handleCheckedChange">-->
    <!--          <span v-for="(resource) in resources">-->
    <!--            <el-checkbox :key="resource.id" :label="resource.id" style="height: 15px;margin: 10px">-->
    <!--              {{ resource.name }}-->
    <!--            </el-checkbox>-->
    <!--          </span>-->
    <!--        </el-checkbox-group>-->
    <!--      </el-form>-->
    <!--      &lt;!&ndash;对话框动作按钮&ndash;&gt;-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="authFormVisible = false">取消</el-button>-->
    <!--        <el-button type="primary" @click="updateDataStepOne">保存</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import { queryPageList, deleteItem } from '@/api/product/item'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'ItemManagement',
  directives: {
    waves
  },
  filters: {
    statusNameFilter(status) {
      const itemSaleStatus = [
        { key: '未上架', value: 'UN_SALE' },
        { key: '已上架', value: 'ON_SALE' },
        { key: '已下架', value: 'NO_SALE' },
        { key: '上架申请', value: 'UP_APPLY' },
        { key: '下架申请', value: 'DOWN_APPLY' },
        { key: '强制下架', value: 'FORCE_NO_SALE' }
      ]
      for (const index in itemSaleStatus) {
        const saleStatus = itemSaleStatus[index]
        if (status === saleStatus.value) {
          return saleStatus.key
        }
      }
      return ''
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
      itemSaleStatus: [
        { key: '未上架', value: 'UN_SALE' },
        { key: '已上架', value: 'ON_SALE' },
        { key: '已下架', value: 'NO_SALE' },
        { key: '上架申请', value: 'UP_APPLY' },
        { key: '下架申请', value: 'DOWN_APPLY' },
        { key: '强制下架', value: 'FORCE_NO_SALE' }
      ],
      dialogStatus: 'create',
      dialogFormVisible: false,
      authFormVisible: false,
      rules: {
        name: [{ required: true, message: '商品名称必填', trigger: 'blur' }],
        code: [{ required: true, message: '商品编号必填', trigger: 'blur' }]
      },
      checkAll: false,
      resources: [],
      isIndeterminate: true,
      dataForm: {
        name: '',
        code: '',
        description: '',
        resourceIds: []
      },
      downloadLoading: false
    }
  },
  created() {
    this.queryPage()
  },
  methods: {
    /**
       * 查询列表
       */
    queryPage() {
      this.listLoading = true
      queryPageList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.queryPage()
    },
    // 重置搜索条件
    handleRefresh() {
      this.listQuery = {
        current: 1,
        size: 10
      }
      this.queryPage()
    },
    /**
     * 修改每页显示条数
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryPage()
    },
    /**
     * 跳转到指定页
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryPage()
    },

    /**
     * 点击新增按钮
     */
    handleCreateStepOne() {
      this.$router.push({ name: 'itemFormStepOne', query: { operationType: 'create' }})
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 点击修改按钮
     */
    handleUpdateStepOne(row) {
      this.$router.push({ name: 'itemFormStepOne', query: { itemId: row.id, operationType: 'edit' }})
    },
    /**
     * 删除商品
     * @param id
     */
    deleteItem(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(id).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryPage()
        })
      })
    },

    handleDownload() {
      console.log('download')
    }
  }
}
</script>

