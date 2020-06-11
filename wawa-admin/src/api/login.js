import { axios } from '@/utils/request'

/**
 * login func
 * params: {
 *     username: '',
 *     password: '',
 * }
 * @param params
 * @returns {*}
 */
export function login(params) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: params
  })
}

export function getInfo() {
  return axios({
    url: '/auth/me',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout() {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
