import store from '@/store'

/**
 * @param  path 权限值
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(path) {
  return store.getters.permissionListRoutes.some(item => item.path === path)
}
