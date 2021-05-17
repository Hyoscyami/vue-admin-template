import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/operator/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/operator/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/operator/logout',
    method: 'post'
  })
}

export function getCaptcha() {
  return request({url: '/api/getCaptcha', method: 'get'})
}
