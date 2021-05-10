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

export function getMaxSort() {
  return request({
    url: '/dict/getMaxSort',
    method: 'get'
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