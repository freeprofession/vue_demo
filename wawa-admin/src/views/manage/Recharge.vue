<template>
  <div class="box">
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="12">
        <a-form>
          <a-card>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="用户账号">
              <!-- <a-input placeholder="请输入用户ID" /> -->
              <a-input-search placeholder="请输入用户ID" v-model="uid" @search="queryUser" enterButton="搜索" size="large" />
            </a-form-item>
          </a-card>
        </a-form>

        <a-form v-if="user.id">
          <a-card>
            <a-card-meta
              :title="user.nickname"
              :description="user.uid">
              <a-avatar slot="avatar" :src="user.avatar" />
            </a-card-meta>
          </a-card>
          <a-card>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="存入数量">
              <!-- <a-input-search placeholder="请输入娃娃数量" v-model="uid" @search="queryUser" enterButton="搜索" size="large" /> -->
              <a-input-number :min="1" v-model="doll" />
            </a-form-item>
            <a-form-item class="center">
              <a-button type="primary" @click="recharge">提交</a-button>
            </a-form-item>
          </a-card >
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { getUserList } from '@/api/user'
import { recharge } from '@/api/manage'

export default {
  name: 'Recharge',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      uid: '',
      user: {},
      doll: 1
    }
  },
  methods: {
    queryUser() {
      const params = {
        filter: {
          keyword: this.uid
        }
      }
      getUserList(params).then(res => {
        if (res.data.data.length > 0) {
          this.user = res.data.data[0]
        }
      })
    },
    recharge() {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定要向用户${this.user.nickname}存入${this.doll}个娃娃吗`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          const params = {
            user_id: _this.user.uid,
            doll: _this.doll
          }
          recharge(params).then(res => {
            if (res.code === 0) {
              _this.$message.success('存入成功')
              _this.uid = ''
              _this.user = {}
              _this.doll = 1
            } else {
              _this.$message.error('存入失败')
            }
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      })
    }
  }
}
</script>
<style scoped>
  .box {
    margin-top: 50px
  }
  .ant-avatar {
    width: 64px;
    height: 64px;
    line-height: 64px;
  }
  .center {
    text-align: center
  }
</style>
