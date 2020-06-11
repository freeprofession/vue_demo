<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="9" :sm="24">
            <a-form-item label="搜索商品" fieldDecoratorId="name">
              <a-input placeholder="名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="9" :sm="24">
            <a-form-item label="供应商" fieldDecoratorId="supplier_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in suppliers" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="24">
            <a-form-item label="筛选" fieldDecoratorId="is_monthly">
                <a-select placeholder="全部商品">
                  <a-select-option :value="0">月内未用过商品</a-select-option>
                  <a-select-option :value="1">月内用过商品</a-select-option>
                </a-select>
              </a-form-item>
          </a-col> -->
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" htmlType='submit'>查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <span class="group-title">
        <a-select placeholder="请选择门店" style="width: 240px" @change="changeType">
          <a-select-option style="width: 240px" v-for="d in branches" :key="d.id">{{ d.name }}</a-select-option>
        </a-select>
      </span>
    </div>         

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <template slot="cover" slot-scope="text,record">
        <span class="pic" @click="previewImage(record)"><img :src="text"></span>
      </template>
      <template slot="type" slot-scope="text, record">
        <p>{{ text }}</p>
        <p>{{ record.specification }}</p>
      </template>
      <template slot="quantity" slot-scope="text,record">
        <input v-model.number="record.quantity" style="width:50px;">
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <!-- <a @click="handleManager(record)">指标数据</a>
          <a-divider type="vertical" /> -->
          <a @click="handleOrder(record)">收藏</a>
        </div>
      </template>
    </s-table>

    <a-modal :visible="previewVisible" :footer="null" size="middle" @cancel="previewVisible=false">
      <img alt="example" style="width: 100%" :src="previewImages" />
    </a-modal>

  </a-card>
</template>
<script>

import STable from '@/components/table/'
import { getOptionList, chooseOption } from '@/api/purchase'
import { getBranchList } from '@/api/branch'
import { getSupplierList } from '@/api/supplier'

export default {
  name: "OptionList",
  components: {
    STable
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      form: null, // 查询参数
      previewVisible:false,
      loading: false,
      searchForm: null,
      queryParam: {},// 表头
      row:{},
      suppliers:[],
      branches:[],
      branch_id:0,
      previewImages:'',
      columns: [
        {
          title: '图片',
          dataIndex: 'cover',
          scopedSlots: { customRender: 'cover' },
        },
        {
          title: '名称',
          dataIndex: 'goods.name'
        },
        {
          title: '规格',
          dataIndex: 'attribute',
          scopedSlots: { customRender: 'type' },
        },
        {
          title: '单价',
          dataIndex: 'purchase_price'
        },
        {
          title: '兑换规则',
          dataIndex: 'goods.exchange_price'
        },
        // {
        //   title: '当前库存',
        //   dataIndex: 'unit_stock'
        // },
        // {
        //   title: '在途库存',
        //   dataIndex: 'transit_stock'
        // },
        // {
        //   title: '周兑换量',
        //   dataIndex: 'week_num'
        // },
        // {
        //   title: '月兑换量',
        //   dataIndex: 'month_num'
        // },
        {
          title: '最低订货量',
          dataIndex: 'min_quantity'
        },
        {
          title: '下单数量',
          dataIndex: 'quantity',
          scopedSlots: { customRender: 'quantity' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }        
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getOptionList(Object.assign(params, this.queryParam))
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
  computed:{
    hasSelected() {
      return this.selectedRows.length > 0
    },
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
    changeType(e) {
      this.branch_id = e
      console.log(e)
    },
    handleSearch(e) {
      e.preventDefault()
      this.queryParam = {
        filter: {
          name: this.searchForm.getFieldValue('name'),
          is_monthly:this.searchForm.getFieldValue('is_monthly'),
          supplier_id: this.searchForm.getFieldValue('supplier_id'),
        }
      }
      this.$refs.table.refresh()
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleOrder (row) {
      this.row=row
      this.row['branch_id']= this.branch_id
      this.row['supplier_id']= this.searchForm.getFieldValue('supplier_id')
      chooseOption(this.row).then(res => {
        if (res.code === 0) {
          this.$message.success('订单已生成')
          this.row={}
          this.$refs.table.refresh()
        }
      })
    },
    previewImage(record){
      this.previewImages = record.cover
      this.previewVisible = true
    }
  },
}
</script>
<style scoped>
.pic {
  width: 60px;
  height: 60px;
}
.pic>img {
  width: 60px;
  height: 60px;
  display: block;
}
</style>
