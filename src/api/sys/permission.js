import request from '@/utils/request'

export function getRootPermission() {
  return request({
    url: '/permission/getRootPermission',
    method: 'get'
  })
}

export function listChildren(id) {
  return request({
    url: '/permission/listChildren',
    method: 'get',
    params: {id}
  })
}
