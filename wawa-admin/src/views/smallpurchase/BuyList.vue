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
            <a-col :md="8" :sm="24">
              <a-form-item label="订单状态" fieldDecoratorId="state">
                <a-select placeholder="请选择">
                  <a-select-option :value="0">待处理</a-select-option>
                  <a-select-option :value="1">在途</a-select-option>
                  <a-select-option :value="2">正常到货</a-select-option>
                  <a-select-option :value="3">异常到货</a-select-option>
                  <a-select-option :value="4">正在退换</a-select-option>
                  <a-select-option :value="5">处理完成</a-select-option>
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
          <a @click="handleUpload(record)">物流</a>
          <a-divider type="vertical" />
          <a v-if="record.state == 0" @click="handleDelivery(record)">发货</a>
          <a-divider type="vertical" />
          <a @click="handleExport(record)">导出</a>
        </div>
      </template>
    </s-table>

    <a-modal
      title="物流情况"
      :width="600"
      v-model="visible"
      okText='提交'
      @ok="handleOk"
      @cancel="visible = false"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item label="物流公司">
          <a-input v-model="temp.company" placeholder="请输入物流公司" />
        </a-form-item>
        <a-form-item
          label="物流单"
          fieldDecoratorId="courier"
          :fieldDecoratorOptions="{rules: [{ required: false, message: '请上传物流单'}],
            initialValue: temp.courier
          }"
        >
          <a-upload
            name="file"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            action="//upload.qiniup.com"
            :beforeUpload="beforeCoverUpload"
            :data="imgForm"
            @change="handleCoverChange"
          >
            <img width=200 height=128 v-if="courier" :src="courier" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="物流费">
          <a-input v-model="temp.money" placeholder="请输入物流费" />
        </a-form-item>
        <a-form-item label="差价">
          <a-input v-model="temp.bill" placeholder="请输入差价" />
        </a-form-item>
        <a-form-item label="差价原因">
          <a-input v-model="temp.note" placeholder="请输入差价原因" />
        </a-form-item>
      </a-form>
    </a-modal>

  </a-card>
</template>
<script>

import STable from '@/components/table/'
import { getBranchList } from '@/api/branch'
import { getSupplierList } from '@/api/supplier'
// import { getSorderList, updateList, updateLogistics, exportList } from '@/api/smallpurchase'
// import { getQiniuToken } from '@/api/qiniu'


export default {
  name: "SBuyList",
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
        return getSorderList(Object.assign(params, this.queryParam)).then(res => {
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
        state: this.searchForm.getFieldValue('state')
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
    beforeCoverUpload: function () {
      let _this = this
      return getQiniuToken().then(res => {
        _this.bucketHost = res.data.bucketHost
        _this.imgForm = {
          // key: res.key,
          token: res.data.token
        }
      })
    },
    handleCoverChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
      } else if (info.file.status === 'done') {
        let key = info.file.response.key
        this.courier = `${this.bucketHost}${key}`
        this.loading = false
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error('上传图片失败，请重试')
      } else if (info.file.status === 'removed') {
        console.log('removed')
      }
    },
    handleUpload(row) {
      this.visible = true
      this.temp= row
      this.courier = row.courier
    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            company: this.temp.company,
            courier: this.courier,
            money: this.temp.money,
            bill: this.temp.bill,
            note: this.temp.note,
          }
          updateLogistics(this.temp.id,params).then(res => {
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
    handleDelivery(row){
      if (row.state==0){
        const params = {
          id:row.id,
          supplier_id:row.supplier_id,
          branch_id:row.branch_id,
          state:1
        }
        updateList(params).then(res =>  {
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.$refs.table.refresh()
          }
        })
      } 
    },
    handleExport(row) {
      this.downloadLoading = true
      const params={
        id : row.id
      }
      exportList(params).then(res => {
        const list = res.data
        import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(this.filterVal, list)
          excel.export_json_to_excel({
            header: this.tHeader,
            data,
            filename: row.branch_name+row.supplier_name+row.created,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      }).catch(() => this.downloadLoading = false)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  },
  
}
</script>

