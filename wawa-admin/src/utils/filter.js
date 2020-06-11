import Vue from "vue";
import * as dayjs from "dayjs";

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  let intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

Vue.filter('OrderStatusFilter', function (value) {
  if (value > 7 || value < 0) {
    return '未知状态'
  }
  // 0:待处理 1:待发货 2:已发货 3:已完成 4: 已拒绝 5:未拼成 6:待拼成
  const status = ['待处理', '待发货', '已发货', '已完成', '已拒绝','已退款', '未拼成', '待拼成',]
  return status[value]
})

Vue.filter('OrderExchangeFilter', function (value) {
  if (value > 2 || value < 0) {
    return '未知状态'
  }
  const exchange_type = ['门店自取', '线上直邮', '线上拼兑']
  return exchange_type[value]
})

//地址筛选
Vue.filter('AreaFilter', function (areas) {
  if (!areas) {
    return ''
  }
  let names = []
  for (let area of areas) {
    names.push(area.name)
  }
  return names.join(', ')
})
//价格筛选
Vue.filter('PriceFilter', function(price, or_price) {
  if (price){
    return price
  }else{
    return or_price
  }
})
//状态筛选
Vue.filter('SorderStateFilter', function (value) {
  if (value > 5 || value < 0) {
    return '未知状态'
  }
  const status = ['待处理', '在途', '到货正常', '到货异常', '正在退换','处理完成']
  return status[value]
})



