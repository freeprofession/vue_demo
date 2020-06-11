<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd" icon="plus">新建</a-button>
    </div>
    <a-table
      size="default"
      :columns="columns"
      :dataSource="supplier"
    >
      <template slot="is_payment" slot-scope="text">
        <p>{{ text ? '有账期' : '无账期' }}</p>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="handleManage(record)">联系人管理</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
        </div>
      </template>
    </a-table>

    <a-modal
      title="供应商管理"
      :width="600"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='供应商编号'
          fieldDecoratorId="code"
          :fieldDecoratorOptions="{
            rules: [{ required: true }],
            initialValue: mdl.code,
          }"
        >
          <a-input placeholder='供应商编号' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='供应商名称'
          fieldDecoratorId="name"
          :fieldDecoratorOptions="{
            rules: [{ required: true }],
            initialValue: mdl.name,
          }"
        >
          <a-input placeholder='供应商名称' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="账期"
          fieldDecoratorId="is_payment"
          :fieldDecoratorOptions="{
            rules: [{ required: true }],
            initialValue: mdl.is_payment,
          }"
        >
          <a-radio-group name="radioGroup">
            <a-radio :value="false">无账期</a-radio>
            <a-radio :value="true">有账期</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='供应商地址'
          fieldDecoratorId="address"
          :fieldDecoratorOptions="{
            rules: [{ required: true }],
            initialValue: mdl.address,
          }"
        >
          <a-input placeholder='供应商地址' />
        </a-form-item>        
      </a-form>
    </a-modal>

    <a-modal
      title="付款信息管理"
      :width="800"
      v-model="managerListVisible"
      @ok="adminListVisible = false"
      @cancel="adminListVisible = false"
    >
      <a-button type="primary" class="add-btn" @click="addManager">添加</a-button>
      <a-table
        :columns="managerColumns"
        :dataSource="managerList"
        :pagination="false"
        size="middle"
        bordered
      >
        <template slot="action" slot-scope="text, record">
          <div class='editable-row-operations'>
            <a @click="editManager(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定要删除此用户吗？" okText="是" cancelText="否">
              <a @click="deleteManager(record)">删除</a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </a-modal>

    <a-modal
      title="管理联系人"
      :width="800"
      v-model="managerVisible"
      okText='提交'
      @ok="handleManageOk"
      @cancel="innerVisible=false"
    >
      <a-form :autoFormCreate="(form)=>{this.managerform = form}">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='负责人'
          fieldDecoratorId="real_name"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message:'请填写负责人' }],
            initialValue: contact.real_name,
          }"
        >
          <a-input placeholder='负责人' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='联系方式'
          fieldDecoratorId="phone_number"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写负责人联系方式' }],
            initialValue: contact.phone_number,
          }"
        >
          <a-input placeholder='联系方式' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='户名'
          fieldDecoratorId="account"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写户名' }],
            initialValue: contact.account,
          }" 
        >
          <a-input placeholder='户名' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='开户行'
          fieldDecoratorId="bank"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写开户行' }],
            initialValue: contact.bank,
          }"
        >
          <a-input placeholder='开户行' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='银行账号'
          fieldDecoratorId="card"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写负责人银行账号' }],
            initialValue: contact.card,
          }"
        >
          <a-input placeholder='银行账号' />
        </a-form-item>        
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
import { getSupplierList,addSupplier,updateSupplier,addContact,updateContact,deleteContact } from '@/api/supplier'

export default {
  name: 'Supplier',
  components: {
    STable,
    AInput
  },
  data() {
    return {
      visible: false,
      managerVisible:false,
      managerListVisible:false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      form: null, 
      managerform: null,
      mdl: {},
      supplier:[],
      managerList:[],
      queryParam: {},// 查询参数
      selectedSupplier:{},
      contact:{},
      columns: [
        {
          title: '供应商编号',
          dataIndex: 'code'
        },
        {
          title: '供应商名称',
          dataIndex: 'name',
        },
        {
          title: '供应商地址',
          dataIndex: 'address',
        },
        {
          title: '账期',
          dataIndex: 'is_payment',
          scopedSlots: { customRender: 'is_payment' },
        },     
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      managerColumns:[
        {
          title: '联系人',
          dataIndex: 'real_name',
        },
        {
          title: '联系方式',
          dataIndex: 'phone_number',
        },       
        {
          title: '户名',
          dataIndex: 'account',
        },
        {
          title: '开户行',
          dataIndex: 'bank',
        },
        {
          title: '银行账号',
          dataIndex: 'card',
        }, 
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        } 
      ],
      // 加载数据方法 必须为 Promise 对象
      // loadData: params => {
      //   return getSupplierList(Object.assign(params, this.queryParam))
      //     .then(res => {
      //       return res.data
      //     })
      // },
    }
  },
  created(){
    this.getSupplierList()
  },
  methods: {
    getSupplierList() {
      getSupplierList().then(res => {
        this.supplier = res.data.data
      })
    },
    handleAdd() {
      this.mdl = {}
      this.visible = true
    },
    handleEdit(record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    handleManage(row) {
      this.selectedSupplier= row
      this.managerList = row.contact ? row.contact : []
      this.managerListVisible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.mdl.id) {
            updateSupplier(this.mdl.id, values).then(res => {
              if (res.code === 0) {
                this.getSupplierList()
                this.$message.success('修改成功')
                this.form.resetFields()
                this.visible = false
              }
            })
          }else{
            addSupplier(values).then(res => {
              if (res.code === 0) {
                this.getSupplierList()
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
      this.form.resetFields()
      this.visible = false
    },
    addManager() {
      this.contact = {
        id:0,
        real_name: null,
        phone_number: null,
        account: null,
        bank: null,
        card: null,
        supplier_id: this.selectedSupplier.id
      }
      this.managerVisible = true
    },
    editManager(row) {
      this.contact = row
      this.managerVisible = true
    },
    deleteManager(row) {
      deleteContact(row.id).then(() => {
        this.$message.success('删除成功')
        const index = this.managerList.indexOf(row)
        this.managerList.splice(index, 1)
      })
    },
    handleManageOk () {
      this.managerform.validateFields((err, values) => {
        if (!err) {
          if (this.contact.id) {
            updateContact(this.contact.id, values).then(res => {
              if (res.code === 0) {
                this.getSupplierList()
                this.$message.success('修改成功')
                this.managerform.resetFields()
                for (const v of this.managerList) {
                  if (v.id === res.data.id) {
                    const index = this.managerList.indexOf(v)
                    this.managerList.splice(index, 1, res.data)
                    break
                  }
                }
                this.managerVisible = false
              }
            })
          }else{
            this.contact.real_name = values.real_name
            this.contact.phone_number = values.phone_number
            this.contact.account = values.account
            this.contact.bank = values.bank
            this.contact.card = values.card
            addContact(this.contact).then(res => {
              if (res.code === 0) {
                this.getSupplierList()
                this.$message.success('添加成功')
                this.managerform.resetFields()
                this.managerList.unshift(res.data)
                this.managerVisible = false
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
.add-btn {
  margin-bottom: 10px;
}
</style>