<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="搜索商品" fieldDecoratorId="name">
              <a-input placeholder="昵称"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="兑换门店" fieldDecoratorId="branch_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="24">
              <a-form-item label="兑换方式" fieldDecoratorId="difference">
                <a-select placeholder="请选择">
                  <a-select-option :value="0">无差异</a-select-option>
                  <a-select-option :value="1">有差异</a-select-option>
                </a-select>
              </a-form-item>
          </a-col> -->
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" htmlType='submit'>查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" @click="handleSelect">复盘</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <template slot="cover" slot-scope="text">
          <span class="pic"><img :src="text"></span>
      </template>  
      <template slot="name" slot-scope="text, record">
        <p>{{ text }}</p>
        <p>{{ record.sku.attribute }}</p>
      </template>
      <template slot="check_stock" slot-scope="text,record">
        <input v-model.number="record.check_stock" :defaultValue="null" style="width:50px;">
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a :disabled="record.difference" @click="handleSubmit(record)">提交</a>
        </div>
      </template>

    </s-table>
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
import { getInventory, Inventory } from '@/api/stock'
import { getBranchList } from '@/api/branch'

export default {
  name: "InventoryList",
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
      branches:[],
      differ:0,
      queryParam: {},
      // 表头
      columns: [
        {
          title: '图片',
          dataIndex: 'sku.cover',
          scopedSlots: { customRender: 'cover' },
        },
        {
          title: '名称',
          dataIndex: 'info.goods_name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '兑换价格',
          dataIndex: 'info.sale_price'
        },
        {
          title: '所属门店',
          dataIndex: 'info.branch_name'
        },
        // {
        //   title: '系统库存',
        //   dataIndex: 'unit_stock'
        // },
        {
          title: '盘点库存',
          dataIndex: 'check_stock',
          scopedSlots: { customRender: 'check_stock' },
        },
        {
          title: '库存差异',
          dataIndex: 'difference',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getInventory(Object.assign(params, this.queryParam))
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
    handleSubmit(row){
      Inventory(row).then(res =>{
        if (res.code === 0) {
          this.$refs.table.refresh()
          this.$message.success('提交成功')
        }
      })
    },
    handleSelect(){
      let routerone=this.$router.resolve({name: 'ReviewInventory'}) 
      window.open(routerone.href, '_blank');
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