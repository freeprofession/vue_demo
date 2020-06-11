import { axios } from '@/utils/request'

// 查询品牌列表
export function getBrandList(params) {
  return axios({
    url: '/brands',
    method: 'get',
    params: params
  })
}

// 添加品牌
export function addBrand(params) {
  return axios({
    url: '/brands',
    method: 'post',
    data: params
  })
}

// 修改品牌
export function updateBrand(brand_id, params) {
  return axios({
    url: `/brands/${brand_id}`,
    method: 'put',
    data: params
  })
}

// 删除品牌
export function deleteBrand(brand_id) {
  return axios({
    url: `/brands/${brand_id}`,
    method: 'delete'
  })
}
