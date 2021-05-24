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
export function add(data) {
  return request({
    url: '/permission/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function del(id) {
  return request({
    url: '/permission/delete',
    method: 'get',
    params: {id}
  })
}

export function getMaxSort(id) {
  return request({
    url: '/permission/getMaxSort',
    method: 'get',
    params: {parentId: id}
  })
}

export function list(data) {
  return request({
    url: '/permission/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}
export function update(data) {
  return request({
    url: '/permission/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}
