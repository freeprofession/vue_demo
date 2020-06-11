<template>
  <div>
    <a-form layout="horizontal" @submit="handleSubmit" :autoFormCreate="(form) => this.form = form" class="form">
      <a-card class="card" title="基本信息" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="SPU"
              fieldDecoratorId="spu"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入SPU', whitespace: true}]}"
            >
              <a-input placeholder="请输入SPU" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="条形码"
              fieldDecoratorId="barcode"
              :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入条形码', whitespace: true}]}"
            >
              <a-input placeholder="请输入条形码" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="名称"
              fieldDecoratorId="name"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入商品名称'}]}"
            >
              <a-input placeholder="请输入商品名称" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="别名"
              fieldDecoratorId="alias"
              :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入商品别名'}]}"
            >
              <a-input placeholder="请输入商品别名" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="品牌"
              fieldDecoratorId="brand_id"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择品牌'}]}"
            >
              <a-select placeholder="请选择品牌">
                <a-select-option v-for="d in brands" :key="d.id">{{ d.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="供应商"
              fieldDecoratorId="supplier_id"
              :fieldDecoratorOptions="{rules: [{ required: false, message: '请选择供应商'}]}"
            >
              <a-select placeholder="请选择供应商" >
                <a-select-option v-for="d in suppliers" :key="d.id">{{ d.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="兑换规则"
              fieldDecoratorId="exchange_price"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入兑换规则'}]}"
            >
              <a-input placeholder="请输入兑换规则" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="主类别"
              fieldDecoratorId="major_id"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择类别'}]}"
            >
              <a-select placeholder="请选择类别">
                <a-select-option v-for="d in major_categories" :key="d.id">{{ d.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24" v-if="is_online > 0">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="邮费规则"
              fieldDecoratorId="template_id"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择邮费规则'}]}"
            >
              <a-select placeholder="请选择邮费规则">
                <a-select-option v-for="t in templates" :key="t.id">{{ t.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="副分类"
              fieldDecoratorId="minor_id"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择副分类'}]}"
            >
              <a-select placeholder="请选择副分类">
                <a-select-option v-for="d in minor_categories" :key="d.id">{{ d.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="兑换方式   "
              fieldDecoratorId="is_online"
              :fieldDecoratorOptions="{
                rules: [{ required: true, message: '请设置兑换方式'}],
                initialValue: this.is_online
              }"
            >
              <a-radio-group name="radioGroup" @change="changeType">
                <a-radio :value="0">门店兑换</a-radio>
                <a-radio :value="1">线上直邮</a-radio>
                <a-radio :value="2">线上拼兑</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="拼团起始时间"
              fieldDecoratorId="online_time"
              :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入拼团起始时间'}]}"
            >
              <a-input placeholder="请输入拼团起始时间" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="拼团期限"
              fieldDecoratorId="period"
              :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入拼团期限'}]}"
            >
              <a-input placeholder="请输入拼团期限" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="目标单数"
              fieldDecoratorId="required_number"
              :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入目标单数'}]}"
            >
              <a-input placeholder="请输入目标单数" />
            </a-form-item>
          </a-col> -->
          
        </a-row>
      </a-card>
      <a-card class="card" title="图片信息" :bordered="false">
        <a-row>
          <a-col :md="24">
            <a-form-item
              label="商品列表封面"
              fieldDecoratorId="pic_url"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请上传商品列表封面'}]}"
            >
              <a-upload
                name="file"
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="false"
                action="//upload.qiniup.com"
                :beforeUpload="beforeCoverUpload"
                :data="imgForm"
                @change="handleCoverChange"
              >
                <img width=128 height=128 v-if="pic_url" :src="pic_url" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24">
            <a-form-item
              label="详情页轮播图"
              fieldDecoratorId="images"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请上传详情页轮播图'}]}"
            >
              <a-upload
                action="//upload.qiniup.com"
                listType="picture-card"
                :multiple="true"
                :fileList="fileList"
                :beforeUpload="beforeUpload"
                :data="imgForm"
                @change="handleChange"
              >
                <div v-if="fileList.length < 12">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      
      <a-card class="card" title="SKU" :bordered="false" >
        <a-table :columns="columns" :dataSource="skus" :pagination="false" bordered>
          <template slot="attribute" slot-scope="text, record">
            <a-input v-model="record.attribute" style="width: 200px;"/>
          </template>
          <template slot="specification" slot-scope="text, record">
            <a-input v-model="record.specification" style="width: 100px;"/>
          </template>
          <template slot="min_quantity" slot-scope="text, record">
            <a-input v-model="record.min_quantity" style="width:50px;"/>
          </template>
          <template slot="purchase_price" slot-scope="text, record">
            <a-input v-model.number="record.purchase_price" style="width:50px;"/>
          </template>
          <template slot="cover" slot-scope="text, record">
            <a-upload
              name="file"
              listType="picture-card"
              class="sku-cover"
              :showUploadList="false"
              action="//upload.qiniup.com"
              :beforeUpload="beforeCoverUpload"
              :data="imgForm"
              @change="info => handleSkuCoverChange(info, record)"
            >
              <img width=50 height=50 v-if="record.cover" :src="record.cover" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class='addable-row-operations'>
              <a-popconfirm title="确定要删除此商品吗？" okText="是" cancelText="否">
                <a @click="handleDelete(record)">删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
        <a-button class="addable-add-btn" @click="handleAdd" style="position: relative;padding: 7px 10px;">添加</a-button>
      </a-card>
      <a-card class="card" title="详情描述" :bordered="false">
        <a-form-item
          fieldDecoratorId="detail"
          :fieldDecoratorOptions="{
            rules: [{ required: false, message: '请输入商品详情'}],
            initialValue: detail
          }"
        >
          <tinymce v-model="detail"/>
        </a-form-item>
      </a-card>
      <a-card class="card" :bordered="false">
        <a-row>
          <a-col :span="4" :offset="10">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-button type='primary' htmlType='submit'>提交</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import { getCategoryList, getSecondaryCategoryList } from '@/api/category'
import { getBrandList } from '@/api/brand'
import { getFeeTemplateList } from '@/api/fee_template'
import { getQiniuToken } from '@/api/qiniu'
import { addGoods } from '@/api/goods'
import { getSupplierList } from '@/api/supplier'

export default {
  name: 'AddGoods',
  components: {
    Tinymce
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
      imgForm: {},
      bucketHost: '',
      fileList: [],
      listObj: [],
      form: null,
      pic_url: '',
      detail: '',
      major_categories: [], // 主分类列表
      minor_categories: [], // 副分类列表
      brands: [], // 品牌列表
      suppliers:[],
      is_online: 0,
      templates: [], // 运费模板列
      skus: [],
      columns: [
        {
          title: '类型',
          dataIndex: 'attribute',
          scopedSlots: { customRender: 'attribute' }
        },
        {
          title: '规格',
          dataIndex: 'specification',
          scopedSlots: { customRender: 'specification' }
        },
        {
          title: '最低订货',
          dataIndex: 'min_quantity',
          scopedSlots: { customRender: 'min_quantity' }
        },
        {
          title: '购货价格',
          dataIndex: 'purchase_price',
          scopedSlots: { customRender: 'purchase_price' }
        },
        {
          title: 'SKU封面图',
          dataIndex: 'cover',
          scopedSlots: { customRender: 'cover'}
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' },
        }
      ]
    }
  },
  created () {
    this.getCategoryList()
    this.getSecondaryCategoryList()
    this.getBrandList()
    this.getTemplateList()
    this.getSupplierList()
  },
  methods: {
    getCategoryList: function () {
      getCategoryList().then(res => {
        this.major_categories = res.data.data
      })
    },
    getSecondaryCategoryList: function () {
      getSecondaryCategoryList().then(res => {
        this.minor_categories = res.data.data
      })
    },
    getBrandList: function () {
      getBrandList().then(res => {
        this.brands = res.data.data
      })
    },
    getTemplateList() {
      getFeeTemplateList().then(res => {
        this.templates = res.data.data
      })
    },
    getSupplierList() {
      getSupplierList().then(res =>{
        this.suppliers = res.data.data
      })
    },
    changeType(e) {
      this.is_online = e.target.value
    },
    handleSubmit (e) {
      e.preventDefault()
      const vm = this
      vm.form.validateFields((err, values) => {
        if (!err) {
          const arr = Object.keys(vm.listObj).map(v => {
            return {
              url: vm.listObj[v].url,
              with: vm.listObj[v].width,
              height: vm.listObj[v].height
            }
          });
          values.images = arr
          values.pic_url = vm.pic_url
          values.detail = vm.detail
          values.skus = vm.skus
          addGoods(values).then(res => {
            if (res.code === 0) {
              vm.$message.success('添加成功')
              vm.$router.push({name: 'GoodsList'})
            }
          })
        }
      })
    },
    beforeCoverUpload: function () {
      let _this = this
      return getQiniuToken().then(res => {
        _this.bucketHost = res.data.bucketHost
        _this.imgForm = {
          // key: res.key,
          token: res.data.token
        }
      })
    },
    beforeUpload(file) {
      const me = this
      const fileName = file.uid
      this.listObj[fileName] = {}
      return getQiniuToken().then(res => {
        me.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        me.bucketHost = res.data.bucketHost
        me.imgForm = {
          // key: res.key,
          token: res.data.token
        }
      })
    },
    handleChange (info) {
      this.fileList = info.fileList
      if (info.file.status === 'uploading') {
        // this.loading = true
      } else if (info.file.status === 'done') {
        const { uid } = info.file;
        const objKeyArr = Object.keys(this.listObj);
        this.loading = false
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            this.listObj[objKeyArr[i]].url = `${this.bucketHost}${info.file.response.key}`
            this.listObj[objKeyArr[i]].hasSuccess = true
            return
          }
        }
      } else if (info.file.status === 'error') {
        // this.loading = false
        this.$message.error('上传图片失败，请重试')
      } else if (info.file.status === 'removed') {
        console.log('removed')
      }
    },
    handleCoverChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
      } else if (info.file.status === 'done') {
        let key = info.file.response.key
        this.pic_url = `${this.bucketHost}${key}`
        this.loading = false
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error('上传图片失败，请重试')
      } else if (info.file.status === 'removed') {
        console.log('removed')
      }
    },
    handleSkuCoverChange(info, record) {
      if (info.file.status === 'uploading') {
        this.loading = true
      } else if (info.file.status === 'done') {
        let key = info.file.response.key
        record.cover = `${this.bucketHost}${key}`
        this.loading = false
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error('上传图片失败，请重试')
      } else if (info.file.status === 'removed') {
        console.log('removed')
      }
    },
    handleAdd() {
      var obj = {
        sku: '',
        cover: '',
        attribute:'',
        purchase_price:0,
        deleted: 0,
      }
      this.skus.push(obj)
    },
    handleDelete(){
      this.skus.pop()
      this.$refs.table.refresh()
      this.$message.success('删除成功')
    }
  },

}
</script>

<style lang="less">
.sku-cover > .ant-upload {
    width: 50px;
    height: 50px;
}
.sku-cover > .ant-upload.ant-upload-select-picture-card > .ant-upload {
  padding: 0;
}
.addable-add-btn {
  margin-bottom: 10px;
}
</style>
