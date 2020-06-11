<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd" icon="plus">新建标签</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <template slot="exchange_type" slot-scope="text">
        {{ text | exchangeTypeFilter }}
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="handleEdit(record)">编辑</a>
        </div>
      </template>
    </s-table>

    <a-modal
      :title="modal_title"
      :width="800"
      v-model="visible"
      okText='提交'
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='标签名称'
          fieldDecoratorId="name"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写标签名称' }],
            initialValue: mdl.name,
          }"
        >
          <a-input placeholder='标签名称' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所属兑换方式   "
          fieldDecoratorId="exchange_type"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请设置所属兑换方式'}],
            initialValue: mdl.exchange_type
          }"
        >
          <a-radio-group name="radioGroup">
            <a-radio :value="9">通用</a-radio>
            <a-radio :value="0">门店兑换</a-radio>
            <a-radio :value="1">线上直邮</a-radio>
            <a-radio :value="2">线上拼兑</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import STable from '@/components/table/'

import { getTagList, addTag, updateTag } from '@/api/tag'

export default {
  name: 'Tag',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      modal_title: '添加标签',
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
      queryParam: {
        sort: {
          field: 'id',
          reverse: true
        }
      },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '标签名称',
          dataIndex: 'name',
        },
        {
          title: '所属兑换方式',
          dataIndex: 'exchange_type',
          scopedSlots: { customRender: 'exchange_type' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getTagList(Object.assign(params, this.queryParam))
          .then(res => {
            return res.data
          })
      },
    }
  },
  filters: {
    exchangeTypeFilter: function(value) {
      if (value === 9) {
        return '通用'
      }
      const types = ['门店兑换', '线上直邮', '线上拼单']
      return types[value]
    }
  },
  methods: {
    handleAdd() {
      this.mdl = {
        name: '',
        exchange_type: 9
      }
      this.visible = true
    },
    handleEdit(record) {
      this.modal_title = '修改标签'
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.mdl.id) {
            updateTag(this.mdl.id, values).then(res => {
              if (res.code === 0) {
                this.$refs.table.refresh()
                this.$message.success('修改成功')
                this.form.resetFields()
                this.visible = false
              }
            })
          } else {
            addTag(values).then(res => {
              if (res.code === 0) {
                this.$refs.table.refresh()
                this.$message.success('添加成功')
                this.form.resetFields()
                this.visible = false
              }
            })
          }
        }
      })
    },
    handleCancel () {
      this.form.resetFields();
      this.visible = false
    }
  }
}
</script>
