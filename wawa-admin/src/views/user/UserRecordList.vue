<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="搜索用户" fieldDecoratorId="user_id">
              <a-input placeholder="ID"/>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-item label="订单日期" fieldDecoratorId="date_range">
              <a-range-picker />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="门店" fieldDecoratorId="branch_man">
              <a-cascader :options="options" @change="onChange" placeholder="请选择" changeOnSelect />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
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
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <template slot="avatar" slot-scope="text">
        <span class="avatar"><img :src="text"></span>
      </template>
    </s-table>
  </a-card>
</template>
<script>

import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
import { getBranchAdminList } from '@/api/branch'
import { getUserRecordList } from '@/api/user' 

export default {
  name: "UserRecordList",
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
      advanced: false,
      options:[],
      queryParam: {},
      // 表头
      columns: [
        {
          title: '头像',
          dataIndex: 'user_avatar',
          scopedSlots: { customRender: 'avatar' },
        },
        {
          title: '用户ID',
          dataIndex: 'user_id'
        },
        {
          title: '昵称',
          dataIndex: 'user_name'
        },
        {
          title: '所属门店',
          dataIndex: 'branch_name'
        },
        {
          title: '娃娃个数',
          dataIndex: 'doll',
          sorter: true,
          needTotal: true
        },
        {
          title: '工号',
          dataIndex: 'clerk_name'
        },
        {
          title: '时间',
          dataIndex: 'created'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getUserRecordList(Object.assign(params, this.queryParam))
          .then(res => {
            return res.data
          })
      },
    }
  },
  created () {
    this.getBranchAdminList()
  },
  methods: {
    getBranchAdminList: function () {
      getBranchAdminList().then(res => {
        this.options = res.data.admin
      })
    },
    onChange(value){
      console.log(value);
    },
    handleSearch(e) {
      e.preventDefault()
      let filter = {
        user_id: this.searchForm.getFieldValue('user_id'),
        branch_man: this.searchForm.getFieldValue('branch_man'),
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
  },
}
</script>
<style scoped>
.avatar {
  width: 48px;
  height: 48px;
}
.avatar>img {
  width: 48px;
  height: 48px;
  display: block;
  border-radius: 50%;
}
</style>

