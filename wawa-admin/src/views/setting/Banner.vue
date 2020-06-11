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
      <template slot="image_url" slot-scope="text">
        <span><img :src="text" style="width: 125px; height: 60px;"></span>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗？" @confirm="handleDel(record)" okText="是" cancelText="否">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </s-table>

    <a-modal
      :title="modal_title"
      :width="1000"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='门店名称'
          fieldDecoratorId="branch_id"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择门店'}],
            initialValue: mdl.branch_id,
          }"
        >
          <a-select placeholder="请选择门店">
            <a-select-option v-for="item in branches" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='链接'
          fieldDecoratorId="json_data"
          :fieldDecoratorOptions="{rules: [{ required: false}],
            initialValue: mdl.json_data,
          }"
        >
          <a-input placeholder="请输入链接" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='轮播图'
          fieldDecoratorId="image_url"
              :fieldDecoratorOptions="{rules: [{ required: true}]}"
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
            <img v-if="mdl.image_url" :src="mdl.image_url" alt="avatar" width=200 height=128/>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>

      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import STable from '@/components/table/'
import { getBannerList, addBanner, updateBanner, deleteBanner } from '@/api/banner'
import { getQiniuToken } from '@/api/qiniu'
import { getBranchList } from '@/api/branch'

export default {
  name: 'Banner',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      form: null,
      modal_title: '添加轮播图',
      mdl: {},
      imgForm: {},
      bucketHost: '',
      loading: false,
      branches:[],
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
          dataIndex: 'id',
        },
        {
          title: '门店',
          dataIndex: 'branch.name',
        },
        {
          title: '图片',
          dataIndex: 'image_url',
          scopedSlots: { customRender: 'image_url' },
        },
        {
          title: '链接',
          dataIndex: 'json_data',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getBannerList(Object.assign(params, this.queryParam))
          .then(res => {
            if (res.code === 0) {
              return res.data
            } else {
              return {
                data: [],
                pageSize: 10,
                pageNo: 1,
                totalPag: 0,
                totalCount: 0
              }
            }            
          })
      },
    }
  },
  created () {
    this.getBranchList()
  },
  methods: {
    initBanner () {
      this.mdl = {
        id: undefined,
        branch_id: 0,
        category: 'none',
        json_data:'',
        position: 0,
        image_url: '',
        weights: 0
      }
    },
    getBranchList: function () {
      getBranchList().then(res => {
        this.branches = res.data.data
      })
    },
    handleAdd () {
      this.modal_title = '添加轮播图'
      this.initBanner()
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.image_url = this.mdl.image_url
          values['category']=this.mdl.category
          values['position']=this.mdl.position
          values['weights']=this.mdl.weights
          if (this.mdl.id) {
            updateBanner(this.mdl.id, values).then(res => {
              if (res.code === 0) {
                this.$refs.table.refresh()
                this.$message.success('修改成功')
                this.form.resetFields()
                this.visible = false
              }
            })
          } else {
            addBanner(values).then(res => {
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
    handleEdit (record) {
      this.modal_title = '修改轮播图'
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    handleDel (row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: '真的要删除吗?',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteBanner(row.id).then(res => {
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
    save (row) {
      delete row.editable
      this.$refs.table.updateEdit()
    },
    cancel (row) {
      delete row.editable
      this.$refs.table.updateEdit()
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
      } else if (info.file.status === 'done') {
        let key = info.file.response.key
        this.mdl.image_url = `${this.bucketHost}${key}`
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
<style>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
