<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="11" :sm="24">
            <a-form-item label="订单日期" fieldDecoratorId="date_range">
              <a-range-picker />
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
    <h2>兑换数据</h2>
    <a-table
      size="small"
      :columns="columns"
      :dataSource="change"
    >
    </a-table>
    <h2>充值数据</h2>
    <a-table
      size="small"
      :columns="Columns"
      :dataSource="recharge"
    >
    </a-table>
  </a-card>
</template>
<script>

import STable from '@/components/table/'
import { getOrderData,getRechargeData } from '@/api/order'

export default {
  name: "OrderData",
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      form: null,
      // 查询参数
      searchForm: null,
      queryParam: {},
      recharge:[],
      change:[],
      columns: [
        {
          title: '兑换门店',
          dataIndex: 'order_branch',
        },
        {
          title: '兑换单数',
          dataIndex: 'amount'
        },
        {
          title: '兑换抓机娃娃数',
          dataIndex: 'total_price'
        }
      ],
      Columns: [
        {
          title: '充值门店',
          dataIndex: 'recharge_branch'
        },
        {
          title: '充值娃娃个数',
          dataIndex: 'doll'
        }
      ],
    }
  },
  methods: {
    getRechargeData: function () {
      getRechargeData(this.queryParam).then(res => {
        this.recharge = res.data
      })
    },
    getOrderData: function () {
      getOrderData(this.queryParam).then(res => {
        this.change = res.data
      })
    },
    handleSearch(e) {
      e.preventDefault()
      let filter={}
      const date_range = this.searchForm.getFieldValue('date_range')
      if (date_range) {
          filter['start_date'] = date_range[0].format('YYYY-MM-DD')
          filter['end_date'] = date_range[1].format('YYYY-MM-DD')
      }
      this.queryParam = { filter }
      this.getOrderData()
      this.getRechargeData()
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
    },
  },
}
</script>