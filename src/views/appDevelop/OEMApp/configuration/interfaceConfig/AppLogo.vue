<template>
  <section class="config-content flex x-space-between">
    <section class="config-wrap">
      <h4 class="config-title">
        {{$t('appLogo.title')}}
      </h4>
      <p class="config-tips">
        {{$t('appLogo.config')}}
      </p>
      <section class="upload-wrap">
        <upload-button 
          :disabled="editDisabled"
          accept="image/png"
          :acceptList="['image/png']"
          :limitSize="2"
          :limitWidth="1024"
          :limitHeight="1024"
          warningFileType="PNG"
          catalogName="app"
          :imgWrapWidth="200"
          :imgWrapHeight="200"
          :fileUrl="logoUrl"
          :showMsg="false"
          @uploaded="uploaded"
        >
        <p class="tips" slot="tips">
          {{$t('appLogo.tips')}}
        </p>
        </upload-button>
      </section>

    </section>
    <section class="preview-wrap">
       <h4 class="config-title">
        {{$t('public.previewResults')}}
        
      </h4>
       <section class="preview-phone-wrap iphone-xs-max-shell">
         <section class="phone-bg">
           <div class="logo-preview">
             <img :src="logoUrl || styleInfo.baseConf.defImageUrl" class="image"/>
           </div>
         </section>
       </section>
    </section>
  </section>
</template>

<script>

import { getAppLogo, saveAppLogo } from "@/api/appExploit"
import UploadButton from "@/components/uploadButton"

export default {
  props:{
    appId:{ type:String, default:''},
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false},
  },
  components:{
    UploadButton
  },
  data (){
    return {
      logoUrl:require('../../../../../assets/image/logo_default.png'),
      id:"",
    }
  },
  mounted(){
    this.getAppLogo()
  },
  methods:{
    // 获取logo数据
    async getAppLogo(){
      const res = await getAppLogo({appId:this.appId,version:this.version})
      if(res.code !== 0) return
      if(res.data.iconUrl) this.logoUrl = res.data.iconUrl
      this.id = res.data.id
    },

    // 保存logo数据
    async saveAppLogo(iconUrl){
      const res = await saveAppLogo({id:this.id,iconUrl})
      return res
    },

    async uploaded(data){
      const res1 = await this.saveAppLogo(data.fullPath)
      if(res1.code !== 0 )return
      this.$message.success(this.$t('public.uploadImg.succeed'))
      await this.getAppLogo()
      this.$emit('updateDetails')
    },
    
  }

}
</script>

<style  lang="less" scoped>
@import "../../../../../global.less";
@import "./common.less";

  .upload-wrap{
    padding-top: 20px;
  }

  .tips{
    padding-bottom: 20px;
    max-width: 410px;
    font-size: 12px;
    color: @aithings-text-tips-color;
    line-height: 18px;
  }

  .preview-phone-wrap{
    margin-top: 18px;
    position: relative;
    .phone-bg{
      position: relative;
      background: #000 url("../../../../../assets/image/logo_bg.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .logo-preview{
    position: absolute;
    left: 12px;
    top: 112px;
    overflow: hidden;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    .image{
      width: 100%;
      height: 100%;
    }
  }
</style>