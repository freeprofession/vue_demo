import { axios } from '@/utils/request'

// 查询运费模板列表
export function getFeeTemplateList(params) {
  return axios({
    url: '/fee_templates',
    method: 'get',
    params: params
  })
}

// 添加运费模板
export function addFeeTemplate(params) {
  return axios({
    url: '/fee_templates',
    method: 'post',
    data: params
  })
}

// 修改运费模板
export function updateFeeTemplate(fee_template_id, params) {
  return axios({
    url: `/fee_templates/${fee_template_id}`,
    method: 'put',
    data: params
  })
}

// 获取偏远地区
export function getRemoteAreaList() {
  return axios({
    url: '/fee_templates/remote_areas',
    method: 'get'
  })
}

// 添加偏远地区
export function addRemoteArea(params) {
  return axios({
    url: `/fee_templates/remote_areas`,
    method: 'post',
    data: params
  })
}
