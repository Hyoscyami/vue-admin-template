import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/dict/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function del(id) {
  return request({
    url: '/dict/delete',
    method: 'get',
    params: {id}
  })
}

export function getMaxSort(id) {
  return request({
    url: '/dict/getMaxSort',
    method: 'get',
    params: {parentId: id}
  })
}

export function list(data) {
  return request({
    url: '/dict/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function listChildrenById(id) {
  return request({
    url: '/dict/listChildrenById',
    method: 'get',
    params: {id}
  })
}

export function listChildrenByCode(code) {
  return request({
    url: '/dict/listChildrenByCode',
    method: 'get',
    params: {code}
  })
}

export function update(data) {
  return request({
    url: '/dict/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function getDetailByCode(code) {
  return request({
    url: '/dict/getDetailByCode',
    method: 'get',
    params: {code}
  })
}
