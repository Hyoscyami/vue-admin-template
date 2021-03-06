import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/operator/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/operator/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/operator/logout',
    method: 'post'
  })
}

export function getCaptcha() {
  return request({url: '/getCaptcha', method: 'get'})
}

