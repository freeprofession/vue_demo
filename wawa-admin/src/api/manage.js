import { axios } from '@/utils/request'

// 查询用户列表
export function recharge(params) {
  return axios({
    url: '/recharge',
    method: 'post',
    data: params
  })
}

// 获取分店订单列表
export function getBranchOrderList(params) {
  return axios({
    url: '/branch_orders',
    method: 'get',
    params: params
  })
}

// 审核订单
export function checkOrder(order_id, check) {
  return axios({
    url: `/orders/${order_id}/check`,
    method: 'put',
    data: { check }
  })
}
