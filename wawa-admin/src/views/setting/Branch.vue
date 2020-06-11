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
          <a @click="showAdminList(record)">管理账号</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="addIdentifier(record)">机器编号</a>
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
          label='门店名称'
          fieldDecoratorId="name"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写门店名称' }],
            initialValue: mdl.name,
          }"
        >
          <a-input placeholder='门店名称' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='负责人'
          fieldDecoratorId="manager"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写负责人' }],
            initialValue: mdl.manager,
          }"
        >
          <a-input placeholder='负责人' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='联系方式'
          fieldDecoratorId="mobile"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写负责人联系方式' }],
            initialValue: mdl.mobile,
          }"
        >
          <a-input placeholder='联系方式' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='门店地址'
          fieldDecoratorId="address"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写门店地址' }],
            initialValue: mdl.address,
          }"
        >
          <a-input placeholder='门店地址' />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      title="管理分店管理员账号"
      :width="600"
      v-model="adminVisible"
      okText='提交'
      @ok="handleAddUser"
      @cancel="cancelAddUser"
    >
      <a-form :autoFormCreate="(form)=>{this.userForm = form}">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='账号'
          fieldDecoratorId="username"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填账户名称' }],
            initialValue: admin.username,
          }"
        >
          <a-input :disabled="admin.id !== 0" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='真实姓名'
          fieldDecoratorId="real_name"
          :fieldDecoratorOptions="{
            initialValue: admin.real_name,
          }"
        >
          <a-input placeholder='真实姓名' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='联系方式'
          fieldDecoratorId="phone_number"
          :fieldDecoratorOptions="{
            initialValue: admin.phone_number,
          }"
        >
          <a-input placeholder='联系方式' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='密码'
          fieldDecoratorId="password"
          :fieldDecoratorOptions="{
            rules: [
              { required: true, message: '请填写密码' }, 
              {validator: validateToNextPassword,}
            ],
          }"
        >
          <a-input type='password' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='确认密码'
          fieldDecoratorId="confirm"
          :fieldDecoratorOptions="{
            rules: [
              { required: true, message: '请确认密码' }, 
              {validator: compareToFirstPassword,}
            ],
          }"
        >
          <a-input type='password' />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      title="管理分店管理员账号"
      :width="700"
      v-model="adminListVisible"
      @ok="adminListVisible = false"
      @cancel="adminListVisible = false"
    >
      <a-button type="primary" class="add-btn" @click="addUser">添加</a-button>
      <a-table
        :columns="adminColumns"
        :dataSource="adminList"
        :pagination="false"
        size="middle"
        bordered
      >
        <template slot="action" slot-scope="text, record">
          <div class='editable-row-operations'>
            <a @click="editUser(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除此用户吗？" @confirm="deleteUser(record)" okText="是" cancelText="否">
              <a>删除</a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </a-modal>

    <a-modal
      title="管理机器编号"
      :width="600"
      v-model="idenVisible"
      @ok="handleAddiden"
      @cancel="idenVisible = false"
    >
      <a-table
        :columns="idenColumns"
        :dataSource="idenList"
        :pagination="{ pageSize: 100 }"
        :scroll="{ y: 340 }"
        size="small"
        bordered
      >
        <template slot="void" slot-scope="text, record">
            <a-input v-model="record.void" style="width: 100px;"/>
        </template>
      </a-table>
      <a-button type="primary" class="add-btn" @click="handleIden">添加</a-button>
    </a-modal>

    
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import { getBranchList, addBranch, updateBranch, deleteBranch,getBranchIdentify } from '@/api/branch'
import { addAdminUser, updateAdminUser, deleteAdminUser } from '@/api/admin_user'

export default {
  name: 'Branch',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      adminVisible: false, // 修改添加管理员
      adminListVisible: false, // 管理员列表
      idenVisible:false,//机器编号管理
      selectedBranch: {},
      modal_title: '添加门店',
      branch_id:0,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      form: null,
      userForm: null,
      confirmDirty: false,
      admin: {},
      mdl: {},
      // 查询参数
      queryParam: {
        sort: {
          field: 'id',
          reverse: true
        }
      },
      adminList: [],
      idenList:[],
      adminColumns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '真实姓名',
          dataIndex: 'real_name'
        },
        {
          title: '手机号',
          dataIndex: 'phone_number'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // 表头
      columns: [
        {
          title: '门店ID',
          dataIndex: 'id'
        },
        {
          title: '门店名称',
          dataIndex: 'name',
        },
        {
          title: '负责人',
          dataIndex: 'manager',
        },
        {
          title: '联系方式',
          dataIndex: 'mobile',
        },
        {
          title: '门店地址',
          dataIndex: 'address',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      idenColumns: [
        {
          title: '机器编号',
          dataIndex: 'void',
          scopedSlots: { customRender: 'void' },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getBranchList(Object.assign(params, this.queryParam))
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
      this.modal_title = '修改门店'
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    addIdentifier(row) {
      this.branch_id = row.id
      this.idenVisible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.mdl.id) {
            updateBranch(this.mdl.id, values).then(res => {
              if (res.code === 0) {
                this.$refs.table.refresh()
                this.$message.success('修改成功')
                this.visible = false
              }
            })
          } else {
            addBranch(values).then(res => {
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
      this.form.resetFields()
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
          deleteBranch(row.id).then(res => {
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
    showAdminList(row) {
      this.selectedBranch = row
      this.adminList = row.admin ? row.admin.filter(item=>item.deleted==0) : []
      this.adminListVisible = true
    },
    handleAddUser() {
      this.userForm.validateFields((err, values) => {
        if (!err) {
          if (this.admin.id) {
            updateAdminUser(this.admin.id, values).then(res => {
              if (res.code === 0) {
                this.$refs.table.refresh()
                this.$message.success('修改成功')
                this.userForm.resetFields()
                for (const v of this.adminList) {
                  if (v.id === res.data.id) {
                    const index = this.adminList.indexOf(v)
                    this.adminList.splice(index, 1, res.data)
                    break
                  }
                }
                this.adminVisible = false
              }
            })
          } else {
            this.admin.username = values.username
            this.admin.password = values.password
            this.admin.real_name = values.real_name
            this.admin.phone_number = values.phone_number
            addAdminUser(this.admin).then(res => {
              this.$refs.table.refresh()
              this.$message.success('添加成功')
              this.userForm.resetFields()
              this.adminList.unshift(res.data)
              this.adminVisible = false
            }).catch(() => {
              this.userForm.resetFields()
            })
          }
          
        }
      })
    },
    cancelAddUser() {
      this.userForm.resetFields()
      this.adminVisible = false
    },
    handleIden(){
      var obj = {
        void: '',
      }
      this.idenList.push(obj)
    },
    handleAddiden(){
      const params = {
        id:this.branch_id,
        number: this.idenList
      }
      getBranchIdentify(params).then(() => {
        this.$message.success('提交成功')
        this.idenList=[]
      })
    },
    addUser() {
      this.admin = {
        id: 0,
        username: null,
        real_name: null,
        phone_number: null,
        password: '',
        role: 'guest',
        branch_id: this.selectedBranch.id
      }
      this.adminVisible = true
    },
    editUser(row) {
      this.admin = row
      this.adminVisible = true
    },
    deleteUser(row) {
      deleteAdminUser(row.id).then(() => {
        this.$message.success('删除成功')
        const index = this.adminList.indexOf(row)
        this.adminList.splice(index, 1)
      })
    },
    handleConfirmBlur  (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword  (rule, value, callback) {
      const form = this.userForm
      if (value && value !== form.getFieldValue('password')) {
        callback('两次密码不一致')
      } else {
        callback()
      }
    },
    validateToNextPassword  (rule, value, callback) {
      const form = this.userForm
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
  }
}
</script>
<style scoped>
.add-btn {
  margin-bottom: 10px;
}
</style>
