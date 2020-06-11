import { axios } from '@/utils/request'

// 查询供应商列表
export function getSupplierList(params) {
  return axios({
    url: '/supplier',
    method: 'get',
    params
  })
}

// 添加供应商
export function addSupplier(params) {
  return axios({
    url: '/supplier',
    method: 'post',
    data: params
  })
}

// 修改供应商
export function updateSupplier(supplier_id, params) {
  return axios({
    url: `/supplier/${supplier_id}`,
    method: 'put',
    data: params
  })
}

// 删除供应商
export function deleteSupplier(supplier_id) {
  return axios({
    url: `/supplier/${supplier_id}`,
    method: 'delete'
  })
}

// 添加付款信息
export function addContact(params) {
  return axios({
    url: '/contact',
    method: 'post',
    data: params
  })
}

// 修改付款信息
export function updateContact(contact_id, params) {
  return axios({
    url: `/contact/${contact_id}`,
    method: 'put',
    data: params
  })
}

// 删除付款信息
export function deleteContact(contact_id) {
  return axios({
    url: `/contact/${contact_id}`,
    method: 'delete'
  })
}