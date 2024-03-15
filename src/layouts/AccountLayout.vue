<template>
  <a-layout id="components-layout-demo-top-side-2" style="height:100%">
    <a-layout-header class="header">
      <div class="logo" >
        <span @click="backIndex" class="tap-pointer">
          <!-- <logo-white-icon style="transform: translateY(10px); margin-right: 17px;"></logo-white-icon> -->
          <img src="../assets/logo_white.png" class="logo-img"/>
          <span>{{$t('system.title')}}</span>
          <version/>
        </span>
        <right-content :theme="settings.theme" />
      </div>

    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
          v-model="selectedKeys"
        >
            <p slot="title">{{$t('system.myAccount')}}</p>
            <a-menu-item key="BasicInfo" @click="toView('BasicInfo')">
              {{$t('system.basicInfo')}}
            </a-menu-item>
            <a-menu-item v-if="$store.getters.userInfo.accountType == 1" key="EnterpriseInfo" @click="toView('EnterpriseInfo')">
              {{$t('system.enterpriseInfo')}}
            </a-menu-item>
            <a-menu-item key="SecuritySet" @click="toView('SecuritySet')">
              {{$t('system.securitySet')}}
            </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 20px;background:rgba(244, 248, 254, 1);">
        <a-layout-content :style="{ background: '#fff', margin: 0, height: '100%',}">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>

  </a-layout>
</template>
<script>
import { LogoWhiteIcon } from '@/core/icons'
import RightContent from "@/components/GlobalHeader/RightContent";
import defaultSettings from "@/config/defaultSettings";
import Version from "@/components/GlobalHeader/Version.vue";

export default {
  data() {
    return {
      collapsed: false,
      // 是否手机模式
      isMobile: false,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
         // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
      },
      selectedKeys:[]
    };
  },
  components:{
    LogoWhiteIcon,
    RightContent,
    Version
  },
  mounted(){
    this.selectedKeys = [this.$route.name] || ''
  },
  methods:{
    toView(name){
      this.$router.push({name})
    },
    backIndex(){
      this.$router.push({path:'/dashboard/index'})
    }
  }
};
</script>

<style lang="less" scoped>
  .logo-img{
    margin: -1px 20px 0 0;
    width: 44px;
    height: 44px;
  }
.header{
  background: linear-gradient(118deg, #0B5CFF 0%, #73BAFF 100%);
  box-shadow: 0px 4px 8px 0px rgba(166, 196, 255, 0.4);
  color:#fff;
  font-size: 20px;
  padding: 0 16px
}
/deep/ .ant-pro-account-avatar{
  font-size: 14px;
}
</style>