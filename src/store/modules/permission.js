import {constantRoutes} from '@/router'
import {getPermissions} from '@/api/sys/permission'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
// 后台返回的权限列表转路由列表格式
function convertRoute(data) {
  const routes = []
  data.foreach(item => {
    const route = {
      path: item.path,
      component: () => import('@/views' + item.path),
      hidden: item.hidden
    }
    routes.push(route)
  })
  return routes
}
const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      getPermissions().then(response => {
        const accessedRoutes = response.data
        commit('SET_ROUTES', convertRoute(accessedRoutes))
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
