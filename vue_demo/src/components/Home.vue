<template>
  <a-layout class="layout">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo">{{ collapsed ? '练习' : '一个练手的项目' }}</div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="sub1">
          <router-link to="/search">
            <a-icon type="appstore" />
            <span>工作台</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu key="sub2" >
          <span slot="title"><a-icon type="user" /><span>用户</span></span>
          <a-menu-item key="1">
            <router-link to="/about">用户列表</router-link>
          </a-menu-item>
          <a-menu-item key="2">
            用户详情
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3" >
          <span slot="title"><a-icon type="setting" /><span>设置</span></span>
          <a-menu-item key="3">
            权限设置
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="flex" style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <a-dropdown style="float: right;margin-right: 20px;">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <img src="../assets/logo.png" width="25px" height="25px" /> 菜 鸟
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;"><a-icon type="github" />个人中心</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;"><a-icon type="edit" />修改密码</a>
            </a-menu-item>
            <a-menu-item>
              <a href="/login"><a-icon type="logout" />退出登录</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      collapsed: false
    }
  }
}
</script>
<style lang="scss">
.layout {
  height: 100vh;
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #1890ff
    }
  }
  .logo {
    height: 32px;
    color: white;
    text-align: center;
    letter-spacing: 2px;
    font-weight: bold;
    font-family: 宋体;
    font-size: 18px;
    margin: 16px
  }
}
</style>
