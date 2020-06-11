<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="供应商" fieldDecoratorId="supplier_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in suppliers" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="门店" fieldDecoratorId="branch_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="订单状态" fieldDecoratorId="state">
              <a-select placeholder="请选择">
                <a-select-option :value="1">在途</a-select-option>
                <a-select-option :value="3">异常到货</a-select-option>
                <a-select-option :value="4">正在退换</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" htmlType='submit'>查询</a-button>
              <a-button style="margin-left: 3px" @click="handleReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
    >
      <template slot="pic" slot-scope="text,record">
        <span class="courier" @click="previewImage(record)"><img :src="text"></span>
      </template>
      <template slot="state" slot-scope="text">
        {{ text | SorderStateFilter }}
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="handleView(record)">收货</a>
          <a-divider type="vertical" />
          <a @click="handleNormal(record)">到货正常</a>
          <a-divider type="vertical" />
          <a @click="handleAbnormal(record)">到货异常</a>
        </div>
      </template>
    </s-table>

    <a-modal :visible="previewVisible" :footer="null" size="middle" @cancel="previewVisible=false">
      <div class="item">
        <label>物流信息:</label><span>{{ this.company }}</span>
      </div>
      <img alt="example" style="width: 100%" :src="previewImages" />
    </a-modal>
  </a-card>
</template>
<script>

import STable from '@/components/table/'
import { getWayallstock, updateAllstock } from '@/api/stock'
import { getBranchList } from '@/api/branch'
import { getSupplierList } from '@/api/supplier'


export default {
  name: "WayGoods",
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
      loading: false,
      searchForm: null,
      previewVisible:false,
      previewImages:'',
      company:'',
      queryParam:{},
      branches:[],
      suppliers:[],
      columns: [ 
        {
          title: '物流信息',
          dataIndex: 'courier',
          scopedSlots: { customRender: 'pic' },
        },
        {
          title: '订单编号',
          dataIndex: 'purchase_no',
        },
        {
          title: '供应商',
          dataIndex: 'supplier_name',
        },
        {
          title: '门店',
          dataIndex: 'branch_name',
        },
        {
          title: '订单时间',
          dataIndex: 'created'
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

      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getWayallstock(Object.assign(params, this.queryParam))
          .then(res => {
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
    getSupplierList: function() {
      getSupplierList().then(res =>{
        this.suppliers = res.data.data
      })
    },
    handleNormal(row) {
      const params = {
        id:row.id,
        state: 2
      }
      updateAllstock(params).then(res =>  {
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        }
      })
    },
    handleAbnormal(row) {
      const params = {
        id:row.id,
        state: 3
      }
      updateAllstock(params).then(res =>  {
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        }
      })
    },
    handleSearch(e) {
      e.preventDefault()
      let filter = {
        supplier_id: this.searchForm.getFieldValue('supplier_id'),
        branch_id: this.searchForm.getFieldValue('branch_id'),
        state: this.searchForm.getFieldValue('state'),
      }
      this.queryParam = { filter }
      this.$refs.table.refresh()
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleView(row) {
      let routertwo=this.$router.resolve({name: 'WayGoodsList', params: {id: row.id}}) 
      window.open(routertwo.href, '_blank');
    },
    previewImage(record){
      this.previewImages = record.courier
      this.company = record.company
      this.previewVisible = true
    }
  },
}
</script>
<style scoped>
.courier {
  width: 40px;
  height: 40px;
}
.courier>img {
  width: 40px;
  height: 40px;
  display: block;
}
.item {
  padding: 0 0 15px 20px;
}
.item label {
  color: rgba(0, 0, 0, 0.85);
}
.item span {
  margin-left: 15px;
}
.red {
  background: #ff5845;
}
.blue{
  background: #fcfcfc;
}
</style>

