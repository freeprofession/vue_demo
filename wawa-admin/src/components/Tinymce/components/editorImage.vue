<template>
  <div class="upload-container">
    <a-button @click="dialogVisible = true" size="small" type="primary">
      <a-icon type="cloud-upload" />上传图片
    </a-button>
    <a-modal title="图片上传" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <a-upload
        name='file'
        action="//upload.qiniup.com"
        listType="picture-card"
        :multiple="true"
        :fileList="fileList"
        :beforeUpload="beforeUpload"
        @remove="handleRemove"
        @change="handleChange"
        :data="imgForm"
      >
        <div>
          <a-icon type="plus" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
      <div slot="footer" class="text-right">
        <a-button type="primary" @click="handleSubmit">
          <i class="fas fa-cloud-upload-alt" aria-hidden="true"></i> 上传
        </a-button>
        <a-button @click="dialogVisible = false">
          <i class="fas fa-times" aria-hidden="true"></i> 关 闭
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getQiniuToken } from '@/api/qiniu'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      imgForm: {},
      bucketHost: ''
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message.error('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleChange(info) {
      this.fileList = info.fileList
      if (info.file.status === 'uploading') {
        // this.loading = true
      } else if (info.file.status === 'done') {
        const { uid } = info.file;
        const objKeyArr = Object.keys(this.listObj);
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            this.listObj[objKeyArr[i]].url = `${this.bucketHost}${info.file.response.key}`
            this.listObj[objKeyArr[i]].hasSuccess = true
            return
          }
        }
        this.loading = false
      } else if (info.file.status === 'error') {
        // this.loading = false
        this.$message.error('上传图片失败，请重试')
      } else if (info.file.status === 'removed') {
        console.log('删除')
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
