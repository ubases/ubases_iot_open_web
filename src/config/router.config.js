// eslint-disable-next-line
import { UserLayout, AccountLayout,TopNavLayout } from '@/layouts'
/**
 * 基础路由无需配置权限
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
    ]
  },
  {
    path: '/account',
    component: AccountLayout,
    redirect: '/account/basicInfo/index',
    hidden: true,
    children: [
      {
        path: '/account/basicInfo/index',
        name: 'BasicInfo',
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/basicInfo/index')
      },
      {
        path: '/account/enterpriseInfo/index',
        name: 'EnterpriseInfo',
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/enterpriseInfo/index')
      },
      {
        path: '/account/securitySet/index',
        name: 'SecuritySet',
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/securitySet/index')
      },
      {
        path: '/account/enterpriseCertification/index',
        name: 'EnterpriseCertification',
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/enterpriseCertification/index')
      },
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/refresh',
    name:'Refresh',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/refresh')
  },
  {
    path: '/document',
    component: TopNavLayout,
    redirect: '/document',
    hidden: true,
    children: [
      {
        path: '/document',
        name: 'document',
        component: () => import(/* webpackChunkName: "document" */ '@/views/user/Document')
      },
      {
        path: 'forgotPassword',
        name: 'forgotPassword',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/ForgotPassword')
      },
    ]
  },
  {
    path: '/doc',
    component: TopNavLayout,
    redirect: '',
    hidden: true,
    children: [
      {
        path: '/doc/privacyPolicy',
        name: 'PrivacyPolicy',
        component: () => import(/* webpackChunkName: "document" */ '@/views/doc/PrivacyPolicy')
      },
      {
        path: '/doc/serviceTerms',
        name: 'ServiceTerms',
        component: () => import(/* webpackChunkName: "user" */ '@/views/doc/ServiceTerms')
      },
      {
        path: '/doc/legalStatement',
        name: 'LegalStatement',
        component: () => import(/* webpackChunkName: "user" */ '@/views/doc/LegalStatement')
      },
      {
        path: '/doc/appUsageLicense',
        name: 'AppUsageLicense',
        component: () => import(/* webpackChunkName: "user" */ '@/views/doc/AppUsageLicense')
      },
    ]
  }
]


export const staticRouterConfig = [
  {
    children: [],
    component: "/dashboard/index",
    condition: "",
    icon: "icon-zhuye",
    id: "1128288188578562048",
    isCache: 2,
    isFrame: 2,
    isHideChildMenu: 0,
    jumpPath: "",
    menuType: 1,
    modelId: "0",
    moduleType: "sys_admin",
    name: "Home",
    parentId: "0",
    path: "/dashboard/index",
    remark: "",
    status: 1,
    title: "主页",
    visible: 1,
    weigh: 1,
  }
]