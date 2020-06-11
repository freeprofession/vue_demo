<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="9" :sm="24">
            <a-form-item label="兑换门店" fieldDecoratorId="branch_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="9" :sm="24">
            <a-form-item label="供应商" fieldDecoratorId="supplier_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in suppliers" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
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
      <a-button type="primary" @click="handleList" :loading="loading">生成订单</a-button>
      <a-button type="primary" icon="export" :loading="downloadLoading" @click="handleExport">导出订单</a-button>
    </div>

    <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
    >
      <template slot="type" slot-scope="text, record">
        <p>{{ text }}</p>
        <p>{{ record.specification }}</p>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a-popconfirm title="确定删除此商品吗？" @confirm="handleDelete(record)" okText="是" cancelText="否">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </template>
    </s-table>

    <a-modal
      title="确认订单"
      v-model="visible"
      okText='提交'
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <P>{{ total }}</P>
    </a-modal>
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import { getCartList, sureCart, deleteCart,exportCart,getTotal } from '@/api/purchase'
import { getBranchList } from '@/api/branch'
import { getSupplierList } from '@/api/supplier'

export default {
  name: "Cart",
  components: {
    STable
  },
  data() {
    return {
      visible:false,
      queryParam: {},
      branches:[],
      suppliers:[],
      choose:{},
      total:'',
      loading:false,
      downloadLoading: false,
      columns: [
        {
          title: '商家方名称',
          dataIndex: 'goods_alias',
        },
        {
          title: '我方名称',
          dataIndex: 'goods_name',
        },
        {
          title: '规格',
          dataIndex: 'attribute',
          scopedSlots: { customRender: 'type' },
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
          title: '订货数量',
          dataIndex: 'quantity',
        },
        {
          title: '单价',
          dataIndex: 'purchase_price'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      filename: 'xxx',
      autoWidth: true,
      bookType: 'xlsx',
      tHeader: ['图片', '供应商', '门店', '名称', '别名', '规格', '尺寸', '兑换规则', '数量', '单价', '总价'],
      filterVal: ['cover', 'supplier_name', 'branch_name', 'goods_name', 'goods_alias', 'attribute', 'specification', 'goods_price', 'quantity', 'purchase_price','total_value'],
      loadData: params => {
        return getCartList(Object.assign(params, this.queryParam)).then(res => {
          return res.data
        })
      },
    }
  },
  created(){
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
    handleDelete(row) {
      deleteCart(row.id).then(res => {
        if (res.code === 0) {
          this.$refs.table.refresh()
          this.$message.success('删除成功')
        }
      })
    },
    handleSearch(e) {
      e.preventDefault()
      this.queryParam = {
        filter: {
          branch_id: this.searchForm.getFieldValue('branch_id'),
          supplier_id: this.searchForm.getFieldValue('supplier_id'),
        }
      }
      this.$refs.table.refresh()
    },
    handleReset(){
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleList () {
      this.choose['branch_id']= this.searchForm.getFieldValue('branch_id'),
      this.choose['supplier_id']= this.searchForm.getFieldValue('supplier_id')
      if (this.choose){
        this.visible = true
        getTotal(this.choose).then(res => {
          if (res.code ===0){
            this.total = res.data
          }
        })
      }else{
        this.visible = false
        this.$message.error('未选择供应商或门店');
        this.choose = {}
      }
    },
    handleOk (){
      this.loading = true
      sureCart(this.choose).then(res => {
        if (res.code === 0) {
          this.$message.success('上架成功')
          this.loading = false
          this.choose={}
          this.visible = false
          this.$refs.table.refresh()
        }
      })
    },
    handleCancel(){
      this.visible = false
      this.choose = {}
    },
    handleExport() {
      this.downloadLoading = true
      exportCart(this.queryParam).then(res => {
        const list = res.data
        import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(this.filterVal, list)
          excel.export_json_to_excel({
            header: this.tHeader,
            data,
            filename: 'unsure_orders',
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      }).catch(() => this.downloadLoading = false)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'total_value'){
          return v['purchase_price']*v['quantity']
        }else{
          return v[j]
        }       
      }))
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


