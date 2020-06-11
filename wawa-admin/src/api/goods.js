import { axios } from '@/utils/request'

// 获取商品列表
export function getGoodsList(params) {
  return axios({
    url: `/goods`,
    method: 'get',
    params
  })
}

// 查看商品信息
export function getGoods(goods_id) {
  return axios({
    url: `/goods/${goods_id}`,
    method: 'get'
  })
}

// 增加商品
export function addGoods(params) {
  return axios({
    url: '/goods',
    method: 'post',
    data: params
  })
}

// 修改商品
export function updateGoods(goods_id, params) {
  return axios({
    url: `/goods/${goods_id}`,
    method: 'put',
    data: params
  })
}

// 删除商品
export function deleteGoods(goods_id) {
  return axios({
    url: `/goods/${goods_id}`,
    method: 'delete'
  })
}



