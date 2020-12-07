<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="角色代码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入角色代码" />
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="dataForm.description" type="textarea" :rows="2" placeholder="请输入描述内容" />
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-checkbox ref="allCheck" v-model="checked" @change="allChecked">全选</el-checkbox>
        <el-tree
          ref="menuListTree"
          :data="menuList"
          :props="menuListTreeProps"
          :filter-node-method="filterNode"
          node-key="id"
          show-checkbox
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import { createRole, updateRole, getRole } from '@/api/system/role'
import { queryAllMenu } from '@/api/system/menu'

export default {
  data() {
    return {
      checked: false,
      visible: false,
      filterText: '',
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        id: 0,
        code: '',
        name: '',
        description: '',
        menuIdList: []
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuListTree.filter(val)
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      queryAllMenu().then(({ data }) => {
        this.menuList = treeDataTranslate(data, 'id', 'parentId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.menuListTree.setCheckedKeys([])
        })
      }).then(() => {
        if (this.dataForm.id) {
          getRole(id).then(({ data }) => {
            this.dataForm.id = data.id
            this.dataForm.code = data.code
            this.dataForm.name = data.name
            this.dataForm.description = data.description
            this.$nextTick(() => {
              data.menuIdList.forEach(menuId => {
                const node = this.$refs.menuListTree.getNode(menuId)
                if (node.isLeaf) {
                  this.$refs.menuListTree.setChecked(node, true, false)
                }
              })
              this.checked = false
            })
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.menuIdList = this.$refs.menuListTree.getCheckedKeys().concat(this.$refs.menuListTree.getHalfCheckedKeys())
          if (this.dataForm.id) {
            updateRole(this.dataForm).then(({ data }) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          } else {
            createRole(this.dataForm).then(({ data }) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          }
        }
      })
    },
    allChecked() {
      if (this.checked) { // 全选
        this.$refs.menuListTree.setCheckedNodes(this.menuList)
      } else { // 取消选中
        this.$refs.menuListTree.setCheckedKeys([])
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>
