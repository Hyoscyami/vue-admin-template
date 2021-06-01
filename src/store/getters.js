const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  // 树状路由
  permissionTreeRoutes: state => state.permission.routes,
  // 树状路由平铺成的list
  permissionListRoutes: state => state.permission.routeList
}
export default getters
