<template>
  <section class="build-content">
    <template v-if="status == 1">
      <on-store-check :data="checkData" @changeTab="changeTab"/>
    </template>
    <template v-if="status > 1">
      <building :appId="appId" :version="version" :status="status" :appName="appName" :editDisabled="editDisabled" @isToPublish="isToPublish" @sumitBuild="sumitBuild"/>
    </template>
    <build-tips v-if="status == 1" :data="checkData" :visible="tipsVisible" @cancel="handleCancelTips" @sumit="handleSumitBuild"/>
  </section>
</template>
<script>
import onStoreCheck from "./OnStoreCheck.vue"
import BuildTips from "./BuildTips.vue"
import Building from "./Building.vue"
import { getAppBuildCheck, buildAppPkg } from '@/api/appExploit'

export default {
  props:{
    appId: { type:String, default:'' },
    appName: { type:String, default:'' },
    version:{ type:String, default:''},
    editDisabled: { type:Boolean, default:false },
    status: { type:Number, default: 1 },
    tipsVisible: { type:Boolean, default:false },
    
  },

  components:{
    onStoreCheck,
    BuildTips,
    Building
  },
  data(){
    return {
      visible:false,
      statusList:{
        1:{components:"onStoreCheck"},
        2:{components:"Building"},
      },
      checkData:{}
    }
  },
  mounted(){
    if(this.status == 1)this.getAppBuildCheck()
  },
  methods:{
    // 构建App检查
    async getAppBuildCheck(){
      const res = await getAppBuildCheck({ appId:this.appId, version:this.version })
      if(res.code !== 0) return
      this.checkData = res.data
    },

    // 确认构建
    async handleSumitBuild(os){
      const res = await buildAppPkg({ appId:this.appId, os,version:this.version})
      if(res.code !== 0) return
      this.$emit('sumitBuild')
    },

    // 重新构建
    sumitBuild(){
      this.$emit('sumitBuild')
    },

    // 取消构建
    handleCancelTips(){
      this.$emit('cancelBuildTips')
    },

    // 是否可进入下一步
    isToPublish(value){
      this.$emit('isToPublish',value)
    },

    // 返回上架必备配置
    changeTab(item){
      this.$emit('changeTab',item)
    },

  }

}
</script>
<style scoped lang="less">
.build-content{
  height: calc(100% - 108px);
}
/deep/.steps-bar{
  padding: 0 20px;
}
</style>