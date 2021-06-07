import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/config/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function del(id) {
  return request({
    url: '/config/delete',
    method: 'get',
    params: {id}
  })
}

export function getMaxSort() {
  return request({
    url: '/config/getMaxSort',
    method: 'get'
  })
}

export function list(data) {
  return request({
    url: '/config/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function update(data) {
  return request({
    url: '/config/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}
