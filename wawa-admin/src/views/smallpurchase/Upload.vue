<template>
  <div>
      <a-card class="card" title="图片信息" :bordered="false">
        <a-row>
          <a-col :md="24">
            <a-upload
                action="//upload.qiniup.com"
                listType="picture-card"
                :multiple="true"
                :fileList="fileList"
                :beforeUpload="beforeUpload"
                :data="imgForm"
                @change="handleChange"
            >
              <div>
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>                 
              </div>
            </a-upload>
          </a-col>
        </a-row>
      </a-card>
  </div>
</template>
<script>
import { getQiniuToken } from '@/api/qiniu'

export default {
  name: 'Upload',
  data() {
    return {
      loading: false,
      imgForm: {},
      bucketHost: '',
      fileList: [],
      listObj: [],
      pic_url: {},

    }
  },
  methods: {
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
        this.loading = true
      } else if (info.file.status === 'done') { 
        this.loading = false
        const { uid } = info.file;
        const img_url = this.bucketHost + info.file.response.key
        this.pic_url[uid] = img_url
        const objKeyArr = Object.keys(this.listObj);
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
    }
  }
}
</script>

