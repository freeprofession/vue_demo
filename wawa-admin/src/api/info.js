import { axios } from '@/utils/request'

// 查询门店列表
export function getGoodsInfoList(goods_id,params) {
  return axios({
    url: `/info/${goods_id}`,
    method: 'get',
    params: params
  })
}


// 批量操作门店商品信息
export function updateInfos(list) {
  return axios({
    url: '/info',
    method: 'put',
    data: { info_sku: list }
  })
}