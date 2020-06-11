<template>
  <a-card :bordered="false">
    <a-table
      ref="table"
      :columns="columns"
      :dataSource="mdl"
    >
      <template slot="pic" slot-scope="text">
        <span class="pic"><img :src="text"></span>
      </template>
      <template slot="type" slot-scope="text, record">
        <p>{{ text }}</p>
        <p>{{ record.stock.sku.specification }}</p>
      </template>
      <template slot="schedule" slot-scope="text">
        {{ text ? '退换货' : '未处理' }}
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a v-if="!record.schedule" @click="handleView(record)">退换</a>
          <a-divider type="vertical" />
          <a v-if="!record.schedule" @click="handleDelete(record)">退款</a>
        </div>
      </template>
    </a-table>

  </a-card>
</template>
<script>
import STable from '@/components/table/'
// import { getAbnormaltail,updateAbnormaltail,deleteAbnormaltail } from '@/api/smallpurchase'

export default {
  name: "SAbnormaltail",
  components: {
    STable
  },
  data() {
    return {
      mdl: [],
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
          title: '单价',
          dataIndex: 'stock.sku.purchase_price'
        },
        {
          title: '在途数量',
          dataIndex: 'transit_stock'
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
      ]
    }
  },
  created(){
    this.getAbnormaltail()
  },
  methods: {
    getAbnormaltail() {
      getAbnormaltail(this.$route.params.id).then(res => {
        this.mdl = res.data.data
      })
    },
    handleView(row){
        const params = {
            schedule:1
        }
        updateAbnormaltail(row.id,params).then(res =>  {
            if (res.code === 0) {
            this.$message.success('操作成功')
            this.getAbnormaltail()
            }
        })
    },
    handleDelete(row){
        deleteAbnormaltail(row.id).then(res =>  {
            if (res.code === 0) {
            this.$message.success('操作成功')
            this.getAbnormaltail()
            }
        })
    }
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

