import {asyncRoutes} from '@/router'
import {getPermissions} from '@/api/sys/permission'
import Layout from '@/layout'
import {isNotEmptyCollection} from '@/utils/common'
import {CommonEnum} from '@/constants/common'

const state = {
  // 树状路由
  routes: [],
  // 树状路由平铺成list
  routeList: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // state.routes = constantRoutes.concat(routes)
    state.routes = routes
  },
  // 保存树状路由平铺成的list
  SET_ROUTE_LIST: (state, routeList) => {
    state.routeList = routeList
  }
}
// 后台返回的权限列表转router格式
function convertRoute(routes, data) {
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

/**
 * 树平铺成list，用来判断用户是否有权限
 * @param treeRoutes 树状
 * @param routeList list
 */
function convertRouteList(treeRoutes, routeList) {
  console.log('树转list:', treeRoutes, routeList)
  treeRoutes.forEach(item => {
    if (item.children) {
      convertRouteList(item.children, routeList)
    }
    routeList.push(item)
  })
}

const actions = {
  generateRoutes({commit}) {
    return new Promise(resolve => {
      getPermissions().then(response => {
        // 根节点不显示
        const loadMenuData = response.data[0].children
        // 清空之前的路由
        asyncRoutes.length = 0
        // 将后台返回的路由转换成vue需要的格式
        convertRoute(asyncRoutes, loadMenuData)
        // 平铺后的路由
        const routeList = []
        convertRouteList(asyncRoutes, routeList)
        const accessedRoutes = asyncRoutes
        // 保存vue需要的树状路由
        commit('SET_ROUTES', accessedRoutes)
        // 保存树状路由平铺成的list
        commit('SET_ROUTE_LIST', routeList)
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
