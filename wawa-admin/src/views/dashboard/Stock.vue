<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="搜索商品" fieldDecoratorId="name">
              <a-input placeholder="昵称"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="兑换门店" fieldDecoratorId="branch_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" htmlType='submit'>查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
        <template slot="goods_pic" slot-scope="text">
            <span class="pic"><img :src="text"></span>
        </template>
        <template slot="is_listing" slot-scope="text">
            {{ text ? '上架' : '未上架' }}
        </template>
        <a-table
            size="small"
            slot="expandedRowRender" 
            slot-scope="record"
            :columns="innerColumns"
            :dataSource="record.stocks.filter(item=>item.deleted==0)"
            :pagination="false"
        >
            <template slot="cover" slot-scope="text">
                <span class="pic"><img :src="text"></span>
            </template>
        </a-table>
    </s-table>
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
import { getStockList } from '@/api/stock'
import { getBranchList } from '@/api/branch'

export default {
  name: "StockList",
  components: {
    AInput,
    STable
  },
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      form: null,
      mdl: {},
      // 查询参数
      searchForm: null,
      queryParam: {},
      // 表头
      branches:[],
      columns: [
        {
          title: '图片',
          dataIndex: 'goods_pic',
          scopedSlots: { customRender: 'goods_pic' },
        },
        {
          title: 'SPU',
          dataIndex: 'goods_spu'
        },
        {
          title: '名字',
          dataIndex: 'goods_name'
        },
        {
          title: '是否上架',
          dataIndex: 'is_listing',
          scopedSlots: { customRender: 'is_listing' },
        },
        {
          title: '兑换价格',
          dataIndex: 'sale_price'
        },
        {
          title: '总库存',
          dataIndex: 'total_stock',
          sorter: true,
          needTotal: true
        },
        {
          title: '所属门店',
          dataIndex: 'branch_name'
        },
      ],
      stocks:[],
      innerColumns: [
        {
          title: '图片',
          dataIndex: 'sku.cover',
          scopedSlots: { customRender: 'cover' },
        },
        {
          title: 'SKU',
          dataIndex: 'sku.attribute'
        },
        {
          title: '在途库存',
          dataIndex: 'transit_stock',
        },
        {
          title: '当前库存',
          dataIndex: 'unit_stock',
        },

      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getStockList(Object.assign(params, this.queryParam))
          .then(res => {
            return res.data
          })
      },
    }
  },
  created () {
    this.getBranchList()
  },
  methods: {
    getBranchList: function () {
      getBranchList().then(res => {
        this.branches = res.data.data
      })
    },
    handleSearch(e) {
      e.preventDefault()
      this.queryParam = {
        filter: {
          name: this.searchForm.getFieldValue('name'),
          branch_id: this.searchForm.getFieldValue('branch_id'),
        }
      }
      this.$refs.table.refresh()
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
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

