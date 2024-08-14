<template>
  <section class="page-content">
    <!-- Android App 证书 -->
    <h4 class="title">{{$t('AndroidCertificate.title')}}</h4>
    <p class="details">{{$t('AndroidCertificate.details')}}</p>
    <p class="details">{{$t('AndroidCertificate.details1')}}</p>
    <div style="height:10px" class="space"></div>
    <a :href="$DictValue('open_document_url','androidCertificate')" target="_blank" class="help-doc">{{$t('IOSCertificate.check.help.doc')}}</a>
    <div style="height:20px" class="space"></div>
    <p class="details">{{$t('AndroidCertificate.heavy.signature')}}</p>
    <div style="height:30px" class="space"></div>
    <a-form-model ref="form" class="regular-form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-model-item :label="$t('AndroidCertificate.heavy.signature.label')" prop="resign" >
        <a-radio-group :disabled="editDisabled" v-model="form.resign" :options="$DictList('androidResign')" @change="resignChange"/>
      </a-form-model-item>
      <a-form-model-item v-if="form.resign == 1" :label="$t('AndroidCertificate.sha256.label')" prop="sha256" >
        <div v-for="item in form.sha256" :key="item">
          <a-input :value="item" disabled :placeholder="$t('AndroidCertificate.sha256.placeholder')"/>
          <a-button type="link" class="copy-button" v-clipboard:copy="item" v-clipboard:success="onCopy">
            <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
          </a-button>
        </div>
        <a-button v-if="!SHA256InputVisiable" :disabled="editDisabled" type="link" @click="addSHA256"><a-icon type="plus"/>{{$t('AndroidCertificate.sha256.add')}}</a-button>
        <section v-if="SHA256InputVisiable" class="flex y-axis-center">
          <a-input v-model="editSHA256" :maxLength="50" :placeholder="$t('AndroidCertificate.sha256.placeholder')"/>
          <a-button @click="saveSHA256" class="save-button">{{$t('public.save')}}</a-button>
          <a-button @click="SHA256InputVisiable = false" class="cancel-button">{{$t('public.cancel')}}</a-button>
        </section>
      </a-form-model-item>
    </a-form-model>
    <div style="height:8px" class="space"></div>
    <p class="details">{{$t('AndroidCertificate.apply.certificate')}}</p>
    <div style="height:24px" class="space"></div>
    <a-form-model class="regular-form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-model-item label="MD5" prop="ksMd5" >
        <a-input :value="form.ksMd5" disabled/>
        <a-button type="link" class="copy-button" v-clipboard:copy="form.ksMd5" v-clipboard:success="onCopy">
          <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="SHA1" prop="ksSha1" >
        <a-input :value="form.ksSha1" disabled/>
        <a-button v-if="form.ksSha1" type="link" class="copy-button" v-clipboard:copy="form.ksSha1" v-clipboard:success="onCopy">
          <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
        </a-button>
        <a-button v-if="!form.ksSha1" :disabled="editDisabled || rebuildLoading" type="link" class="rebuild-button" @click="rebuild()">
          <rebuild-icon />
          {{$t('AndroidCertificate.button.rebuild')}}
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="SHA256" prop="ksSha256" >
        <a-input :value="form.ksSha256" disabled/>
        <a-button v-if="form.ksSha256" type="link" class="copy-button" v-clipboard:copy="form.ksSha256" v-clipboard:success="onCopy">
          <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
        </a-button>
        <a-button v-if="!form.ksSha256" :disabled="editDisabled || rebuildLoading" type="link" class="rebuild-button" @click="rebuild()">
          <rebuild-icon />
          {{$t('AndroidCertificate.button.rebuild')}}
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- /Android App 证书 -->

    <!-- Android Push 证书 -->
    <h4 class="title">{{$t('AndroidCertificate.push.title')}}</h4>
    <p class="details">{{$t('AndroidCertificate.push.details1')}}</p>
    <p class="details">{{$t('AndroidCertificate.push.details')}}</p>
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
      <a-form-model-item :label="$t('AndroidCertificate.label.fcmJson')" prop="fcmJson" >
        <a-input v-show="false" v-model="pushForm.fcmJson" />
        <upload-button 
          :disabled="editDisabled"
          accept="application/json"
          :acceptList="['application/json']"
          :buttonText="$t('public.upload')"
          warningFileType="json"
          catalogName="app"
          :showFile="false"
          @uploaded="e=>uploaded(e,'fcmJson')"
        />
        <p v-text="pushForm.fcmJson ? '***.json':''"></p>
      </a-form-model-item>
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
        <a-button :disabled="editDisabled" type="primary" class="save-all-button" @click="savePushForm(['fcmJson','fcmServerJson'])">{{$t('public.save')}}</a-button>
      </a-form-model-item>
      <!-- 推送给中国国内用户 -->
      <h4 class="list-title">3.{{$t('AndroidCertificate.push.to.user.china')}}</h4>
      <p class="list-item">> {{$t('AndroidCertificate.push.channel')}}<a-radio-group class="push-channel" :disabled="editDisabled" v-model="form.resign" :options="$DictList('cn_push_channel')"/></p>
      <!-- 华为通道 -->
      <p class="list-item">> {{$t('AndroidCertificate.huawei.channel')}}
        <a :href="$DictValue('open_document_url','huaweiCertificate')" target="_blank" class="help-doc">{{$t('IOSCertificate.check.help.doc')}}</a>
      </p>
      <a-form-model-item :label="$t('AndroidCertificate.label.huaweiId')" prop="huaweiId" >
        <a-input :disabled="editDisabled" v-model="pushForm.huaweiId" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.huaweiId')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.huaweiSecret')" prop="huaweiSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.huaweiSecret" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.huaweiSecret')"/>
      </a-form-model-item>
       <a-form-model-item :label="$t('AndroidCertificate.label.huaweiClientSecret')" prop="huaweiClientSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.huaweiClientSecret" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.huaweiClientSecret')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.huaweiJson')" prop="huaweiJson" >
        <a-input v-show="false" v-model="pushForm.huaweiJson" />
        <upload-button 
          :disabled="editDisabled"
          accept="application/json"
          :acceptList="['application/json']"
          :buttonText="$t('public.upload')"
          warningFileType="json"
          catalogName="app"
          :showFile="false"
          @uploaded="e=>uploaded(e,'huaweiJson')"
        />
        <p v-text="pushForm.huaweiJson ? '***.json':''"></p>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button :disabled="editDisabled" type="primary" class="save-all-button" @click="savePushForm(['huaweiId','huaweiSecret','huaweiClientSecret','huaweiJson'])">{{$t('public.save')}}</a-button>
      </a-form-model-item>
      <!-- 小米通道 -->
      <p class="list-item">> {{$t('AndroidCertificate.xiaomi.channel')}}
        <a :href="$DictValue('open_document_url','xiaomiCertificate')" target="_blank" class="help-doc">{{$t('IOSCertificate.check.help.doc')}}</a>
      </p>
      <a-form-model-item :label="$t('AndroidCertificate.label.miId')" prop="miId" >
        <a-input :disabled="editDisabled" v-model="pushForm.miId" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.miId')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.miKey')" prop="miKey" >
        <a-input :disabled="editDisabled" v-model="pushForm.miKey" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.miKey')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.miSecret')" prop="miSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.miSecret" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.miSecret')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.deviceMsg')" prop="miDevChanelId" >
        <a-input :disabled="editDisabled" v-model="pushForm.miDevChanelId" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.deviceMsg')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.account')" prop="miChannelId" >
        <a-input :disabled="editDisabled" v-model="pushForm.miChannelId" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.account')"/>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button :disabled="editDisabled" type="primary" class="save-all-button" @click="savePushForm(['miId','miKey','miSecret','miDevChanelId','miChannelId'])">{{$t('public.save')}}</a-button>
      </a-form-model-item>
      <!-- Vivo通道 -->
      <p class="list-item">> {{$t('AndroidCertificate.vivo.channel')}}
        <a :href="$DictValue('open_document_url','vivoCertificate')" target="_blank" class="help-doc">{{$t('IOSCertificate.check.help.doc')}}</a>
      </p>
      <a-form-model-item :label="$t('AndroidCertificate.label.vivoId')" prop="vivoId" >
        <a-input :disabled="editDisabled" v-model="pushForm.vivoId" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.vivoId')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.vivoKey')" prop="vivoKey" >
        <a-input :disabled="editDisabled" v-model="pushForm.vivoKey" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.vivoKey')"/>
      </a-form-model-item>
       <a-form-model-item :label="$t('AndroidCertificate.label.vivoSecret')" prop="vivoSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.vivoSecret" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.vivoSecret')"/>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button :disabled="editDisabled" type="primary" class="save-all-button" @click="savePushForm(['vivoId','vivoKey','vivoSecret'])">{{$t('public.save')}}</a-button>
      </a-form-model-item>
      <!-- OPPO通道 -->
      <p class="list-item">> {{$t('AndroidCertificate.oppo.channel')}}
        <a :href="$DictValue('open_document_url','oppoCertificate')" target="_blank" class="help-doc">{{$t('IOSCertificate.check.help.doc')}}</a>
      </p>
      <a-form-model-item :label="$t('AndroidCertificate.label.oppoId')" prop="oppoId" >
        <a-input :disabled="editDisabled" v-model="pushForm.oppoId" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.oppoId')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.oppoKey')" prop="oppoKey" >
        <a-input :disabled="editDisabled" v-model="pushForm.oppoKey" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.oppoKey')"/>
      </a-form-model-item>
       <a-form-model-item :label="$t('AndroidCertificate.label.oppoSecret')" prop="oppoSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.oppoSecret" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.oppoSecret')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.oppoMasterSecret')" prop="oppoMasterSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.oppoMasterSecret" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.oppoMasterSecret')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.secretChannel')" prop="oppoChanelId" >
        <a-input :disabled="editDisabled" v-model="pushForm.oppoChanelId" defaultValue="DeviceAccount" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.secretChannel')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.secretChannelName')" prop="oppoChanelName" >
        {{ $t('AndroidCertificate.value.secretChannelName') }}
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button :disabled="editDisabled" type="primary" class="save-all-button" @click="savePushForm(['oppoId','oppoKey','oppoSecret','oppoMasterSecret','oppoChanelId'])">{{$t('public.save')}}</a-button>
      </a-form-model-item>

       <!-- 荣耀通道 -->
       <p class="list-item">> {{$t('AndroidCertificate.honor.channel')}}
        <a :href="$DictValue('open_document_url','honorCertificate')" target="_blank" class="help-doc">{{$t('IOSCertificate.check.help.doc')}}</a>
      </p>
      <a-form-model-item :label="$t('AndroidCertificate.label.honorAppId')" prop="honorAppId" >
        <a-input :disabled="editDisabled" v-model="pushForm.honorAppId" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.honorAppId')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.honorAppSecret')" prop="honorAppSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.honorAppSecret" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.honorAppSecret')"/>
      </a-form-model-item>
       <a-form-model-item :label="$t('AndroidCertificate.label.honorClientId')" prop="honorClientId" >
        <a-input :disabled="editDisabled" v-model="pushForm.honorClientId" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.honorClientId')"/>
      </a-form-model-item>
      <a-form-model-item :label="$t('AndroidCertificate.label.honorClientSecret')" prop="honorClientSecret" >
        <a-input :disabled="editDisabled" v-model="pushForm.honorClientSecret" :maxLength="50" :placeholder="$t('AndroidCertificate.placeholder.honorClientSecret')"/>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button :disabled="editDisabled" type="primary" class="save-all-button" @click="savePushForm(['honorAppId','honorAppSecret','honorClientId','honorClientSecret'])">{{$t('public.save')}}</a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- /Android Push 证书 -->
  </section>
</template>
<script>
import { RebuildIcon } from "@/core/icons"
import UploadButton from "@/components/uploadButton"
import { getAppAndroidCert, saveAppAndroidCert, getAppAndroidPush, saveAppAndroidPush, regenerateAndroidCert } from "@/api/appExploit"

export default {
  props:{
    appId:{ type:String, default:'' },
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false}, 
  },
  data (){
    return {
      form:{},
      editSHA256:'',
      SHA256InputVisiable:false,
      pushForm: {},
      originPushForm: {},
      labelText: {
        'jpushKey': this.$t('AndroidCertificate.label.jpushKey'),
        'jpushSecret': this.$t('AndroidCertificate.label.jpushSecret'),
      },
      rebuildLoading: false,
    }
  },

  components:{
    UploadButton,
    RebuildIcon,
  },

  mounted(){
    this.getAppAndroidCert()
    this.getAppAndroidPush()
  },

  methods:{

    // Android证书获取
    async getAppAndroidCert(){
      const res = await getAppAndroidCert({ appId: this.appId, version: this.version })
      if( res.code !== 0 ) return
      const resign = res.data.resign || 1 
      const sha256 = res.data.sha256 ? res.data.sha256.split(',') : []
      this.form = { ...res.data, resign, sha256 }
    },

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

    // 新增SHA256
    addSHA256(){
      this.editSHA256 = ''
      this.SHA256InputVisiable = true
    },

    // 保存SHA256
    async saveSHA256(){
      if(!this.editSHA256){
        this.toast(this.$t('AndroidCertificate.rules.SHA'));
        return
      }
      if(this.form.sha256.some(item => item == this.editSHA256)) {
        this.toast(this.$t('AndroidCertificate.rules.existed'));
        return
      }
      // 请求接口
      const arr = [...this.form.sha256, this.editSHA256]
      const sha256 = arr.toString()
      const res = await saveAppAndroidCert({ appId: this.appId, ...this.form, sha256 })
      if(res.code !== 0) return
      this.$message.success(this.$t('public.save.ok'))
      // 重新赋值
      this.SHA256InputVisiable = false
      this.getAppAndroidCert()
    },

    // Android 重签名切换
    async resignChange(){
      const sha256 = Array.isArray(this.form.sha256) ? this.form.sha256.toString() : this.form.sha256 || ''
      const res = await saveAppAndroidCert({ appId: this.appId, ...this.form, sha256 })
      if(res.code !== 0) return
      this.$message.success(this.$t('public.save.ok'))
      this.getAppAndroidCert()
    },

    // Android Push 证书
    async savePushForm(keys){
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

    async rebuild(){
      // 重新生成
      this.rebuildLoading = true
      const res = await regenerateAndroidCert({id: this.form.id})
      this.rebuildLoading = false
      if (res.code !== 0) return
      this.getAppAndroidCert()
      this.$message.success(this.$t('AndroidCertificate.rebuild.succeed'));
    },

    onCopy() {
      this.$message.success(this.$t('public.copy.succeed'));
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
.attention{
  line-height: 22px;
  color: @aithings-warning-color-FF8E35;
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
.anticon-plus{
  font-size: 18px;
}
.save-button{
  margin: 0 10px 0 21px;
  padding: 0 19px;
  border: 1px solid @primary-color;
  color: @primary-color;
}
.cancel-button{
  padding: 0 19px;
  border: 1px solid @aithings-text-tips-color;
  color: @aithings-text-tips-color;
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
}
.copy-button,.rebuild-button{
  padding: 0;
  margin-left: 20px;
}
.rebuild-button{
  svg{
    transform: translateY(4px);
    margin-right: 8px;
  }
  &:disabled{
    opacity: 0.5;
    color: @primary-color;
  }
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