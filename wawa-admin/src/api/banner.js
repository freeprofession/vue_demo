import { axios } from '@/utils/request'

// 查询Banner列表
export function getBannerList(params) {
  return axios({
    url: '/banners',
    method: 'get',
    params: params
  })
}

// 添加Banner
export function addBanner(params) {
  return axios({
    url: '/banners',
    method: 'post',
    data: params
  })
}

// 修改Banner
export function updateBanner(banner_id, params) {
  return axios({
    url: `/banners/${banner_id}`,
    method: 'put',
    data: params
  })
}

// 删除Banner
export function deleteBanner(banner_id) {
  return axios({
    url: `/banners/${banner_id}`,
    method: 'delete'
  })
}
