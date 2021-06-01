import {asyncRoutes} from '@/router'
import {getPermissions} from '@/api/sys/permission'
import Layout from '@/layout'
import {isNotEmptyCollection} from '@/utils/common'
import {CommonEnum} from '@/constants/common'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // state.routes = constantRoutes.concat(routes)
    state.routes = routes
  }
}

// 后台返回的权限列表转路由列表格式
function convertRoute(routes, data) {
  console.log('开始转换路由:routes,data:', routes, data)
  data.forEach(item => {
    const menu = {
      path: item.path,
      component: isNotEmptyCollection(item.children) ? Layout : (resolve) => require([`@/views${item.path}`], resolve),
      name: item.name,
      hidden: item.type === CommonEnum.permissionMenu ? item.hidden : true, // 是页面的话根据按钮是否隐藏赋值，不是页面的话直接隐藏
      meta: {title: item.name, icon: item.icon, type: item.type},
      children: []
    }
    if (item.children) {
      convertRoute(menu.children, item.children)
    }
    routes.push(menu)
  })
}

const actions = {
  generateRoutes({commit}) {
    return new Promise(resolve => {
      getPermissions().then(response => {
        // 根节点不显示
        const loadMenuData = response.data[0].children
        // 转换成vue需要的路由格式
        console.log('asyncRoutes', asyncRoutes)
        // 清空之前的路由
        asyncRoutes.length = 0
        convertRoute(asyncRoutes, loadMenuData)
        const accessedRoutes = asyncRoutes
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
