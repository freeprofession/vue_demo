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
      <template slot="pic_url" slot-scope="text">
        <span><img :src="text" style="width: 77px; height: 77px;"></span>
      </template>
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
          label='分类名称'
          fieldDecoratorId="name"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请填写分类名称' }],
            initialValue: mdl.name,
          }"
        >
          <a-input placeholder='分类名称' />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='分类封面'
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: '请上传分类封面' }]
          }"
        >
          <a-upload
            name="file"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            action="//upload.qiniup.com"
            :beforeUpload="beforeUpload"
            :data="imgForm"
            @change="handleChange"
          >
            <img v-if="mdl.pic_url" :src="mdl.pic_url" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='排序'
          fieldDecoratorId="sort"
          :fieldDecoratorOptions="{
            initialValue: mdl.sort,
          }"
        >
          <a-input placeholder='排序' />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import { getCategoryList, addCategory, updateCategory, deleteCategory } from '@/api/category'
import { getQiniuToken } from '@/api/qiniu'

export default {
  name: 'Category',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      modal_title: '添加分类',
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
      imgForm: {},
      bucketHost: '',
      loading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '分类ID',
          dataIndex: 'id'
        },
        {
          title: '分类名称',
          dataIndex: 'name',
        },
        {
          title: '分类封面',
          dataIndex: 'pic_url',
          scopedSlots: { customRender: 'pic_url' },
        },
        {
          title: '排序',
          dataIndex: 'sort',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getCategoryList(Object.assign(params, this.queryParam))
          .then(res => {
            return res.data
          })
      },
    }
  },
  methods: {
    handleAdd () {
      this.mdl = {}
      this.visible = true
    },
    handleEdit (record) {
      this.modal_title = '修改分类'
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.mdl = Object.assign(this.mdl, values)
          if (this.mdl.id) {
            updateCategory(this.mdl.id, this.mdl).then(res => {
              if (res.code === 0) {
                this.$refs.table.refresh()
                this.$message.success('修改成功')
                this.form.resetFields()
                this.visible = false
              } else {
                this.$message.error(`修改失败:${res.message}`)
              }
            })
          } else {
            addCategory(this.mdl).then(res => {
              if (res.code === 0) {
                this.$refs.table.refresh()
                this.$message.success('添加成功')
                this.form.resetFields()
                this.visible = false
              } else {
                this.$message.error(`添加失败:${res.message}`)
              }
            })
          }
        }
      })
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
          deleteCategory(row.id).then(res => {
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
    handleCancel () {
      this.form.resetFields();
      this.visible = false
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
      } else if (info.file.status === 'done') {
        let key = info.file.response.key
        this.mdl.pic_url = `${this.bucketHost}${key}`
        this.loading = false
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error('上传图片失败，请重试')
      }
    },
    beforeUpload: function () {
      let _this = this
      return getQiniuToken().then(res => {
        _this.bucketHost = res.data.bucketHost
        _this.imgForm = {
          // key: res.key,
          token: res.data.token
        }
      })
    }
  }
}
</script>
