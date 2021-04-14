import {createApp} from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn' // lang i18n
import SvgIcon from '@/components/SvgIcon'// svg component

import '@/styles/index.scss' // global css

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const {mockXHR} = require('../mock')
  mockXHR()
}
const app = createApp(App)
app.use(ElementPlus, {locale})
app.use(router)
app.use(store)
app.component('svg-icon', SvgIcon)
app.config.productionTip = false
app.mount('#app')
