<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :autoFormCreate="(form)=>{this.searchForm = form}">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="抄表日期" fieldDecoratorId="date_range">
              <a-date-picker />
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

    <a-table
      size="small"
      :columns="columns"
      :dataSource="Sequences"
      :pagination="{ pageSize: 100 }"
      :scroll="{ y: 450 }"
      bordered
    >
    </a-table>

  </a-card>
</template>

<script>
import STable from '@/components/table/'
import { getCopyTables } from '@/api/stock'


export default {
  name: "CopyTab",
  components: {
    STable
  },
  data() {
    return {
      loading: false,
      searchForm: null,
      form: null,
      queryParam: {},
      Sequences:[],
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
          width: '15%',
        },
        {
          title: '出彩数',
          dataIndex: 'win',
          width: '20%',
        },
        {
          title: '单日出彩数',
          dataIndex: 'differ_win',
          width: '15%',
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
      ],
    }
  },
  methods: {
    getCopyTables: function () {
      getCopyTables(this.queryParam).then(res => {
        this.Sequences = res.data
      })
    },
    handleSearch(e) {
      e.preventDefault()
      let filter = {
        branch_id: 0
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
  }
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
