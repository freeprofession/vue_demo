<template>
  <a-card title="订单详情">
    <a href="/order/list" slot="extra">返回</a>
    <div class="item">
      <label for="订单编号">订单编号:</label><span>{{ order.order_no }}</span>
    </div>
    <div class="item">
      <label for="兑换商品">兑换商品:</label><span>{{ order.goods_name }}</span>
    </div>
    <div class="item">
      <label for="兑换商品">规格属性:</label><span>{{ order.attr_name }}</span>
    </div>
    <div class="item">
      <label for="兑换规则">兑换规则:</label><span>{{ order.unit_price }}</span>
    </div>
    <div class="item">
      <label for="兑换数量">兑换数量:</label><span>{{ order.amount }}</span>
    </div>
    <div class="item">
      <label for="所属门店">所属门店:</label><span>{{ order.branch_name }}</span>
    </div>
    <div class="item">
      <label for="订单编号">订单状态:</label><span>{{ order.status | OrderStatusFilter }}</span>
    </div>
    <div class="item">
      <label for="兑换方式">兑换方式:</label><span>{{ order.exchange_type ? '线上' : '门店' }}</span>
    </div>
    <div class="item">
      <label for="下单时间">下单时间:</label><span>{{ order.order_time }}</span>
    </div>
    <template v-if="order.exchange_type">
      <div class="item">
        <label for="收货信息">收货信息:</label><span>{{ order.address.name + ' ' + order.address.phone + ' ' + order.address.address }}</span>
      </div>
      <div class="item">
        <label for="物流信息">物流信息:</label><span>{{ order.courier_company + ' ' + order.courier_no }}</span>
      </div>
    </template>
    <template v-else>
      <div class="item">
        <label for="兑换门店">兑换门店:</label><span>{{ order.branch_name }}</span>
      </div>
    </template>
    <div class="item">
      <label for="备注">备注:</label><span>{{ order.remark }}</span>
    </div>
  </a-card>
</template>
<script>
import { getOrder } from '@/api/order'

export default {
  name: 'Order',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      order: {}
    }
  },
  created() {
    this.getOrder()
  },
  methods: {
    getOrder() {
      getOrder(this.$route.params.id).then(res => {
        this.order = res.data
      })
    }
  }
}
</script>
<style scoped>
.item {
  padding: 0 0 15px 20px;
}
.item label {
  color: rgba(0, 0, 0, 0.85);
}
.item span {
  margin-left: 15px;
}
</style>
