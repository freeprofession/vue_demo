<template>
<div>
  <a-card :bordered="false">
    <div class="table-operator">
      抄表日期 : <a-date-picker @change="onChange" />
    </div>         

    <a-table
        size="small"
        :columns="columns"
        :dataSource="Sequence"
        :pagination="{ pageSize: 100 }"
        :scroll="{ y: 450 }"
        bordered
    >
        <template slot="coin" slot-scope="text,record">
            <input v-model.number="record.coin" placeholder="投币数">
        </template>  
        <template slot="win" slot-scope="text,record">
            <input v-model.number="record.win" placeholder="出彩数">
        </template>  
    </a-table>
  </a-card>
  <a-card class="card" :bordered="false" >
    <a-row>
        <a-col :span="4" :offset="10">
            <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol">
            <a-button type='primary' @click="handleCopy">提交</a-button>
            </a-form-item>
        </a-col>
    </a-row>
  </a-card>
</div>
</template>

<script>
import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
import { getCopyTable,subCopyTable } from '@/api/stock'

export default {
  name: "CopyTable",
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
        sm: { span: 16 },
      },
      loading: false,
      Sequence:[],
      now_date:null,
      columns: [
        {
          title: '机器编号',
          dataIndex: 'number',
          width: '30%',
        },
        {
          title: '投币数',
          dataIndex: 'coin',  
          width: '35%',
          scopedSlots: { customRender: 'coin' },   
        },
        {
          title: '出彩数',
          dataIndex: 'win',
          width: '35%',
          scopedSlots: { customRender: 'win' },
        },      
      ],
    }
  },
  created() {
      this.getCopyTable()
  },
  methods: {
    getCopyTable: function () {
      getCopyTable().then(res => {
        this.Sequence = res.data
      })
    },
    onChange(e) {
      this.now_date = e.format('YYYY-MM-DD')
    },
    handleCopy (row) {
      const params = {
        date : this.now_date,
        code : this.Sequence
      }
      subCopyTable(params).then(res => {
        if (res.code === 0) {
          this.$message.success('提交成功')
        }
      })
    },
  },
}
</script>