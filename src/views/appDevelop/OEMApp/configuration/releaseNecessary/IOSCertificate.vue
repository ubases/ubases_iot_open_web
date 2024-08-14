<template>
  <section class="page-content">
    <!-- iOS证书 -->
    <h4 class="title">{{$t('IOSCertificate.title')}}</h4>
    <p class="details">{{$t('IOSCertificate.details')}}</p>
    <a :href="$DictValue('open_document_url','iosCertificate')" target="_blank" class="help-doc">{{$t('IOSCertificate.check.help.doc')}}</a>
    <a-form-model ref="form" class="regular-form" :rules="iosRules" :model="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
      <a-form-model-item :label="$t('IOSCertificate.label.distProvision')" prop="distCertOfficial" >
        <a-input v-show="false" v-model="form.distCertOfficial" />
        <upload-button 
          :disabled="editDisabled"
          accept=".mobileprovision"
          :buttonText="$t('public.upload')"
          warningFileType="mobileprovision"
          catalogName="app"
          :showFile="false"
          :suffixValid="true"
          @uploaded="e=>uploaded(e,'distCertOfficial','form')"
        />
        <p class="tips">{{$t('IOSCertificate.type.mobileprovision')}}</p>
        <p v-text="form.distCertOfficial ? '***.mobileprovision':''"></p>
      </a-form-model-item>
      <a-form-model-item :label="$t('IOSCertificate.label.distTestProvision')" prop="distProvision" >
        <a-input v-show="false" v-model="form.distProvision" />
        <upload-button 
          :disabled="editDisabled"
          accept=".mobileprovision"
          :buttonText="$t('public.upload')"
          warningFileType="mobileprovision"
          catalogName="app"
          :showFile="false"
          :suffixValid="true"
          @uploaded="e=>uploaded(e,'distProvision','form')"
        />
        <p class="tips">{{$t('IOSCertificate.type.mobileprovision')}}</p>
        <p v-text="form.distProvision ? '***.mobileprovision':''"></p>
      </a-form-model-item>
      <a-form-model-item :label="$t('IOSCertificate.label.distCert')" prop="distCert" >
        <a-input v-show="false" v-model="form.distCert" />
        <upload-button 
          :disabled="editDisabled"
          accept=".p12"
          :buttonText="$t('public.upload')"
          warningFileType="p12"
          catalogName="app"
          :showFile="false"
          :suffixValid="true"
          @uploaded="e=>uploaded(e,'distCert','form')"
        />
        <p class="tips">{{$t('IOSCertificate.type.p12')}}</p>
        <p v-text="form.distCert ? '***.p12':''"></p>
      </a-form-model-item>
      <a-form-model-item :label="$t('IOSCertificate.label.distCertSecret')" prop="distCertSecret" >
        <a-input :disabled="editDisabled" v-model="form.distCertSecret" :maxLength="50" :placeholder="$t('IOSCertificate.placeholder.distCertSecret')"/>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button :disabled="editDisabled" type="primary" class="save" @click="saveIosForm">{{$t('public.save')}}</a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- /iOS证书 -->
    <!-- iOS PUSH(APNS) -->
    <h4 class="title">{{$t('IOSCertificate.push.title')}}</h4>
    <p class="details">{{$t('IOSCertificate.push.details1')}}</p>
    <p class="details">{{$t('IOSCertificate.push.details')}}</p>
    <p class="attention">{{$t('IOSCertificate.push.attention')}}</p>
    <a :href="$DictValue('open_document_url','iosPushCertificate')" target="_blank" class="help-doc">{{$t('IOSCertificate.check.help.doc')}}</a>
    <a-form-model ref="pushForm" class="regular-form" :model="pushForm" :rules="pushRules" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
      <a-form-model-item :label="$t('IOSCertificate.label.apnsCert')" prop="apnsCert" >
        <a-input v-show="false" v-model="pushForm.apnsCert" />
        <upload-button 
          :disabled="editDisabled"
          accept=".p12"
          :buttonText="$t('public.upload')"
          warningFileType="p12"
          catalogName="app"
          :showFile="false"
          :suffixValid="true"
          @uploaded="e=>uploaded(e,'apnsCert','pushForm')"
        />
        <p class="tips">{{$t('IOSCertificate.type.p12')}}</p>
        <p v-text="pushForm.apnsCert ? '***.p12':''"></p>
      </a-form-model-item>
      <a-form-model-item :label="$t('IOSCertificate.label.apnsSecret')" prop="apnsSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.apnsSecret" :maxLength="50" :placeholder="$t('IOSCertificate.placeholder.apnsSecret')"/>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button :disabled="editDisabled" type="primary" class="save" @click="savePushForm">{{$t('public.save')}}</a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- /iOS PUSH(APNS) -->
  </section>
</template>
<script>

import UploadButton from "@/components/uploadButton"
import { getAppIosCert, saveAppIosCert, getAppIosPush, saveAppIosPush } from "@/api/appExploit"

export default {
  props:{
    appId:{ type:String, default:'' },
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false},  
  },
  data (){
    return {
      form:{},
      iosRules:{
        distCertOfficial:[{ required: true, message: this.$t('IOSCertificate.iosRules.distProvision'), trigger: 'change' }],
        distProvision:[{ required: true, message: this.$t('IOSCertificate.iosRules.distTestProvision'), trigger: 'change' }],
        distCert:[{ required: true, message: this.$t('IOSCertificate.iosRules.distCert'), trigger: 'change' }],
        distCertSecret:[{ required: true, message: this.$t('IOSCertificate.iosRules.distCertSecret'), trigger: '' }]
      },
      pushForm:{},
      pushRules:{
        apnsCert:[{ required: true, message: this.$t('IOSCertificate.pushRules.apnsCert'), trigger: 'change' }],
        apnsSecret:[{ required: true, message: this.$t('IOSCertificate.pushRules.apnsSecret'), trigger: '' }]
      },
      current:1,
    }
  },
  components:{
    UploadButton
  },
  mounted(){
    this.getAppIosCert()
    this.getAppIosPush()
  },
  methods:{
    // iOS证书获取
    async getAppIosCert(){
      const res = await getAppIosCert({appId:this.appId, version:this.version})
      if(res.code!==0)return
      this.form = res.data
    },

    // iOS PUSH(APNS)获取
    async getAppIosPush(){
      const res = await getAppIosPush({appId:this.appId, version:this.version})
      if(res.code!==0)return
      this.pushForm = res.data
    },

    // iOS证书保存
    saveIosForm(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        const res = await saveAppIosCert({appId:this.appId, ...this.form})
        if(res.code !== 0) return
        this.$message.success(this.$t('public.save.ok'));
        this.getAppIosCert()
        
      }); 
    },

    // iOS PUSH(APNS)保存
    savePushForm(){
      this.$refs.pushForm.validate(async(valid) => {
        if (!valid) return
        const res = await saveAppIosPush({appId:this.appId,...this.pushForm})
        if(res.code !== 0) return
        this.$message.success(this.$t('public.save.ok'));
        this.getAppIosPush()
      });
    },

    uploaded(data,type,form){
      this.$set(this[form], type, data.fullPath)
      this.$refs[form].clearValidate([type]);
    },

  }

}
</script>
<style scoped lang="less">
@import "../../../../../global.less";

.page-content{
  padding: 20px;
  
}
.regular-form{
  max-width: 700px;
}
.title{
  padding: 0 0 10px;
  font-size: 15px;
  line-height: 21px;
}
.details{
  color: @aithings-text-color-gray;
  line-height: 22px;
}
.attention{
  line-height: 22px;
  color: @aithings-warning-color-FF8E35;
}
.help-doc{
  padding: 5px 0 0;
  margin-bottom: 30px;
  height: 20px;
}

/deep/.ant-form-item-label > label{
  color: @aithings-text-color-gray;
}
/deep/.ant-form-item-control-wrapper{
  padding-left: 11px;
}

/deep/.upload-button{
  padding: 0 41px;
}

.tips{
  padding-top: 7px;
  font-size: 12px;
  color: @aithings-text-tips-color;
  line-height: 17px;
}
.save{
  padding: 0 28px;
  &:disabled{
    background: @primary-color;
    border-color: @primary-color;
    color:#fff;
    opacity: 0.4;
  }
}
/deep/.ant-input{
  border-color: @aithings-border-color;
  color: @aithings-text-color-black;
}
/deep/.ant-input::placeholder{
  color: @aithings-text-tips-color;
}

</style>