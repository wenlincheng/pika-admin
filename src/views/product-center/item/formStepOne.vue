<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="120px"
      status-icon
      style="width: 80%; margin-left:30px;"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入商品名称" />
      </el-form-item>
<!--      <el-form-item label="商品编码" prop="code">-->
<!--        <el-input v-model="dataForm.code" placeholder="请输入商品编码" />-->
<!--      </el-form-item>-->
      <el-form-item label="商品描述" prop="description">
        <el-input v-model="dataForm.description" type="textarea" :rows="2" placeholder="请输入描述内容" />
      </el-form-item>
    </el-form>
    <!--对话框动作按钮-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button v-if="operationType === 'create'" type="primary" @click="createDataStepOne">创建</el-button>
      <el-button v-else type="primary" @click="updateDataStepOne">保存</el-button>
    </div>
  </div>
</template>
<script>
import { getItemStepOne, getItemStepTwo, updateItemStepOne, createItemStepOne, createItemStepTwo, updateItemStepTwo } from '@/api/product/item'
import waves from '@/directive/waves'
export default {
  name: 'ItemFormStepOne',
  directives: {
    waves
  },
  data() {
    return {
      operationType: 'create',
      dataForm: {
        id: 0,
        name: '',
        code: ''
      }
    }
  },
  created() {
    this.operationType = this.$route.query.operationType
    if (this.operationType === 'edit') {
      this.getItemDetailStepOne(this.$route.query.itemId)
    }
  },
  methods: {
    /**
     * 查询商品 Step1
     */
    getItemDetailStepOne(itemId) {
      getItemStepOne(itemId).then(({ data }) => {
        this.dataForm.id = data.id
        this.dataForm.name = data.name
      })
    },
    /**
     * 创建商品 Step1
     */
    createDataStepOne() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createItemStepOne(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            //
          })
        }
      })
    },
    /**
     * 更新商品 Step1
     */
    updateDataStepOne() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateItemStepOne(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            //
          })
        }
      })
    },
    /**
     * 点击下一步按钮
     */
    handleUpdateStepOne(row) {
      this.$router.push({ name: 'itemFormStepOne', query: { itemId: row.id, dialogStatus: 'edit' }})
    },
    /**
     * 查询商品 Step2
     */
    getItemDetailStepTwo(itemId) {
      getItemStepTwo(itemId).then(({ data }) => {
        this.dataForm.id = data.id
        this.dataForm.name = data.name
      })
    },
    /**
     * 创建商品 Step2
     */
    createDataStepTwo() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createItemStepTwo(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            //
          })
        }
      })
    },
    /**
     * 更新商品 Step2
     */
    updateDataStepTwo() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateItemStepTwo(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.queryPage()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
