<template>
  <a-card :bordered="false">
    <div class="title">偏远地区管理</div>
    <div style="margin-bottom: 20px; font-weight: bold;">
      {{ areas | AreaFilter }}
    </div>
    <a-button type="primary" @click="handleAddAreas">选择偏远地区</a-button>
    <a-divider style="margin-bottom: 32px"/>
    <div class="table-operator">
      <div class="title">邮费管理</div>
      <a-button type="primary" @click="handleAdd" icon="plus">新增模板</a-button>
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
          label='模板名称'
          fieldDecoratorId="name"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写模板名称' }],
            initialValue: mdl.name,
          }"
        >
          <a-input placeholder='模板名称' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='基础运费'
          fieldDecoratorId="base_fee"
          :fieldDecoratorOptions="{
            initialValue: mdl.base_fee,
          }"
        >
          <a-input placeholder='请输入金额' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='偏远地区加价'
          fieldDecoratorId="add_fee"
          :fieldDecoratorOptions="{
            initialValue: mdl.add_fee,
          }"
        >
          <a-input placeholder='请输入金额' />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      title="选择偏远地区"
      :width="800"
      v-model="areaVisible"
      okText='提交'
      @ok="submitArea"
    >
      <a-checkbox-group @change="onChange" :defaultValue="selectedAreas">
        <a-row>
          <a-col v-for="area in provinces" :span="8" :key="area.code"><a-checkbox :value="area.name">{{ area.name }}</a-checkbox></a-col>
        </a-row>
      </a-checkbox-group>
    </a-modal>
  </a-card>
</template>
<script>
import STable from '@/components/table/'

import { getFeeTemplateList, addFeeTemplate, updateFeeTemplate, getRemoteAreaList, addRemoteArea } from '@/api/fee_template'
import { provinces } from '@/config/province'

export default {
  name: 'FeeTemplate',
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
      provinces: provinces,
      areas: [],
      selectedAreas: [],
      areaVisible: false,
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
          title: '模板名称',
          dataIndex: 'name',
        },
        {
          title: '基础运费',
          dataIndex: 'base_fee',
        },
        {
          title: '偏远地区加价',
          dataIndex: 'add_fee'
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
        return getFeeTemplateList(Object.assign(params, this.queryParam))
          .then(res => {
            return res.data
          })
      },
    }
  },
  created() {
    this.getAreas()
  },
  methods: {
    getAreas() {
      getRemoteAreaList().then(res => {
        if (res.code === 0) {
          this.areas = res.data
          this.selectedAreas = this.areas.map(item => item.name)
        }
      })
    },
    handleAddAreas() {
      this.areaVisible = true
    },
    handleAdd() {
      this.mdl = {}
      this.visible = true
    },
    handleEdit(record) {
      this.modal_title = '修改模板'
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.mdl.id) {
            updateFeeTemplate(this.mdl.id, values).then(res => {
              if (res.code === 0) {
                this.$refs.table.refresh()
                this.$message.success('修改成功')
                this.form.resetFields()
                this.visible = false
              }
            })
          } else {
            addFeeTemplate(values).then(res => {
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
    onChange (checkedValues) {
      this.selectedAreas = checkedValues
    },
    submitArea() {
      const vm = this
      let areas = []
      let area = {}
      for (let i = 0; i < vm.selectedAreas.length; i++) {
        area = vm.provinces.find(item => item.name == vm.selectedAreas[i])
        if (area) {
          areas.push(area)
        }
      }
      addRemoteArea({areas}).then(res => {
        if (res.code === 0) {
          this.$message.success('设置成功')
          this.areaVisible = false
          this.getAreas()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>
