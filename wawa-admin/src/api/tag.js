import { axios } from '@/utils/request'

// 查询标签列表
export function getTagList(params) {
  return axios({
    url: '/tags',
    method: 'get',
    params: params
  })
}

// 添加标签
export function addTag(params) {
  return axios({
    url: '/tags',
    method: 'post',
    data: params
  })
}

// 修改标签
export function updateTag(tag_id, params) {
  return axios({
    url: `/tags/${tag_id}`,
    method: 'put',
    data: params
  })
}
