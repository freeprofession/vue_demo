import { axios } from '@/utils/request'

// 查询用户列表
export function getUserList(params) {
  return axios({
    url: '/users',
    method: 'get',
    params: params
  })
}

// 添加用户
export function addUser(params) {
  return axios({
    url: '/users',
    method: 'post',
    data: params
  })
}

// 查询用户信息
export function getUser(user_id) {
  return axios({
    url: `/users/${user_id}`,
    method: 'get'
  })
}

// 修改用户信息
export function updateUser(user_id, params) {
  return axios({
    url: `/users/${user_id}`,
    method: 'put',
    data: params
  })
}

// 删除用户
export function deleteUser(user_id) {
  return axios({
    url: `/users/${user_id}`,
    method: 'delete'
  })
}

// 修改密码
export function modifyPassword(params){
  return axios({
    url: '/users/modify_password',
    method: 'put',
    data: params
  })
}

//查询娃娃数量变化
export function getUserRecordList(params) {
  return axios({
    url: '/record',
    method: 'get',
    params: params
  })
}

//查询娃娃赞助记录
export function getUserSponsorList(params) {
  return axios({
    url: '/sponsor',
    method: 'get',
    params: params
  })
}
