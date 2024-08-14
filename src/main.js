// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import { toast } from '@/utils/toast'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import global from '../src/utils/global'
import { Button, Switch, Image as VanImage,Slider,Stepper, Progress, Checkbox, CheckboxGroup, Calendar, Picker, Icon } from 'vant';
import Storage from '@/utils/session';
import { getPageQuery } from '@/utils/util'
import Control from "@/utils/control"

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
Vue.prototype.$isDev = process.env.NODE_ENV === "development"

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style
import 'vant/lib/index.css';

Vue.config.productionTip = false

Vue.prototype.toast = toast
import VueClipboard from 'vue-clipboard2'

// vantUI 组件
Vue.use(Button)
Vue.use(Switch )
Vue.use(VanImage)
Vue.use(Slider)
Vue.use(Stepper)
Vue.use(Progress)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Calendar)
Vue.use(Picker)
Vue.use(Icon)


// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.use(global)
Vue.use(VueClipboard)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme
window.Storage = Storage
window.getPageQuery = getPageQuery
window.Control = Control

new Vue({
  i18n,
  router,
  store,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
