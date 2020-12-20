<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in typeList" :key="index" :label="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="typeList[dataForm.type] + '名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="typeList[dataForm.type] + '名称'" />
      </el-form-item>
      <el-form-item label="上级菜单">
        <el-cascader
          v-model="selectedMenu"
          expand-trigger="hover"
          :options="menuList"
          :props="menuListTreeProps"
          change-on-select
          clearable
          @change="handleSelectMenuChange"
        />
      </el-form-item>
      <el-form-item v-if="dataForm.type === 0 || dataForm.type === 1" label="菜单路由" prop="uri">
        <el-input v-model="dataForm.uri" placeholder="菜单路由" />
      </el-form-item>
      <el-form-item v-if="dataForm.type === 2" label="请求方法" prop="method">
        <el-select v-model="dataForm.method" clearable placeholder="请选择">
          <el-option
            v-for="item in methods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 2" label="URI" prop="uri">
        <el-input v-model="dataForm.uri" placeholder="与请求方法组成唯一键 如: /user/list, /user/{id}" />
      </el-form-item>
      <el-form-item v-if="dataForm.type === 2" label="授权标识" prop="code">
        <el-input v-model="dataForm.code" placeholder="与请求方法组成唯一键 如: sys:user:list" />
      </el-form-item>
      <el-form-item label="排序号" prop="sequence">
        <el-input-number v-model="dataForm.sequence" controls-position="right" :min="0" label="排序号" />
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover"
            >
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  :class="{ 'is-active': item === dataForm.icon }"
                  @click="iconActiveHandle(item)"
                >
                  <svg-icon :icon-class="item" />
                </el-button>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input" />
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <div slot="content">更多图标请参考 https://www.iconfont.cn/</div>
              <i class="el-icon-warning" />
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate, idList } from '@/utils'
import Icon from '@/icons'
import { queryAllMenu, getMenu, createMenu, updateMenu } from '@/api/system/menu'
export default {
  data() {
    const validateUri = (rule, value, callback) => {
      if ((this.dataForm.type === 1 || this.dataForm.type === 2) && !/\S/.test(value)) {
        if (this.dataForm.type === 1) {
          callback(new Error('菜单路由不能为空'))
        } else {
          callback(new Error('URI不能为空'))
        }
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        id: 0,
        type: 1,
        name: '',
        parentId: 0,
        uri: '',
        method: '',
        code: '',
        sequence: 0,
        icon: ''
      },
      typeList: ['目录', '菜单', '按钮'],
      iconList: {},
      dataRule: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请求方法不能为空', trigger: 'blur' }
        ],
        uri: [
          { required: true, validator: validateUri, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '授权标识不能为空', trigger: 'blur' }
        ]
      },
      methods: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }, {
        value: 'PUT',
        label: 'PUT'
      }, {
        value: 'DELETE',
        label: 'DELETE'
      }],
      menuList: [],
      selectedMenu: [],
      menuListTreeProps: {
        value: 'id',
        label: 'name'
      }
    }
  },
  created() {
    this.iconList = Icon.getNameList()
    console.log(this.iconList)
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      queryAllMenu().then(response => {
        this.menuList = treeDataTranslate(response.data, 'id')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (this.dataForm.id) {
          // 修改
          getMenu(this.dataForm.id).then(({ data }) => {
            console.log(data)
            this.dataForm.id = data.id
            this.dataForm.type = data.type
            this.dataForm.name = data.name
            this.dataForm.parentId = data.parentId
            this.dataForm.uri = data.uri
            this.dataForm.method = data.method
            this.dataForm.code = data.code
            this.dataForm.sequence = data.sequence
            this.dataForm.icon = data.icon
            this.selectedMenu = idList(this.menuList, data.parentId, 'id', 'children').reverse()
          })
        } else {
          this.selectedMenu = []
        }
      })
    },
    handleSelectMenuChange(val) {
      console.log(val)
      this.dataForm.parentId = val[val.length - 1]
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.id) {
            updateMenu(this.dataForm).then(({ data }) => {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          } else {
            console.log(this.dataForm)
            createMenu(this.dataForm).then(({ data }) => {
              this.$message({
                message: '创建成功',
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
    }
  }
}
</script>

<style lang="scss">

  .mod-menu {
    .menu-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 420px;
    }
    &__icon-list {
      max-height: 300px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
