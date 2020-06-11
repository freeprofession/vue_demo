<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="供应商" fieldDecoratorId="supplier_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in suppliers" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="24">
            <a-form-item label="订单日期" fieldDecoratorId="date_range">
              <a-range-picker />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="门店" fieldDecoratorId="branch_id">
                <a-select placeholder="请选择">
                  <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="账期" fieldDecoratorId="is_payment">
                <a-select placeholder="请选择">
                  <a-select-option :value="false">无账期</a-select-option>
                  <a-select-option :value="true">有账期</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 5 || 8" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" htmlType='submit'>查询</a-button>
              <a-button style="margin-left: 6px" @click="handleReset">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
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
      <template slot="is_payment" slot-scope="text">
        {{ text ? '有账期' : '无账期' }}
      </template>
      <template slot="state" slot-scope="text">
        {{ text | SorderStateFilter }}
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="handleView(record)">查看</a>
          <a-divider type="vertical" />
          <a v-if="record.state == 3" @click="handleDelivery(record)">处理</a>
        </div>
      </template>
    </s-table>
  </a-card>
</template>
<script>

import STable from '@/components/table/'
import { getBranchList } from '@/api/branch'
import { getSupplierList } from '@/api/supplier'
import { getAbnormalList, addAbnormal } from '@/api/purchase'
import { getQiniuToken } from '@/api/qiniu'


export default {
  name: "Abnormal",
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
      form: null,
      // 查询参数
      visible:false,
      loading: false,
      downloadLoading:false,
      searchForm: null,
      courier: '',
      advanced: false,
      imgForm: {},
      queryParam: {},
      // 表头
      temp:{},
      branches:[],
      suppliers:[],
      columns: [
        {
          title: '供应商',
          dataIndex: 'supplier_name',
        },
        {
          title: '门店',
          dataIndex: 'branch_name',
        },
        {
          title: '总价',
          dataIndex: 'total_value'
        },
        {
          title: '物流费',
          dataIndex: 'money'
        },
        {
          title: '差价',
          dataIndex: 'bill'
        },
        {
          title: '下单时间',
          dataIndex: 'created'
        },
        {
          title: '账期',
          dataIndex: 'supplier.is_payment',
          scopedSlots: { customRender: 'is_payment' }
        },
        {
          title: '订单状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }    
      ],
      filename: 'xxx',
      autoWidth: true,
      bookType: 'xlsx',
      tHeader: ['图片', '商品名称', '别名', '类型', '规格', '兑换规则', '单价', '数量','门店名称','供应商名称'],
      filterVal: ['cover', 'name', 'alias', 'attribute', 'specification', 'exchange_price','purchase_price', 'quantity', 'purchase.branch_name', 'purchase.supplier_name'],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getAbnormalList(Object.assign(params, this.queryParam)).then(res => {
          return res.data
        })
      },
    }
  },
  created () {
    this.getBranchList()
    this.getSupplierList()
  },
  methods: {
    getBranchList: function () {
      getBranchList().then(res => {
        this.branches = res.data.data
      })
    },
    getSupplierList:function(){
      getSupplierList().then(res => {
        this.suppliers = res.data.data
      })
    },
    handleSearch(e) {
      e.preventDefault()
      let filter = {
        supplier_id: this.searchForm.getFieldValue('supplier_id'),
        branch_id: this.searchForm.getFieldValue('branch_id'),
        is_payment: this.searchForm.getFieldValue('is_payment'),
      }
      const date_range = this.searchForm.getFieldValue('date_range')
      if (date_range) {
          filter['start_date'] = date_range[0].format('YYYY-MM-DD')
          filter['end_date'] = date_range[1].format('YYYY-MM-DD')
      }
      this.queryParam = { filter }
      this.$refs.table.refresh()
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    disabledStartDate (startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate (endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open;
    },
    handleView(row) {
      let routertwo=this.$router.resolve({name: 'Abnormaltail', params: {id: row.id}}) 
      window.open(routertwo.href, '_blank');
    },
    handleDelivery(row){
        const params = {
            id:row.id,
            schedule:1
        }
        addAbnormal(params).then(res =>  {
            if (res.code === 0) {
            this.$message.success('操作成功')
            this.$refs.table.refresh()
            }
        })
    },
  } 
}
</script>

