<template>
  <section class="content">
    <h4 class="title">{{$t('ExpandFunction.title')}}</h4>
    <a-form-model ref="form" class="regular-form" :model="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-form-model-item :label="$t('ExpandFunction.aboutUs')" prop="aboutUs" >
        <a-radio-group :disabled="editDisabled" v-model="form.aboutUs" :options="$DictList('is_support')" @change="handleSave"/>
        <p class="detail" v-if="form.aboutUs === 1 && !form.hasAboutus">{{ $t('ExpandFunction.aboutUs.detail') }}<span class="go tap-pointer" @click="goConfig(0)">{{ $t('ExpandFunction.go.rightnow') }}</span></p>
      </a-form-model-item>
      <a-form-model-item :label="$t('ExpandFunction.weather')" prop="weather" >
        <a-radio-group :disabled="editDisabled" v-model="form.weather" :options="$DictList('is_support')"  @change="handleSave"/>
      </a-form-model-item>   
      <a-form-model-item :label="$t('ExpandFunction.geo')" prop="geo" >
        <a-radio-group :disabled="editDisabled" v-model="form.geo" :options="$DictList('is_support')"  @change="handleSave"/>
        <p class="detail" v-if="form.geo === 1 && !form.hasGeo">{{ $t('ExpandFunction.geo.detail') }}<span class="go tap-pointer" @click="goConfig(5)">{{ $t('ExpandFunction.go.rightnow') }}</span></p>
      </a-form-model-item> 
    </a-form-model>
  </section>
</template>
<script>

import { getAppFunctionConfig, saveAppFunctionConfig } from "@/api/appExploit"

export default {
  props:{
    appId:{ type:String, default:''},
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false},
  },
  data (){
    return {
      form:{
        aboutUs:1,
        weather:1,
      }
    }
  },
  mounted(){
    this.getAppFunctionConfig()
  },
  methods:{
    async getAppFunctionConfig(){
      const res = await getAppFunctionConfig({appId:this.appId, version:this.version})
      if(res.code !== 0) return
      this.form = res.data
    },

    async handleSave(){
      const res = await saveAppFunctionConfig(this.form)
      if(res.code!==0) return
      this.$message.success(this.$t('public.update.succeed'));
      this.getAppFunctionConfig()
    },

    goConfig(tab){
      this.$emit('changeTab',{activeStep:3, activeTab:tab})
    }
  }

}
</script>
<style scoped lang="less">
@import "../../../../../global.less";
.content{
  padding: 20px;
  max-width: 800px;
}
.title{
  padding: 0 0 30px;
  font-size: 15px;
  line-height: 21px;
}
/deep/.ant-form-item-label > label{
  color: @aithings-text-color-gray;
}
.detail{
  color: @aithings-text-tips-color;
}
.go{
  color: @primary-color;
}
</style>