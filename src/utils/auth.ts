import Cookies from 'js-cookie'

const tokenKey = 'vue_admin_template_token'

export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token)
export const removeToken = () => Cookies.remove(tokenKey)
