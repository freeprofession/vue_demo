<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="门店" fieldDecoratorId="branch_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="24">
            <a-form-item label="订单日期" fieldDecoratorId="date_range">
              <a-range-picker />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="供应商" fieldDecoratorId="supplier_id">
                <a-select placeholder="请选择">
                  <a-select-option v-for="item in suppliers" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="账期" fieldDecoratorId="is_payment">
                <a-select placeholder="请选择">
                  <a-select-option :value="0">无账期</a-select-option>
                  <a-select-option :value="1">有账期</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="货款状态" fieldDecoratorId="is_paid">
                <a-select placeholder="请选择">
                  <a-select-option :value="0">未付款</a-select-option>
                  <a-select-option :value="1">已付款</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="运费状态" fieldDecoratorId="un_paid">
                <a-select placeholder="请选择">
                  <a-select-option :value="0">未付款</a-select-option>
                  <a-select-option :value="1">已付款</a-select-option>
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

    <div class="table-operator">
      <a-button type="primary" icon="export" :loading="downloadLoading" @click="handleExport">导出订单</a-button>
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
      <template slot="is_paid" slot-scope="text">
        {{ text ?  '已付款' : '未付款' }}
      </template>
      <template slot="un_paid" slot-scope="text">
        {{ text ?  '已付款' : '未付款' }}
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="handleView(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="handlePay(record)">付款</a>
        </div>
      </template>
    </s-table>

    <a-modal
      title="付款情况"
      :width="600"
      v-model="visible"
      okText='提交'
      @ok="handleOk"
      @cancel="visible = false"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item 
          label="货款费用"
          fieldDecoratorId="is_paid"
          :fieldDecoratorOptions="{
              rules: [{ required: true }],
              initialValue: temp.is_paid,
          }"
        >
          <a-radio-group name="radioGroup">
              <a-radio :value="false">未付款</a-radio>
              <a-radio :value="true">已付款</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item 
          label="物流费用"
          fieldDecoratorId="un_paid"
          :fieldDecoratorOptions="{
              rules: [{ required: true }],
              initialValue: temp.un_paid,
          }"
        >
          <a-radio-group name="radioGroup">
              <a-radio :value="false">未付款</a-radio>
              <a-radio :value="true">已付款</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

  </a-card>
</template>
<script>

import STable from '@/components/table/'
import { getBranchList } from '@/api/branch'
import { getSupplierList } from '@/api/supplier'
import { getPayorderList, updatePaying, exportAllList } from '@/api/purchase'



export default {
  name: "PayList",
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
          title: '货款状态',
          dataIndex: 'is_paid',
          scopedSlots: { customRender: 'is_paid' },
        },
        {
          title: '运费状态',
          dataIndex: 'un_paid',
          scopedSlots: { customRender: 'un_paid' },
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
      tHeader: ['门店名称','供应商名称','总价','账期','订单状态','货款状态','运费状态','差价','差价原因','物流费','物流公司'],
      filterVal: ['branch_name', 'supplier_name', 'total_value', 'supplier.is_payment', 'state', 'is_paid','un_paid','bill', 'note', 'money','company'],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getPayorderList(Object.assign(params, this.queryParam)).then(res => {
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
        is_paid: this.searchForm.getFieldValue('is_paid'),
        un_paid: this.searchForm.getFieldValue('un_paid')
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
      let routertwo=this.$router.resolve({name: 'BuyDetail', params: {id: row.id}}) 
      window.open(routertwo.href, '_blank');
    },
    handlePay(row) {
      this.visible = true
      this.temp= row
    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            is_paid: values.is_paid,
            un_paid: values.un_paid,
          }
          updatePaying(this.temp.id,params).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.visible = false
              this.temp={}
              this.$refs.table.refresh()
            }
          })
        }
      })
    },
    handleExport() {
      this.downloadLoading = true
      exportAllList(this.queryParam).then(res => {
        const list = res.data
        import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(this.filterVal, list)
          excel.export_json_to_excel({
            header: this.tHeader,
            data,
            filename: 'order',
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      }).catch(() => this.downloadLoading = false)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'supplier.is_payment') {
          return v[j] ? '有账期' : '无账期'
        } else if (j === 'state') {
          if (v[j] > 5 || v[j] < 0) {
            return '未知状态'
          }
          const state = ['待处理', '在途', '到货正常', '到货异常', '退换处理','退款处理']
          return state[v[j]]
        } else if (j === 'is_paid') {
          return v[j] ? '已付款' : '未付款'
        } else if (j === 'un_paid') {
          return v[j] ? '已付款' : '未付款'
        } else {
          return v[j]
        }
      }))
    }
  },
  
}
</script>

