<template>
  <div class="login-container">
    <el-form ref="dataForm" :model="dataForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">设置密码</h3>
      </div>
      <!-- 密码 -->
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="oldPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="oldPwdShowType"
            ref="oldPassword"
            v-model="dataForm.oldPassword"
            :type="oldPwdShowType"
            placeholder="请输入密码"
            name="oldPassword"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showOldPwd">
            <svg-icon :icon-class="oldPwdShowType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="pwdShowType"
            ref="password"
            v-model="dataForm.password"
            :type="pwdShowType"
            placeholder="请输入新密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="pwdShowType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="confirmPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="confirmPwdShowType"
            ref="confirmPassword"
            v-model="dataForm.confirmPassword"
            :type="confirmPwdShowType"
            placeholder="请确认密码"
            name="confirmPassword"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleUpdatePassword"
          />
          <span class="show-pwd" @click="showConfirmPwd">
            <svg-icon :icon-class="confirmPwdShowType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleUpdatePassword">提交</el-button>
    </el-form>

  </div>
</template>

<script>
import { validPassword } from '@/utils/validate'

export default {
  name: 'Password',
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.dataForm.password === '') {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('输入密码不一致'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (this.dataForm.password === '') {
        callback(new Error('新密码不能为空'))
      } else if (!validPassword(value)) {
        callback(new Error('新密码格式错误'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      loginRules: {
        oldPassword: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
      },
      oldPwdShowType: 'password',
      pwdShowType: 'password',
      confirmPwdShowType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.dataForm.oldPassword === '') {
      this.$refs.oldPassword.focus()
    } else if (this.dataForm.password === '') {
      this.$refs.password.focus()
    } else if (this.dataForm.confirmPassword === '') {
      this.$refs.confirmPassword.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 校验
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    // 显示密码
    showOldPwd() {
      if (this.oldPwdShowType === 'password') {
        this.oldPwdShowType = ''
      } else {
        this.oldPwdShowType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.oldPassword.focus()
      })
    },
    showPwd() {
      if (this.pwdShowType === 'password') {
        this.pwdShowType = ''
      } else {
        this.pwdShowType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showConfirmPwd() {
      if (this.confirmPwdShowType === 'password') {
        this.confirmPwdShowType = ''
      } else {
        this.confirmPwdShowType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.confirmPassword.focus()
      })
    },
    // 修改密码
    handleUpdatePassword() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/updatePassword', this.dataForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
