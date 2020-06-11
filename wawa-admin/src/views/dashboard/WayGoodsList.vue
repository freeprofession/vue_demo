<template>
  <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <template slot="pic" slot-scope="text">
        <span class="pic"><img :src="text"></span>
      </template>
      <template slot="type" slot-scope="text, record">
        <p>{{ text }}</p>
        <p>{{ record.stock.sku.specification }}</p>
      </template>
      <template slot="get_num" slot-scope="text,record">
        <a-input v-model.number="record.get_num" style="width:50px;"/>
      </template> 
      <template slot="schedule" slot-scope="text">
        {{ text ? '退换货' : '未处理' }}
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="handleList(record)">上架</a>
        </div>
      </template>    
    </s-table>
  </a-card>
</template>
<script>

import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
import { getWaystock, addWaystock } from '@/api/stock'

export default {
  name: "WayGoodsList",
  components: {
    AInput,
    STable
  },
  data() {
    return {
      loading: false,
      get_num:0,
      columns: [
        {
          title: '图片',
          dataIndex: 'stock.sku.cover',
          scopedSlots: { customRender: 'pic' },
        },
        {
          title: '名称',
          dataIndex: 'stock.info.goods_name',     
        },
        {
          title: '规格',
          dataIndex: 'stock.sku.attribute',
          scopedSlots: { customRender: 'type' },
        },
        {
          title: '兑换规则',
          dataIndex: 'stock.info.sale_price'
        },
        {
          title: '门店库存',
          dataIndex: 'stock.unit_stock'
        },
        {
          title: '在途数量',
          dataIndex: 'transit_stock'
        },
        {
          title: '到货数量',
          dataIndex: 'get_num',
          scopedSlots: { customRender: 'get_num' },
        },
        {
          title: '处理情况',
          dataIndex: 'schedule',
          scopedSlots: { customRender: 'schedule' },
        }, 
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }         
      ],
      loadData: params => {
        return getWaystock(this.$route.params.id, params)
          .then(res => {
            return res.data
          })
      },
    }
  },
  methods: {
    handleList (row) {
      const params={
        get_num: row.get_num
      }
      addWaystock(row.id,params).then(res => {
        if (res.code === 0) {
          this.$message.success('上架成功')
          this.$refs.table.refresh()
        }
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