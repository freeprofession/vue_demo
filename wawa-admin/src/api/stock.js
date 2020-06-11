import { axios } from '@/utils/request'

// 获取库存列表
export function getStockList(params) {
  return axios({
    url: `/branch_stock`,
    method: 'get',
    params
  })
}

//获取商品总表
export function getWayallstock(params) {
  return axios({
    url: `/putaway`,
    method: 'get',
    params
  })
}

//更改订单状态
export function updateAllstock(params) {
  return axios({
    url: `/putaway`,
    method: 'post',
    data: params
  })
}

//获取上架商品详情表
export function getWaystock(purchase_id, params) {
  return axios({
    url: `/putaway/${purchase_id}`,
    method: 'get',
    params
  })
}

//上架商品提交
export function addWaystock(purchase_id, params) {
  return axios({
    url: `/putaway/${purchase_id}`,
    method: 'post',
    data: params
  })
}

//获取盘点库存
export function getInventory(params) {
  return axios({
    url: `/takestock`,
    method: 'get',
    params
  })
} 

//盘点库存提交
export function Inventory(params) {
  return axios({
    url: `/takestock`,
    method: 'post',
    data: params
  })
} 
//获取复盘库存
export function getReviewInventory(params) {
  return axios({
      url: `/checkstock`,
      method: 'get',
      params
  })
}

//复盘库存提交
export function reviewInventory(params) {
  return axios({
      url: `/checkstock`,
      method: 'post',
      data: params
  })
}

//获取机器抄码表（初始版）
export function getCopyTable(params) {
  return axios({
      url: `/copy`,
      method: 'get',
      params
  })
}

//提交机器抄码表
export function subCopyTable(params) {
  return axios({
      url: `/copy`,
      method: 'post',
      data:params
  })
}

//获取机器抄码表(完整版)
export function getCopyTables(params) {
  return axios({
      url: `/meters`,
      method: 'get',
      params
  })
}

//修改机器抄码表
export function subCopyTables(meter_id,params) {
  return axios({
      url: `/meters/${meter_id}`,
      method: 'put',
      data:params
  })
}

//获取运营报表
export function getAnalyTable(params) {
  return axios({
      url: `/turnover`,
      method: 'get',
      params
  })
}

//提交营业额
export function postVolume(params) {
  return axios({
      url: `/turnover`,
      method: 'post',
      data:params
  })
}
