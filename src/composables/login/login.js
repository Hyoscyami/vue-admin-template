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
// 重定向地址
export const redirectUrl = (route, redirect) => {
  redirect.value = route.query && route.query.redirect
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
    if (unref(passwordType) === 'password') {
      passwordType.value = ''
    } else {
      passwordType.value = 'password'
    }
    nextTick(() => { passwordRef.value.focus() })
  }
  return {showPwd}
}
// 登录
// export function useHandleLogin(loginFormRef, loginForm, loading, redirect) {
//   const handleLogin = () => {
//     loginFormRef.value.validate(valid => {
//       if (valid) {
//         loading.value = true
//         store.dispatch('user/login', loginForm).then(() => {
//           router.push({path: redirect.value || '/'})
//           loading.value = false
//         }).catch(() => {
//           loading.value = false
//         })
//       } else {
//         return false
//       }
//     })
//   }
//   return {handleLogin}
// }
