<template>
  <a-layout id="components-layout-demo-top-side-2" style="height:100%">
    <a-layout-header class="header">
      <div class="logo" >
        <span @click="backIndex">
          <!-- <logo-white-icon style="transform: translateY(10px); margin-right: 17px;"></logo-white-icon> -->
          <img src="../assets/logo_white.png" class="logo-img"/>
          <span>{{$t('system.title')}}</span>
          <version/>
        </span>
      </div>
    </a-layout-header>
      <a-layout>
        <a-layout-content
          :style="{ margin: 0, height: '100%',}"
        >
          <router-view />
        </a-layout-content>
      </a-layout>
  </a-layout>
</template>
<script>
import { LogoWhiteIcon } from '@/core/icons'
import Version from "@/components/GlobalHeader/Version.vue";
export default {
  data() {
    return {
      collapsed: false,
    };
  },
  components:{
    LogoWhiteIcon,
    Version
  },
  methods:{
    toView(name){
      this.$router.push({name})
    },
    backIndex(){
      this.$router.push({path:'/'})
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
  /deep/.ant-layout-content{
    overflow-y: auto;
  }
  .header{
    background: linear-gradient(118deg, #0B5CFF 0%, #73BAFF 100%);
    box-shadow: 0px 4px 8px 0px rgba(166, 196, 255, 0.4);
    color:#fff;
    font-size: 20px;
    padding: 0 16px
  }
</style>