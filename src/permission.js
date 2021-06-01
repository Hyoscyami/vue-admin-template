import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import hasPermission from '@/utils/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
const errorList = ['/401'] // 错误页面

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (errorList.indexOf(to.path) !== -1) {
      console.log('跳转到错误页面:', to)
      next()
    } else if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      try {
        // get user info
        await store.dispatch('user/getInfo')
        // generate routes
        await store.dispatch('permission/generateRoutes')
        // 没有权限
        if (!hasPermission(to.path)) {
          console.log('to', to)
          next({ path: '/401' })
        } else {
          next()
        }
      } catch (error) {
        // remove token and go to login page to re-login
        await store.dispatch('user/resetToken')
        // ElMessage.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
