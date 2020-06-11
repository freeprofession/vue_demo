<template>
  <div class="main">
    <a-form class="user-layout-login" ref="formLogin" :autoFormCreate="(form)=>{this.form = form}" id="formLogin">
      <a-form-item
        fieldDecoratorId="username"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名' }, { validator: this.handleUsernameOrEmail }], validateTrigger: 'blur'}"
      >
        <a-input size="large" type="text" v-model="formLogin.username" placeholder="用户名">
          <a-icon slot="prefix" type='user' :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item
        fieldDecoratorId="password"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}">
        <a-input size="large" type="password" v-model="formLogin.password" placeholder="密码">
          <a-icon slot="prefix" type='lock' :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <!-- <a-form-item>
        <a-checkbox v-model="formLogin.rememberMe">自动登陆</a-checkbox>
      </a-form-item> -->

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn">确定
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import { mapActions } from "vuex"
  import { timeFix } from "@/utils/util"

  export default {
    data () {
      return {
        customActiveKey: "tab1",
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        form: null,
        state: {
          time: 60,
          smsSendBtn: false,
        },
        formLogin: {
          username: "",
          password: "",
          captcha: "",
          mobile: "",
          rememberMe: true
        },
      }
    },
    methods: {
      ...mapActions([ "Login" ]),
      // handler
      handleUsernameOrEmail (rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        callback()
      },
      handleTabClick (key) {
        this.customActiveKey = key
        // this.form.resetFields()
      },
      handleSubmit () {
        let that = this
        let flag = false
        let loginParams = {
          remember_me: that.formLogin.rememberMe
        };
        // 使用账户密码登陆
        if (that.customActiveKey === 'tab1') {
          that.form.validateFields([ 'username', 'password' ], { force: true }, (err, values) => {
            if (!err) {
              flag = true
              loginParams[!that.loginType ? 'email' : 'username'] = values.username
              loginParams.password = values.password
            }
          })
        // 使用手机号登陆
        } else {
          that.form.validateFields([ 'mobile', 'captcha' ], { force: true }, (err, values) => {
            if (!err) {
              flag = true
              loginParams = Object.assign(loginParams, values)
            }
          })
        }
        if (!flag) return
        that.loginBtn = true
        that.Login(loginParams).then(() => {
          that.loginSuccess()
        }).catch(() => {
          this.loginBtn = false
        })
      },
      loginSuccess () {
        this.loginBtn = false
        this.$router.push({ name: "dashboard" })
        this.$message.success(timeFix() + '，欢迎回来', 3)
      },
    }
  }
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, .2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color .3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
