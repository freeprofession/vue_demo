<template>
  <a-card :bordered="false">
    <a-table
      ref="table"
      size="small"
      :columns="columns"
      :dataSource="mdl"
    >
      <template slot="pic" slot-scope="text">
        <span class="pic"><img :src="text"></span>
      </template>
      <template slot="type" slot-scope="text, record">
        <p>{{ text }}</p>
        <p>{{ record.sku.specification }}</p>
      </template>
    </a-table>

  </a-card>
</template>
<script>
import STable from '@/components/table/'
// import { getBuydetail } from '@/api/smallpurchase'

export default {
  name: "SBuyDetail",
  components: {
    STable
  },
  data() {
    return {
      mdl: [],
      columns: [
        {
          title: '图片',
          dataIndex: 'sku.cover',
          scopedSlots: { customRender: 'pic' },
        },
        {
          title: '我方名称',
          dataIndex: 'goods.name',
        },
        {
          title: '商家方名称',
          dataIndex: 'goods.alias',
        }, 
        {
          title: '规格',
          dataIndex: 'sku.attribute',
          scopedSlots: { customRender: 'type' },
        },
        {
          title: '兑换规则',
          dataIndex: 'goods.exchange_price'
        },
        {
          title: '订货数量',
          dataIndex: 'quantity',
        },
        {
          title: '单价',
          dataIndex: 'sku.purchase_price'
        },
      ]
    }
  },
  created(){
    this.getBuydetail()
  },
  methods: {
    getBuydetail() {
      getBuydetail(this.$route.params.id).then(res => {
        this.mdl = res.data.data
      })
    },
  },
}
</script>
<style scoped>
.pic {
  width: 50px;
  height: 50px;
}
.pic>img {
  width: 50px;
  height: 50px;
  display: block;
}
</style>

