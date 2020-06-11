import { UserLayout, BasicLayout, RouteView, PageView } from '@/components/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        component: PageView,
        redirect: '/dashboard/way_goods',
        meta: { title: '工作台', icon: 'dashboard', role: [ 'manager', 'super', 'admin', 'guest'] },
        children: [
          {
            path: '/dashboard/stock',
            name: 'StockList',
            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/Stock'),
            meta: { title: '门店库存', role: [ 'manager', 'super', 'admin'] }
          },
          {
            path: '/dashboard/way_goods',
            name: 'WayGoods',
            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/WayGoods'),
            meta: { title: '在途总表', role: [ 'manager','super', 'admin' ] }
          },
          {
            path: '/dashboard/way_goods/:id/list',
            name: 'WayGoodsList',
            hidden:true,
            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/WayGoodsList'),
            meta: { title: '在途商品', role: [ 'manager','super', 'admin' ] }
          },
          {
            path: '/dashboard/inventory',
            name: 'InventoryList',
            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/InventoryList'),
            meta: { title: '盘点表', role: [ 'manager', 'super', 'admin'] }
          },
          {
            path: '/dashboard/reviewInventory',
            name: 'ReviewInventory',
            hidden:true,
            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/ReviewInventory'),
            meta: { title: '盘点表', role: [ 'manager', 'super', 'admin'] }
          },
          {
            path: '/dashboard/copytable',
            name: 'CopyTable',
            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/CopyTable'),
            meta: { title: '抄码表', role: [ 'manager', 'super', 'guest'] }
          },
          {
            path: '/dashboard/copytab',
            name: 'CopyTab',
            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/CopyTab'),
            meta: { title: '抄表数据', role: [ 'manager', 'super', 'guest' ] }
          },
        ]
      },

      // goods
      {
        path: '/goods',
        name: 'goods',
        component: PageView,
        redirect: '/goods/list',
        meta: { title: '商品管理', icon: 'form', role: [ 'super','admin' ] },
        children: [
          {
            path: '/goods/list',
            name: 'GoodsList',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/GoodsList'),
            meta: { title: '商品列表', role: [ 'super','admin' ] }
          },
          {
            path: '/goods/add',
            name: 'AddGoods',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/AddGoods'),
            meta: { title: '新增商品', role: ['super', 'admin'] }
          },
          {
            path: '/goods/:id/edit',
            name: 'EditGoods',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/EditGoods'),
            hidden: true,
            meta: { title: '更新商品', role: ['super', 'admin'] }
          },
        ]
      },

      // order
      {
        path: '/order',
        name: 'order',
        component: PageView,
        redirect: '/order/list',
        meta: { title: '订单管理', icon: 'table', role: [ 'super','admin' ] },
        children: [
          {
            path: '/order/list',
            name: 'OrderList',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/OrderList'),
            meta: { title: '订单列表', keepAlive:'true', role: [ 'super','admin' ] }
          },
          {
            path: '/order/data',
            name: 'OrderData',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/OrderData'),
            meta: { title: '订单数据', keepAlive:'true', role: [ 'super','admin' ] }
          },
          {
            path: '/order/:id',
            name: 'ViewOrder',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Order'),
            hidden: true,
            meta: { title: '订单详情', role: ['super', 'admin'] }
          }
        ]
      },

      // user
      {
        path: '/user',
        name: 'user',
        component: RouteView,
        redirect: '/user/list',
        meta: { title: '用户管理', icon: 'user', role: [ 'super','admin' ] },
        children: [
          {
            path: '/user/list',
            name: 'UserList',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/UserList'),
            meta: { title: '用户列表', role: [ 'super','admin' ] }
          },
          {
            path: '/record/list',
            name: 'UserRecordList',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/UserRecordList'),
            meta: { title: '充值查询', role: [ 'super','admin'] }
          },
          {
            path: '/sponsor/list',
            name: 'UserSponsor',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/UserSponsor'),
            meta: { title: '赞助查询', role: [ 'super','admin'] }
          },
        ]
      },

      // setting
      {
        path: '/setting',
        name: 'setting',
        component: PageView,
        redirect: '/setting/branch',
        meta: { title: '设置管理', icon: 'setting', role: [ 'super' ] },
        children: [
          {
            path: '/setting/branch',
            name: 'Branch',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Branch'),
            meta: { title: '店铺管理', role: ['super'] }
          },
          {
            path: '/setting/category',
            name: 'Category',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Category'),
            meta: { title: '主分类管理', role: ['super'] }
          },
          {
            path: '/setting/secondary_categories',
            name: 'SecondaryCategory',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/SecondaryCategory'),
            meta: { title: '副分类管理', role: ['super'] }
          },
          {
            path: '/setting/brand',
            name: 'Brand',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Brand'),
            meta: { title: '品牌管理', role: ['super'] }
          },
          {
            path: '/setting/banner',
            name: 'Banner',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Banner'),
            meta: { title: '轮播图管理', role: ['super'] }
          },
          {
            path: '/setting/tag',
            name: 'Tag',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Tag'),
            meta: { title: '标签管理', role: ['super'] }
          },
          {
            path: '/setting/fee-template',
            name: 'FeeTemplate',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/FeeTemplate'),
            meta: { title: '邮费管理', role: ['super'] }
          },
        ]
      },
      // account
      {
        path: '/account',
        component: RouteView,
        name: 'account',
        hidden: true,
        meta: { title: '个人页', icon: 'user', role: [ 'super', 'admin'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/Center'),
            meta: { title: '个人中心', role: [ 'super', 'admin'] }
          },
          {
            path: '/account/change',
            name: 'change',
            component: () => import('@/views/account/ChangePass'),
            meta: { title: '修改密码', role: [ 'super', 'admin']  },
          },
        ]
      },
      // manage
      // {
      //   path: '/manage',
      //   component: RouteView,
      //   name: 'manage',
      //   meta: { title: '兑换管理', icon: 'user', role: [ 'manager' ] },
      //   children: [
      //     {
      //       path: '/manage/recharge',
      //       name: 'recharge',
      //       component: () => import('@/views/manage/Recharge'),
      //       meta: { title: '娃娃充值', role: [ 'manager' ] }
      //     },
      //     {
      //       path: '/manage/exchange',
      //       name: 'exchange',
      //       component: () => import('@/views/manage/Exchange'),
      //       meta: { title: '娃娃兑换', role: [ 'manager' ]  },
      //     },
      //   ]
      // },

      // purchase
      {
        path: '/purchase',
        name: 'purchase',
        component: PageView,
        redirect: '/purchase/option',
        meta: { title: '大货采购平台', icon: 'table', role: [ 'super','admin' ] },
        children: [
          {
            path: '/purchase/option',
            name: 'OptionList',
            component: () => import(/* webpackChunkName: "purchase" */ '@/views/purchase/OptionList'),
            meta: { title: '选款页面', keepAlive:'true', role: [ 'super','admin' ] }
          },
          {
            path: '/purchase/cart',
            name: 'Cart',
            component: () => import(/* webpackChunkName: "purchase" */ '@/views/purchase/Cart'),
            meta: { title: '订单记录', role: [ 'super','admin' ] }
          },
          {
            path: '/purchase/list',
            name: 'BuyList',
            component: () => import(/* webpackChunkName: "purchase" */ '@/views/purchase/BuyList'),
            meta: { title: '订单总表', role: [ 'super','admin','finance' ] }
          },
          {
            path: '/purchase/abnormal',
            name: 'Abnormal',
            component: () => import(/* webpackChunkName: "purchase" */ '@/views/purchase/Abnormal'),
            meta: { title: '异常订单', role: [ 'super','admin' ] }
          },
          {
            path: '/purchase/:id/detail',
            name: 'BuyDetail',
            component: () => import(/* webpackChunkName: "purchase" */ '@/views/purchase/BuyDetail'),
            hidden: true,
            meta: { title: '订单详情', role: [ 'super','admin' ] }
          },
          {
            path: '/purchase/:id/abnormaltail',
            name: 'Abnormaltail',
            component: () => import(/* webpackChunkName: "purchase" */ '@/views/purchase/Abnormaltail'),
            hidden: true,
            meta: { title: '异常订单详情', role: [ 'super','admin' ] }
          },
        ]
      },
      //smallpurchase
      // { 
      //   path: '/smallpurchase',
      //   name: 'smallpurchase',
      //   component: PageView,
      //   redirect: '/smallpurchase/option',
      //   meta: { title: '小货采购平台', icon: 'table', role: [ 'super','admin' ] },
      //   children: [
      //     {
      //       path: '/smallpurchase/option',
      //       name: 'SOptionList',
      //       component: () => import(/* webpackChunkName: "smallpurchase" */ '@/views/smallpurchase/OptionList'),
      //       meta: { title: '选款页面', keepAlive:'true', role: [ 'super','admin' ] }
      //     },
      //     {
      //       path: '/smallpurchase/cart',
      //       name: 'SCart',
      //       component: () => import(/* webpackChunkName: "smallpurchase" */ '@/views/smallpurchase/Cart'),
      //       meta: { title: '订单记录', role: [ 'super','admin' ] }
      //     },
      //     {
      //       path: '/smallpurchase/list',
      //       name: 'SBuyList',
      //       component: () => import(/* webpackChunkName: "smallpurchase" */ '@/views/smallpurchase/BuyList'),
      //       meta: { title: '订单总表', role: [ 'super','admin','finance' ] }
      //     },
      //     {
      //       path: '/smallpurchase/abnormal',
      //       name: 'SAbnormal',
      //       component: () => import(/* webpackChunkName: "smallpurchase" */ '@/views/smallpurchase/Abnormal'),
      //       meta: { title: '异常订单', role: [ 'super','admin' ] }
      //     },
      //     {
      //       path: '/smallpurchase/:id/detail',
      //       name: 'SBuyDetail',
      //       component: () => import(/* webpackChunkName: "smallpurchase" */ '@/views/smallpurchase/BuyDetail'),
      //       hidden: true,
      //       meta: { title: '订单详情', role: [ 'super','admin' ] }
      //     },
      //     {
      //       path: '/smallpurchase/:id/abnormaltail',
      //       name: 'SAbnormaltail',
      //       component: () => import(/* webpackChunkName: "smallpurchase" */ '@/views/smallpurchase/Abnormaltail'),
      //       hidden: true,
      //       meta: { title: '异常订单详情', role: [ 'super','admin' ] }
      //     },
      //     {
      //       path: '/smallpurchase/upload',
      //       name: 'Upload',
      //       component: () => import(/* webpackChunkName: "smallpurchase" */ '@/views/smallpurchase/Upload'),
      //       meta: { title: '图片上传', role: ['super','admin' ] }
      //     },
      //   ]
      // },

      // setting
      {
        path: '/making',
        name: 'making',
        component: PageView,
        meta: { title: '采购管理', icon: 'setting', role: [ 'super', 'admin', 'finance' ] },
        children: [
          {
            path: '/making/supplier',
            name: 'Supplier',
            component: () => import(/* webpackChunkName: "making" */ '@/views/making/Supplier'),
            meta: { title: '供应商管理', role: ['super','admin' ] }
          },
          {
            path: '/making/pay',
            name: 'PayList',
            component: () => import(/* webpackChunkName: "making" */ '@/views/making/PayList'),
            meta: { title: '付款订单', role: [ 'super','finance' ] }
          },
          {
            path: '/making/analysis',
            name: 'test',
            component: () => import(/* webpackChunkName: "making" */ '@/views/making/test'),
            meta: { title: '分析页', role: [ 'super' ] }
          },
          {
            path: '/making/copytables',
            name: 'CopyTables',
            component: () => import(/* webpackChunkName: "making" */ '@/views/making/CopyTables'),
            meta: { title: '抄码表', role: ['super', 'admin'] }
          },
          {
            path: '/making/analytable',
            name: 'AnalyTable',
            component: () => import(/* webpackChunkName: "making" */ '@/views/making/AnalyTable'),
            meta: { title: '数据分析表', role: ['super', 'admin'] }
          },
        ]
      },
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/auth',
    component: UserLayout,
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/Login')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/404')
  },

]
