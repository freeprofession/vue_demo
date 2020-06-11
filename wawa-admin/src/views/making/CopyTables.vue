<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
              <a-form-item label="抄表门店" fieldDecoratorId="branch_id">
                <a-select placeholder="请选择">
                  <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="抄表日期" fieldDecoratorId="date_range">
              <a-date-picker />
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

    <a-table
      size="small"
      :columns="columns"
      :dataSource="Sequences"
      :pagination="{ pageSize: 100 }"
      :scroll="{ y: 450 }"
      bordered
    >
      <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
            <a @click="() => edit(record)">编辑</a>
          </span>
        </div>
      </template>
    </a-table>

    <a-modal
      title="管理数据"
      :width="600"
      v-model="Visible"
      okText='提交'
      @ok="handleChange"
      @cancel="Visible = false"
    >
      <a-form :autoFormCreate="(form)=>{this.dataForm = form}">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='投币数'
          fieldDecoratorId="coin"
          :fieldDecoratorOptions="{
            initialValue: cacheData.coin,
          }"
        >
        <a-input placeholder='投币数' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='出彩数'
          fieldDecoratorId="win"
          :fieldDecoratorOptions="{
            initialValue: cacheData.win,
          }"
        >
        <a-input placeholder='出彩数' />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
import { getCopyTables,subCopyTables } from '@/api/stock'
import { getBranchList } from '@/api/branch'


export default {
  name: "CopyTables",
  components: {
    AInput,
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
      loading: false,
      searchForm: null,
      form: null,
      dataForm: null,
      queryParam: {},
      Visible: false,
      Sequences:[],
      cacheData:[],
      branches:[],
      columns: [
        {
          title: '机器编号',
          dataIndex: 'number',
          width: '10%',
        },
        {
          title: '投币数',
          dataIndex: 'coin', 
          width: '20%',
        },
        {
          title: '单日投币数',
          dataIndex: 'differ_coin', 
          width: '10%',
        },
        {
          title: '出彩数',
          dataIndex: 'win',
          width: '20%',
        },
        {
          title: '单日出彩数',
          dataIndex: 'differ_win',
          width: '10%',
        },
        { 
          title: '出彩率',
          width: '10%',
          dataIndex: 'ratio',
        },{ 
          title: '操作人员',
          width: '10%',
          dataIndex: 'operator',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '10%',
          scopedSlots: { customRender: 'action' },
        },    
      ],
    }
  },
  created() {
    this.getBranchList()    
  },
  methods: {
    getCopyTables: function () {
      getCopyTables(this.queryParam).then(res => {
        this.Sequences = res.data
      })
    },
    getBranchList: function () {
      getBranchList().then(res => {
        this.branches = res.data.data
      })
    }, 
    handleSearch(e) {
      e.preventDefault()
      let filter = {
        branch_id: this.searchForm.getFieldValue('branch_id'),
      }
      const date = this.searchForm.getFieldValue('date_range')
      if (date) {
          filter['date'] = date.format('YYYY-MM-DD')
      }
      this.queryParam = { filter }
      this.getCopyTables(this.queryParam)
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.getCopyTables()
    },
    edit(row) {
      this.cacheData = row
      this.Visible = true
    },
    handleChange() {
      this.dataForm.validateFields((err, values) => {
        if (!err) {
          if (this.cacheData.id) {
            subCopyTables(this.cacheData.id, values).then(res => {
              if (res.code === 0) {
                this.$message.success('修改成功')
                this.dataForm.resetFields()
                this.Visible = false
                this.getCopyTables(this.queryParam)
              }
            })
          }          
        }
      })
    },
  }
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>