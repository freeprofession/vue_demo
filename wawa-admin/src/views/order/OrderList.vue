<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="8" :sm="12">
            <a-form-item label="订单编号" fieldDecoratorId="order_no">
              <a-input placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="11" :sm="24">
            <a-form-item label="订单日期" fieldDecoratorId="date_range">
              <a-range-picker />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="兑换门店" fieldDecoratorId="branch_id">
                <a-select placeholder="请选择">
                  <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="兑换方式" fieldDecoratorId="exchange_type">
                <a-select placeholder="请选择">
                  <a-select-option :value="0">门店兑换</a-select-option>
                  <a-select-option :value="1">线上直邮</a-select-option>
                  <a-select-option :value="2">线上拼兑</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订单状态" fieldDecoratorId="status">
                <a-select placeholder="请选择">
                  <a-select-option :value="0">待处理</a-select-option>
                  <a-select-option :value="1">待发货</a-select-option>
                  <a-select-option :value="2">已发货</a-select-option>
                  <a-select-option :value="3">已完成</a-select-option>
                  <a-select-option :value="4">已拒绝</a-select-option>
                  <a-select-option :value="5">已退还</a-select-option>
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
      <a-button :loading="downloadLoading" type="primary" size="small" icon="export" @click="handleExport">导出</a-button>
      <a-button :loading="downloadAllLoading" type="primary" size="small" icon="export" @click="handleExportAll">导出全部</a-button>
    </div>
    <s-table
      ref="table"
      size="small"
      :columns="columns"
      :data="loadData"
    >
      <template slot="exchange_type" slot-scope="text">
        {{ text | OrderExchangeFilter }}
      </template>
      <template slot="address" slot-scope="text">
        {{ text.name }},{{ text.phone }},{{ text.address }}
      </template>
      <template slot="status" slot-scope="text">
        {{ text | OrderStatusFilter }}
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="handleView(record)">查看</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="handleDelivery(record)">发货</a>
          <template v-if="record.status > 0 && record.status < 4">
            <a-divider type="vertical" />
            <a @click="handleRefund(record)">退款</a>
          </template>
        </div>
      </template>
    </s-table>

    <a-modal
      title="发货"
      :width="800"
      v-model="visible"
      okText='提交'
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='快递公司'
          fieldDecoratorId="courier_company"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写快递公司名称' }]
          }"
        >
          <a-input placeholder='快递公司' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='快递单号'
          fieldDecoratorId="courier_no"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写快递单号' }]
          }"
        >
          <a-input placeholder='快递单号' />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      title="退款"
      :width="800"
      v-model="Refundvisible"
      okText='提交'
      @ok="handleTrue"
      @cancel="handleFalse"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='退货原因'
          fieldDecoratorId="remark"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写退货原因' }]
          }"
        >
          <a-input placeholder='退货原因' />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import { getOrderList, updateOrder, exportOrders, refund } from '@/api/order'
import { getBranchList } from '@/api/branch'
import router from '@/router'

export default {
  name: 'OrderList',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      Refundvisible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      branches : [],
      form: null,
      mdl: {},
      refunds: {},
      downloadLoading: false,
      downloadAllLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      searchForm: null,
      queryParam: {
        sort: {
          field: 'id',
          reverse: true
        }
      },
      columns: [
      {
        title: '订单编号',
        dataIndex: 'order_no'
      },
      {
        title: '兑换商品',
        dataIndex: 'goods_name',
      },
      {
        title: 'sku',
        dataIndex: 'attr_name',
      },
      {
        title: '兑换规则',
        dataIndex: 'unit_price'
      },
      {
        title: '兑换数量',
        dataIndex: 'amount'
      },
      {
        title: '所属门店',
        dataIndex: 'branch_name',
      },
      {
        title: '兑换方式',
        dataIndex: 'exchange_type',
        scopedSlots: { customRender: 'exchange_type' }
      },
      {
        title: '收货地址',
        dataIndex: 'address',
        width: '180px',
        scopedSlots: { customRender: 'address' },
      },
      {
        title: '下单时间',
        dataIndex: 'order_time'
      },
      {
        title: '状态',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
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
    tHeader: ['供应商','订单编号','用户ID','用户昵称', '兑换商品', '规格', '进价', '兑换规则', '兑换数量', '所属门店', '兑换方式', '收货地址', '下单时间', '状态', '备注','分账','分账记录'],
    filterVal: ['supplier_name','order_no','user_id','nick_name', 'goods_name', 'attr_name', 'purchase_price', 'unit_price', 'amount', 'branch_name', 'exchange_type', 'address', 'order_time', 'status', 'remark','allocation','subsection'],
    // 加载数据方法 必须为 Promise 对象
    loadData: params => {
      return getOrderList(Object.assign(params, this.queryParam))
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
      let filter = {
        order_no: this.searchForm.getFieldValue('order_no'),
        exchange_type: this.searchForm.getFieldValue('exchange_type'),
        branch_id: this.searchForm.getFieldValue('branch_id'),
        status: this.searchForm.getFieldValue('status')
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
      router.push({name: 'ViewOrder', params: {id: row.id}})
    },
    handleDelivery(row) {
      this.visible = true
      this.mdl = row
    },
    handleRefund(row) {
      this.Refundvisible = true
      this.refunds = row
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            courier_company: values.courier_company,
            courier_no: values.courier_no,
            status: 2
          }
          updateOrder(this.mdl.id, params).then(res =>  {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.$refs.table.refresh()
              this.form.resetFields()
              this.mdl = {}
              this.visible = false
            }
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleTrue() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            reason: values.remark,
            status: 7
          }
          refund(this.refunds.id, params).then(res =>  {
            if (res.code === 0) {
              this.$message.success('退款成功')
              this.$refs.table.refresh()
              this.form.resetFields()
              this.refunds = {}
              this.Refundvisible = false
            }
          })
        }
      })
    },  
    handleFalse() {
      this.Refundvisible = false
    },  
    handleExport() {
      this.downloadLoading = true
      exportOrders(this.queryParam).then(res => {
        const list = res.data
        import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(this.filterVal, list)
          excel.export_json_to_excel({
            header: this.tHeader,
            data,
            filename: 'orders',
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      }).catch(() => this.downloadLoading = false)
    },
    handleExportAll() {
      this.downloadAllLoading = true
      exportOrders().then(res => {
        const list = res.data
        import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(this.filterVal, list)
          excel.export_json_to_excel({
            header: this.tHeader,
            data,
            filename: 'all_orders',
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadAllLoading = false
        })
      }).catch(() => this.downloadAllLoading = false)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'exchange_type') {
          if (v[j] > 2 || v[j] < 0) {
            return '未知状态'
          }
          const exchange_type = ['门店自取', '线上直邮', '线上拼兑']
          return exchange_type[v[j]]
        } else if (j === 'address') {
          if (v[j].name) {
            return `${v[j].name},${v[j].phone},${v[j].address }}`
          }
          return ''
        } else if (j === 'status') {
          if (v[j] > 7 || v[j] < 0) {
            return '未知状态'
          }
          const status = ['待处理', '待发货', '已发货', '已完成', '已拒绝','已退还']
          return status[v[j]]
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
