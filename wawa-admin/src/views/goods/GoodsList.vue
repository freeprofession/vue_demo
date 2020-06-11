<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="12">
          <a-col :md="6" :sm="12">
            <a-form-item label="产品名称" fieldDecoratorId="name">
              <a-input placeholder="请输入产品名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label="主类别" fieldDecoratorId="major_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="item in major_category" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label="副类别" fieldDecoratorId="minor_id">
              <a-select placeholder="请选择">
                <a-select-option v-for="d in minor_category" :key="d.id">{{ d.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="12">
              <a-form-item label="兑换方式" fieldDecoratorId="is_online">
                <a-select placeholder="请选择">
                  <a-select-option :value="0">门店兑换</a-select-option>
                  <a-select-option :value="1">线上直邮</a-select-option>
                  <a-select-option :value="2">线上拼兑</a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" htmlType='submit'>查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
    </div>
    <s-table
      ref="table"
      size="middle"
      :columns="columns"
      :data="loadData"
    >
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="showInfoList(record)">管理商品</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除此商品吗？" @confirm="handleDelete(record)" okText="是" cancelText="否">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </template>
    </s-table>

    <a-modal
      :title="selectedGoods.name"
      :width="900"
      v-model="infoListVisible"
      @ok="handleOk" 
      @cancel="infoListVisible = false"
    >
      <div class="wawa-info">
        <div class="wawa-info-group" v-for="(info, index) in infoList" :key="info.id">
          <h3 class="group-title">
            <a-select v-model="info.branch_id" placeholder="请选择门店" style="width: 240px">
              <a-select-option style="width: 200px" v-for="d in filterBranches(index)" :key="d.id">{{ d.name }}</a-select-option>
            </a-select>
          </h3>
          <div class="group-container">
            <a-form layout="inline">
              <a-row class="form-row" :gutter="10">
                <a-col :md="8" :sm="24">
                  <a-form-item label='状态'>
                    <a-radio-group name="radioGroup" v-model="info.is_listing">
                      <a-radio :value="true">上架</a-radio>
                      <a-radio :value="false">下架</a-radio>
                    </a-radio-group>
                  </a-form-item>

                  <a-form-item label="是否推荐">
                    <a-radio-group name="radioGroup" v-model="info.recommended">
                      <a-radio :value="true">推荐</a-radio>
                      <a-radio :value="false">不推荐</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="标签">
                    <a-checkbox-group :options="fTags" v-model="info.tids" />
                  </a-form-item>

                  <a-form-item label="权重">
                    <a-input v-model="info.weights" placeholder="请输入权重" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="价格">
                    <span>{{ info.sale_price | PriceFilter(info.exchange_price) }}</span>
                  </a-form-item>

                  <a-form-item label="折扣">
                    <a-input v-model="info.discount" placeholder="请输入折扣" />
                  </a-form-item>
                </a-col>
                <a-col :md="24" :sm="24">
                  <a-form-item label='库存变更'>
                    <template v-if="info.stock && info.stock.length > 0">
                      <a-table
                        :columns="skuColumns"
                        :dataSource="info.stock"
                        :pagination="false"
                        size="small"
                        bordered
                      >
                        <template slot="add_stock" slot-scope="text, record">
                          <a-input 
                            style="width: 70px;"
                            v-model.number="record.add_stock"
                          />
                        </template>
                      </a-table>
                    </template>
                    <template v-else>
                      <span>当前库存: {{ info.unit_stock }}</span>
                      <span>增加库存:<a-input v-model.number="info.add_stock" placeholder="请输入库存变更量" /></span>
                    </template>
                    
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div> 
        </div>
        <div class="wawa-info-group">
          <h3 class="group-title"><a-button type="primary" @click="addInfo">添加</a-button></h3>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import { getGoodsList, deleteGoods } from '@/api/goods'
import { getGoodsInfoList, updateInfos } from '@/api/info'
import { getCategoryList, getSecondaryCategoryList } from '@/api/category'
import { getBranchList } from '@/api/branch'
import { getTagList } from '@/api/tag'

export default {
  name: 'GoodsList',
  components: {
    STable
  },
  data() {
    return {
      infoVisible: false, // 修改添加门店
      infoListVisible: false, // 门店列表
      selectedGoods:{},
      major_category: [],
      minor_category: [],
      tags: [],
      fTags: [], // 过滤后标签列表
      tids: [],
      branches : [],
      form: null,
      infoForm: null,
      info: {},
      skus: [],
      stock:[],
      // 查询参数
      searchForm: null,
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'SPU',
          dataIndex: 'spu'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '主类别',
          dataIndex: 'major.name'
        },
        {
          title: '副类别',
          dataIndex: 'minor.name'
        },
        {
          title: '兑换个数',
          dataIndex: 'exchange_price',
          sorter: true,
          needTotal: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      infoList: [],
       // 门店表表头
      skuColumns: [
        {
          title: 'SKU',
          dataIndex: 'attribute',
        },
        {
          title: '当前库存',
          dataIndex: 'unit_stock',
          width: '75px'
        },
        {
          title: '增加库存',
          dataIndex: 'add_stock',
          width: '75px',
          scopedSlots: { customRender: 'add_stock' }
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getGoodsList(Object.assign(params, this.queryParam))
          .then(res => {
            return res.data
          })
      },
    }
  },
  created () {
    this.getCategoryList()
    this.getSecondaryCategoryList()
    this.getBranchList()
    this.getTagList()
  },
  methods: {
    getCategoryList: function () {
      getCategoryList().then(res => {
        this.major_category = res.data.data
      })
    },
    getSecondaryCategoryList: function () {
      getSecondaryCategoryList().then(res => {
        this.minor_category = res.data.data
      })
    },
    getBranchList: function () {
      getBranchList().then(res => {
        this.branches = res.data.data
      })
    },
    getTagList() {
      getTagList().then(res => {
        this.tags = res.data.data.map(item => {
          return {
            value: item.id,
            label: item.name,
            type: item.exchange_type
          }
        })
      })
    },
    handleSearch(e) {
      e.preventDefault()
      this.queryParam = {
        filter: {
          name: this.searchForm.getFieldValue('name'),
          major_id: this.searchForm.getFieldValue('major_id'),
          minor_id: this.searchForm.getFieldValue('minor_id'),
          is_online: this.searchForm.getFieldValue('is_online'),
        }
      }
      this.$refs.table.refresh()
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleAdd() {
      let routerone=this.$router.resolve({name: 'AddGoods'}) 
      window.open(routerone.href, '_blank');
    },
    handleEdit(row) {
      let routertwo=this.$router.resolve({name: 'EditGoods', params: {id: row.id}}) 
      window.open(routertwo.href, '_blank');
    },
    handleDelete (row) {
      deleteGoods(row.id).then(res => {
        if (res.code === 0) {
          this.$refs.table.refresh()
          this.$message.success('删除成功')
        }
      })
    },
    showInfoList(row){
      const vm = this
      vm.selectedGoods = row
      vm.skus = vm.selectedGoods.skus.filter(item => item.deleted===false).map(item => Object.assign({}, item, {unit_stock: 0, add_stock: 0}))
      vm.fTags = this.tags.filter(item => item.type === vm.selectedGoods.is_online || item.type === 9)
      getGoodsInfoList(row.id).then(res => {
        if (res.code === 0){
          vm.infoList = res.data.data.map(item => {
            item.stock = item.stocks.filter(item => item.deleted===false)
            let len = item.stock.length
            for (let i = 0; i < vm.skus.length; i++) {
              if (len > 0) {
                for (let j = 0; j < item.stock.length; j++) {
                  if (vm.skus[i].id === item.stock[j].sku_id) {
                    item.stock[j]= Object.assign({}, vm.skus[i], item.stock[j])
                  }
                }
              } else {
                item.stock = vm.skus.map(item => {
                  return {
                    sku_id: item.id,
                    attribute: item.attribute,
                    unit_stock: 0,
                    add_stock: 0,
                  }
                })
              }
            }
            item.tids = item.tags.map(item => item.tag_id)
            return Object.assign({}, item,{exchange_price:vm.selectedGoods.exchange_price})       
          })
        }
      })
      vm.infoListVisible = true
    },
    handleOk() {
      console.log(this.infoList)
      updateInfos(this.infoList).then(res => {
        if (res.code === 0) {
          this.$message.success('添加成功')
          this.$refs.table.refresh()
          this.infoListVisible = false
        }
      })
    },
    cancelAddInfo() {
      this.infoForm.resetFields()
      this.infoVisible = false
    },
    addInfo() {
      let info = {
        branch_id: null,
        sale_price: this.selectedGoods.exchange_price,
        is_listing: false,
        recommended: false,
        weights: null,
        discount: 0,
        unit_stock: 0,
        add_stock: 0,
        goods_id: this.selectedGoods.id,
        stock: this.skus
      }
      this.infoList.push(info)
    },
    filterBranches(idx) {
      const vm = this
      let arr = []
      let list = vm.infoList.filter((item, index) => index !== idx)
      arr = this.branches.filter(item => {
        if (list.find(a => a.branch_id === item.id)) {
          return false
        } else {
          return true
        }
      })
      return arr
    }
  }
}
</script>
<style scoped>
.add-btn {
  margin-bottom: 10px;
}
.wawa-info {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #e5e5e5;
}
.wawa-info-group {
  position: relative;
  padding: 10px 0;
}
.wawa-info-group .group-title {
  position: relative;
  padding: 7px 10px;
  margin: 0;
  background-color: #f8f8f8;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
}
.wawa-info-group .group-container {
  padding: 10px 10px 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
}
</style>
