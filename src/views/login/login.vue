<template>
  <el-container class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="passwordRef"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="verifyCode">
            <el-input
              v-model="loginForm.verifyCode"
              placeholder="请输入验证码"
              type="text"
              name="verifyCode"
              tabindex="3"
              maxlength="5"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="3">
          <img
            style="width: 150px; height: 50px"
            :src="url"
            alt="验证码加载失败"
            @click="changeVerifyCode"
          >
        </el-col>
      </el-row>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录
      </el-button>

    </el-form>
  </el-container>

</template>

<script>
import {validUsername} from '@/utils/validate'
import {getCaptcha} from '@/api/user'
import {onMounted, ref, unref, watch, nextTick, reactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex'

export default {
  name: 'Login',
  setup() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateVerifyCode = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    // 登录表单，定义对象一般用reactive
    const loginForm = reactive({
      username: '',
      password: '',
      verifyCode: '',
      verifyCodeId: ''
    })
    const loginFormRef = ref(null)
    const passwordRef = ref(null)
    // 登录规则
    const loginRules = {
      username: [{required: true, trigger: 'blur', validator: validateUsername}],
      password: [{required: true, trigger: 'blur', validator: validatePassword}],
      verifyCode: [{required: true, trigger: 'blur', validator: validateVerifyCode}]
    }
    const loading = ref(false)
    const passwordType = ref('password')
    const redirect = ref(undefined)
    const url = ref('')

    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    watch(() => route, (route) => {
      redirect.value = route.query && route.query.redirect
    }, {
      immediate: true
    })
    const changeVerifyCode = () => {
      getCaptcha().then(response => {
        url.value = response.data.verifyCodeStr
        loginForm.verifyCodeId = response.data.id
      })
    }
    onMounted(changeVerifyCode)

    const showPwd = () => {
      if (unref(passwordType) === 'password') {
        passwordType.value = ''
      } else {
        passwordType.value = 'password'
      }
      nextTick(() => { passwordRef.value.focus() })
    }
    const handleLogin = () => {
      loginFormRef.value.validate(valid => {
        if (valid) {
          loading.value = true
          store.dispatch('user/login', loginForm).then(() => {
            router.push({path: redirect.value || '/'})
            loading.value = false
          }).catch(() => {
            loading.value = false
          })
        } else {
          return false
        }
      })
    }
    return {
      loginForm,
      loginRules,
      loading,
      passwordType,
      redirect,
      url,
      loginFormRef,
      passwordRef,
      showPwd,
      handleLogin,
      changeVerifyCode
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-plus css */
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
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

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
}
</style>
