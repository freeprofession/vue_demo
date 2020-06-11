import { axios } from '@/utils/request'

// 获取商品列表
export function getOptionList(params) {
  return axios({
    url: `/choosemodel`,
    method: 'get',
    params
  })
}

// 商品提交
export function chooseOption(params) {
  return axios({
    url: `/choosemodel`,
    method: 'post',
    data:params
  })
}

// 获取购物车列表
export function getCartList(params) {
  return axios({
    url: `/temporary`,
    method: 'get',
    params
  })
}

// 确认订单
export function sureCart(params) {
  return axios({
    url: `/temporary`,
    method: 'post',
    data:params
  })
}

// 删除订单
export function deleteCart(temporal_id) {
  return axios({
    url: `/temporary/${temporal_id}`,
    method: 'delete',
  })
}
//导出收藏夹订单
export function exportCart(params) {
  return axios({
    url: '/stock/export',
    method: 'get',
    params: params
  })
}
//导出订单表
export function exportList(params) {
  return axios({
    url: '/purchases/export',
    method: 'get',
    params: params
  })
}

// 获取订单列表
export function getSorderList(params) {
  return axios({
    url: `/purchase`,
    method: 'get',
    params
  })
}

//转在途
export function updateList(params) {
  return axios({
    url: `/purchase`,
    method: 'post',
    data:params
  })
}

// 提交物流单
export function updateLogistics(purchase_id,params) {
  return axios({
    url: `/purchase/${purchase_id}`,
    method: 'put',
    data:params
  })
}

// 获取订单详情
export function getBuydetail(purchase_id, params) {
  return axios({
    url: `/purchase/${purchase_id}`,
    method: 'get',
    params
  })
}

// 获取异常订单列表
export function getAbnormalList(params) {
  return axios({
    url: `/exchange`,
    method: 'get',
    params
  })
}

//处理异常订单
export function addAbnormal(params) {
  return axios({
    url: `/exchange`,
    method: 'post',
    data:params
  })
}

// 获取异常订单详情
export function getAbnormaltail(purchase_id, params) {
  return axios({
    url: `/return/${purchase_id}`,
    method: 'get',
    params
  })
}

// 处理异常订单详情
export function updateAbnormaltail(purchase_id, params) {
  return axios({
    url: `/return/${purchase_id}`,
    method: 'put',
    data:params
  })
}

// 删除异常订单详情
export function deleteAbnormaltail(purchase_id, params) {
  return axios({
    url: `/return/${purchase_id}`,
    method: 'delete',
    params
  })
}