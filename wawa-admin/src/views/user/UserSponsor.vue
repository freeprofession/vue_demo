<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="赞助用户" fieldDecoratorId="from_id">
              <a-input placeholder="ID"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="被赞助用户" fieldDecoratorId="to_id">
              <a-input placeholder="ID"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" htmlType='submit'>查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
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

import { getUserSponsorList } from '@/api/user'

export default {
  name: "UserSponsor",
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
      queryParam: {},
      // 表头
      columns: [
        {
          title: '赞助ID',
          dataIndex: 'from_id'
        },
        {
          title: '昵称',
          dataIndex: 'from_name'
        },
        {
          title: '数量',
          dataIndex: 'doll'
        },
        {
          title: '被赞助ID',
          dataIndex: 'to_id'
        },
        {
          title: '昵称',
          dataIndex: 'to_name'
        },
        {
          title: '时间',
          dataIndex: 'created'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getUserSponsorList(Object.assign(params, this.queryParam))
          .then(res => {
            return res.data
          })
      },
    }
  },
  methods: {
    handleSearch(e) {
      e.preventDefault()
      this.queryParam = {
        filter: {
          from_id: this.searchForm.getFieldValue('from_id'),
          to_id: this.searchForm.getFieldValue('to_id'),
        }
      }
      this.$refs.table.refresh()
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleEdit (record) {
      this.mdl = Object.assign({}, record)
      console.log(this.mdl)
      this.visible = true
    },
    handleOk () {
    },
    onChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows
      console.log(this.$refs.table)
    }
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

