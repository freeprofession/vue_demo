<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd" icon="plus">新建</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗？" @confirm="del(record)" okText="是" cancelText="否">
            <a>删除</a>
          </a-popconfirm>
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
          label='品牌名称'
          fieldDecoratorId="name"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写品牌名称' }],
            initialValue: mdl.name,
          }"
        >
          <a-input placeholder='品牌名称' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='品牌描述'
          fieldDecoratorId="description"
          :fieldDecoratorOptions="{
            initialValue: mdl.description,
          }"
        >
          <a-textarea :rows="5" placeholder="..." id='description'/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import STable from '@/components/table/'

import { getBrandList, addBrand, updateBrand, deleteBrand } from '@/api/brand'

export default {
  name: 'Brand',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      modal_title: '添加品牌',
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
          title: '品牌名',
          dataIndex: 'name',
        },
        {
          title: '描述',
          dataIndex: 'description',
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
        return getBrandList(Object.assign(params, this.queryParam))
          .then(res => {
            return res.data
          })
      },
    }
  },
  methods: {
    handleAdd() {
      this.mdl = {}
      this.visible = true
    },
    handleEdit(record) {
      this.modal_title = '修改品牌'
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.mdl.id) {
            updateBrand(this.mdl.id, values).then(res => {
              if (res.code === 0) {
                this.$refs.table.refresh()
                this.$message.success('修改成功')
                this.form.resetFields()
                this.visible = false
              }
            })
          } else {
            addBrand(values).then(res => {
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
    },
    // eslint-disable-next-line
    del (row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: '真的要删除吗?',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteBrand(row.id).then(res => {
            if (res.code === 0) {
              _this.$refs.table.refresh()
              _this.$message.success('删除成功')
            } else {
              _this.$message.error('删除失败')
            }
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
  }
}
</script>
