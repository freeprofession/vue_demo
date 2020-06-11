import { axios } from '@/utils/request'

// 查询门店列表
export function getBranchList(params) {
  return axios({
    url: '/branches',
    method: 'get',
    params: params
  })
}

// 添加门店
export function addBranch(params) {
  return axios({
    url: '/branches',
    method: 'post',
    data: params
  })
}

// 修改门店
export function updateBranch(branch_id, params) {
  return axios({
    url: `/branches/${branch_id}`,
    method: 'put',
    data: params
  })
}

// 删除门店
export function deleteBranch(branch_id) {
  return axios({
    url: `/branches/${branch_id}`,
    method: 'delete'
  })
}

// 查询门店管理员
export function getBranchAdminList(params) {
  return axios({
    url: '/clerk',
    method: 'get',
    params: params
  })
}

// 门店机器编码管理
export function getBranchIdentify(params) {
  return axios({
    url: '/meter',
    method: 'put',
    data: params
  })
}
