<template>
  <section class="page-content">
    <!-- Android Push 证书 -->
    <h4 class="title">{{$t('AndroidCertificate.push.title')}}</h4>
    <p class="details">{{$t('AndroidCertificate.push.details')}}</p>
    <p class="details">{{$t('AndroidCertificate.push.details.custom')}}</p>
    <div style="height:15px" class="space"></div>
    <a-form-model ref="pushForm" class="regular-form" :model="pushForm" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
      <!-- 推送通道 -->
      <h4 class="list-title">1.{{$t('AndroidCertificate.push.channel')}}</h4>
      <p class="list-item">> {{$t('AndroidCertificate.Aurora.push.channel')}}</p>
      <a-form-model-item :label="$t('AndroidCertificate.label.jpushKey')" prop="jpushKey" >
        <a-input :disabled="editDisabled" v-model="pushForm.jpushKey" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.jpushKey')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.jpushSecret')" prop="jpushSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.jpushSecret" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.jpushSecret')"/>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button :disabled="editDisabled" type="primary" class="save-all-button" @click="savePushForm(['jpushKey','jpushSecret'])">{{$t('public.save')}}</a-button>
      </a-form-model-item>
      <!-- 推送给海外用户 -->
      <h4 class="list-title">2.{{$t('AndroidCertificate.push.to.overseas.users')}}</h4>
      <p class="list-item">> {{$t('AndroidCertificate.set.google.fcm')}} 
        <a :href="$DictValue('open_document_url','googleCertificate')" target="_blank" class="help-doc">{{$t('IOSCertificate.check.help.doc')}}</a>
      </p>
      <a-form-model-item :label="$t('AndroidCertificate.label.fcmServerJson')" prop="fcmServerJson" >
        <a-input v-show="false" v-model="pushForm.fcmServerJson" />
        <upload-button 
          :disabled="editDisabled"
          accept="application/json"
          :acceptList="['application/json']"
          :buttonText="$t('public.upload')"
          warningFileType="json"
          catalogName="app"
          :showFile="false"
          @uploaded="e=>uploaded(e,'fcmServerJson')"
        />
        <p v-text="pushForm.fcmServerJson ? '***.json':''"></p>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button :disabled="editDisabled" type="primary" class="save-all-button" @click="savePushForm(['fcmServerJson'])">{{$t('public.save')}}</a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- /Android Push 证书 -->
  </section>
</template>
<script>

import UploadButton from "@/components/uploadButton"
import { getAppAndroidPush, saveAppAndroidPush } from "@/api/appExploit"

export default {
  props:{
    appId:{ type:String, default:'' },
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false}, 
  },
  data (){
    return {
      pushForm: {},
      originPushForm: {},
    }
  },

  components:{
    UploadButton,
  },

  mounted(){
    this.getAppAndroidPush()
  },

  methods:{
    // Android PUSH(APNS)获取
    async getAppAndroidPush(keys){
      const res = await getAppAndroidPush({ appId: this.appId, version: this.version })
      if( res.code !== 0 ) return
      this.originPushForm = {...res.data}
      if(keys){
        keys.forEach(key => {
          this.pushForm[key] = res.data[key]
        })
        return
      }
      this.pushForm = {...res.data}
    },

    // Android Push 证书
    async savePushForm(keys){
      // 判断是否有空值
      let emptyKey = keys.filter(key => !this.pushForm[key] || this.pushForm[key].trim() === '')
      if( emptyKey.length > 0 ) {
        emptyKey = emptyKey.map(key=>this.$t(`AndroidCertificate.label.${key}`)) 
        this.$message.error(this.$t('public.save.fail')+'! '+ emptyKey.join(', ') + ' ' + this.$t('AndroidCertificate.rules.notEmpty'))
        return
      }
      keys.forEach(key => {
        this.originPushForm[key] = this.pushForm[key]
      })
      const res = await saveAppAndroidPush({appId:this.appId, ...this.originPushForm})
      if(res.code !== 0) return
      this.$message.success(this.$t('public.save.ok'))
      this.getAppAndroidPush(keys)
    },

    uploaded(data,type){
      this.$set(this.pushForm, type, data.fullPath)
    },

  }

}
</script>
<style scoped lang="less">
@import "../../../../global.less";
.page-content{
  padding: 20px;
}
.regular-form{
  max-width: 850px;
}
.title{
  padding: 0 0 10px;
  font-size: 15px;
  line-height: 21px;
}
.list-title{
  padding: 14px 0 15px;
  font-size: 15px;
  color: @aithings-text-color-gray;
  line-height: 21px;
}
.list-item{
  padding-bottom: 20px;
  color: @aithings-text-color-black;
  line-height: 20px;
  .help-doc{
    padding-left: 20px;
  }
}
.details{
  color: @aithings-text-color-gray;
  line-height: 22px;
}
.help-doc{
  padding: 0;
  height: 20px;
}

/deep/.ant-form-item-label > label{
  color: @aithings-text-color-gray;
}
/deep/.ant-form-item-control-wrapper{
  padding-left: 11px;
}
/deep/.ant-form-item{
  margin-bottom: 16px;
}
/deep/.upload-button{
  padding: 0 41px;
}
/deep/.ant-input{
  max-width: 400px;
  border-color: @aithings-border-color;
  color: @aithings-text-color-black;
}
/deep/.ant-input::placeholder{
  color: @aithings-text-tips-color;
}
/deep/.ant-input[disabled]{
  background-color: @aithings-table-thread-color;
}
.push-channel{
  padding-left: 20px;
}
.upload-button:disabled{
  background: #fff;
  opacity: 0.4;
  border-color: @primary-color;
  color: @primary-color;
}
.save-all-button{
  width: 91px;
  &:disabled{
    background: @primary-color;
    border-color: @primary-color;
    color:#fff;
    opacity: 0.4;
  }
}
</style>