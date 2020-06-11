<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <!-- <a-button type="primary" @click="handleAdd" icon="plus">新建</a-button> -->
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <template slot="pic_url" slot-scope="text">
        <span><img :src="text" style="width: 64px; height: 64px;"></span>
      </template>
      <template slot="status" slot-scope="text">
        {{ text | OrderStatusFilter }}
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations' v-if="record.status === 0">
          <a @click="handleReview(record, 1)">同意</a>
          <a-divider type="vertical" />
          <a @click="handleReview(record, 0)">拒绝</a>
        </div>
      </template>
    </s-table>
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import { getBranchOrderList, checkOrder } from '@/api/manage'

export default {
  name: 'Exchange',
  components: {
    STable
  },
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
      // 查询参数
      queryParam: {

      },
      // 表头
      columns: [
        {
          title: '订单号',
          dataIndex: 'order_no'
        },
        {
          title: '商品图',
          dataIndex: 'pic_url',
          scopedSlots: { customRender: 'pic_url' },
        },
        {
          title: '商品名',
          dataIndex: 'goods_name',
        },
        {
          title: '兑换人',
          dataIndex: 'nickname',
        },
        {
          title: '娃娃数',
          dataIndex: 'amount',
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getBranchOrderList(Object.assign(params, this.queryParam))
          .then(res => {
            return res.data
          })
      },
    }
  },
  methods: {
    handleReview(order, check) {
      const _this = this
      let text = '确定同意该兑换吗'
      if (status === 4) {
        text = '确定拒绝该兑换吗'
      }
      this.$confirm({
        title: '警告',
        content: text,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          checkOrder(order.id, check).then(res => {
            if (res.code === 0) {
              _this.$message.success('处理成功')
              _this.$refs.table.refresh()
            }
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      })
    }
  }
}
</script>
