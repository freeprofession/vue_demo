<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
              <a-form-item label="抄表门店" fieldDecoratorId="branch_id">
                <a-select placeholder="请选择">
                  <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="抄表日期" fieldDecoratorId="date_range">
              <a-range-picker />
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

    <div class="table-group">
      <h3 class="group-title"><a-button type="primary" @click="addVolume">添加营业额</a-button></h3>
    </div>  

    <a-table
      size="small"
      :columns="columns"
      :dataSource="Analy"
      :pagination="{ pageSize: 100 }"
      :scroll="{ y: 450 }"
      bordered
    >
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
          label="门店"
          fieldDecoratorId="branch_id"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择门店'}]}"
        >
          <a-select placeholder="请选择门店">
            <a-select-option v-for="d in branches" :key="d.id">{{ d.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='时间'
          fieldDecoratorId="date"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择时间'}]}"
        >
          <a-date-picker />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='营业额'
          fieldDecoratorId="volume"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入营业额'}]}"
        >
          <a-input placeholder='请输入营业额' />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import STable from '@/components/table/'
import { getAnalyTable,postVolume } from '@/api/stock'
import { getBranchList } from '@/api/branch'


export default {
  name: "AnalyTable",
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
      loading: false,
      searchForm: null,
      dataForm: null,
      form: null,
      Visible:false,
      queryParam: {},
      Analy:[],
      branches:[],
      columns: [
        {
          title: '时间',
          dataIndex: 'today',
          width: '10%',
        },
        {
          title: '营业额',
          dataIndex: 'volume',
          width: '10%',
        },
        {
          title: '实际投币数',
          dataIndex: 'real_coin', 
          width: '10%',
        },
        {
          title: '实际出彩数',
          dataIndex: 'real_win',
          width: '10%',
        },
        {
          title: '预估出彩数',
          dataIndex: 'pre_win',
          width: '10%',
        },
        { 
          title: '实际出彩率',
          width: '10%',
          dataIndex: 'real_ratio',
        },
        {
          title: '存娃娃比率',
          dataIndex: 'recharge_ratio',
          width: '10%',
        }, 
        {
          title: '换娃娃比率',
          dataIndex: 'exchange_ratio',
          width: '10%',
        }, 
        {
          title: '毛利润',
          dataIndex: 'gross_profit',
          width: '10%',
        }, 
        {
          title: '毛利率',
          dataIndex: 'gross_rate',
          width: '10%',
        }, 
      ],
    }
  },
  created() {
    this.getBranchList() 
  },
  methods: {
    getAnalyTable: function () {
      getAnalyTable(this.queryParam).then(res => {
        this.Analy = res.data
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
      const date_range = this.searchForm.getFieldValue('date_range')
      if (date_range) {
          filter['start_date'] = date_range[0].format('YYYY-MM-DD')
          filter['end_date'] = date_range[1].format('YYYY-MM-DD')
      }
      this.queryParam = { filter }
      this.getAnalyTable(this.queryParam)
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.getAnalyTable()
    },
    addVolume() {
      this.Visible = true
    },
    handleChange() {
      this.dataForm.validateFields((err, values) => {
        if (!err) {
          values.date = values.date.format('YYYY-MM-DD')
          postVolume(values).then(res => {
            if (res.code === 0) {
              this.$message.success('提交成功')
              this.dataForm.resetFields()
              this.Visible = false
              this.getAnalyTable
            }
          })         
        }
      })
    }
  }
}
</script>
