import {validUsername} from '@/utils/validate'
import {getCaptcha} from '@/api/user'
import {nextTick, unref} from 'vue'

// 校验用户名
export const validateUsername = (rule, value, callback) => {
  if (!validUsername(value)) {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}
// 校验密码
export const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
// 校验验证码
export const validateVerifyCode = (rule, value, callback) => {
  if (value.length < 4) {
    callback(new Error('请输入验证码'))
  } else {
    callback()
  }
}
// 修改验证码
export function useChangeVerifyCode(verifyCodeUrl, loginForm) {
  const changeVerifyCode = () => getCaptcha().then(response => {
    verifyCodeUrl.value = response.data.verifyCodeStr
    loginForm.verifyCodeId = response.data.id
  })
  return {changeVerifyCode}
}
// 显示密码
export function useShowPwd(passwordType, passwordRef) {
  const showPwd = () => {
    // 取消变量的响应直接用值对比
    if (unref(passwordType) === 'password') {
      passwordType.value = ''
    } else {
      passwordType.value = 'password'
    }
    nextTick(() => { passwordRef.value.focus() })
  }
  return {showPwd}
}
