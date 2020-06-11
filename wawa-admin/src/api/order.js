import { axios } from '@/utils/request'

// 获取订单列表
export function getOrderList(params) {
  return axios({
    url: '/orders',
    method: 'get',
    params
  })
}

// 查看订单信息
export function getOrder(order_id) {
  return axios({
    url: `/orders/${order_id}`,
    method: 'get'
  })
}

// 更新订单
export function updateOrder(order_id, params) {
  return axios({
    url: `/orders/${order_id}`,
    method: 'put',
    data: params
  })
}

export function exportOrders(params) {
  return axios({
    url: '/orders/export',
    method: 'get',
    params: params
  })
}

export function refund(order_id, params) {
  return axios({
    url: `/orders/${order_id}/refund`,
    method: 'put',
    data: params
  })
}

// 查询订单数据
export function getOrderData(params) {
  return axios({
    url: `/statistics/change`,
    method: 'get',
    params
  })
}

// 查询充值数据
export function getRechargeData(params) {
  return axios({
    url: `/statistics/recharge`,
    method: 'get',
    params
  })
}
