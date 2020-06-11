import { axios } from '@/utils/request'

// 查询分类列表
export function getCategoryList(params) {
  return axios({
    url: '/major',
    method: 'get',
    params: params
  })
}

// 添加分类
export function addCategory(params) {
  return axios({
    url: '/major',
    method: 'post',
    data: params
  })
}

// 修改分类
export function updateCategory(category_id, params) {
  return axios({
    url: `/major/${category_id}`,
    method: 'put',
    data: params
  })
}

// 删除分类
export function deleteCategory(category_id) {
  return axios({
    url: `/major/${category_id}`,
    method: 'delete'
  })
}

// 查询副分类列表
export function getSecondaryCategoryList(params) {
  return axios({
    url: '/minor',
    method: 'get',
    params: params
  })
}

// 添加副分类
export function addSecondaryCategory(params) {
  return axios({
    url: '/minor',
    method: 'post',
    data: params
  })
}

// 修改副分类
export function updateSecondaryCategory(category_id, params) {
  return axios({
    url: `/minor/${category_id}`,
    method: 'put',
    data: params
  })
}

// 删除副分类
export function deleteSecondaryCategory(category_id) {
  return axios({
    url: `/minor/${category_id}`,
    method: 'delete'
  })
}
