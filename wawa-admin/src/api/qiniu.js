import { axios } from '@/utils/request'

export function getQiniuToken() {
  return axios({
    url: '/qiniu/token',
    method: 'get'
  })
}
