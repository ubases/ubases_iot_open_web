<template>
  <section class="page-content">
    <h4 class="title">{{$t('map.ios.title')}}</h4>
    <p class="details">{{$t('map.ios.default')}}</p>
    <div style="height:30px" class="space"></div>
    <h4 class="title">{{$t('map.android.title')}}</h4>
    <p class="details">{{$t('map.android.before.config')}}</p>
    <p class="details">{{$t('map.android.after.config')}}<a-button type="link" class="getSHA1-button" @click="handleToggle">{{$t('map.android.get.sha1')}}</a-button></p>
    <a :href="$DictValue('open_document_url','map')" target="_blank" class="help-doc">{{$t('map.check.help.doc')}}</a>
    <a-form-model ref="form" class="regular-form" :model="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
      <a-form-model-item :label="$t('map.label.amapKey')" prop="amapKey" >
        <a-input :disabled="editDisabled" v-model="form.amapKey" :maxLength="50" :placeholder="$t('map.placeholder.amapKey')"/>
        <div class="flex y-axis-center">
          <info-icon />
          <p class="tips">{{$t('map.isContain.overseas.customers')}}</p>
          <a :href="$DictValue('open_document_url','gaodeMapKey')" target="_blank" class="help-doc">{{$t('public.help')}}</a>
        </div>
      </a-form-model-item>
      <a-form-model-item :label="$t('map.label.googleMapKey')" prop="googleMapKey" >
        <a-input :disabled="editDisabled" v-model="form.googleMapKey" :maxLength="50" :placeholder="$t('map.placeholder.googleMapKey')"/>
        <div class="flex y-axis-center">
          <info-icon />
          <p class="tips">{{$t('map.isContain.overseas.customers')}}</p>
          <a :href="$DictValue('open_document_url','googleMapKey')" target="_blank" class="help-doc">{{$t('public.help')}}</a>
        </div>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" >
        <a-button type="primary" :disabled="editDisabled" class="save" @click="saveForm">{{$t('public.save')}}</a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- 获取SHA1 -->
    <a-modal
      :title="$t('map.getSHA1.title')"
      :visible="visible"
      :width="640"
      @cancel="handleToggle"
    >
      <a-form-model ref="form" :label-col="{ span: 2 }" :wrapper-col="{span: 22}">
        <a-form-model-item :label="$t('map.getSHA1.label')"> 
          <a-input :value="sha1" disabled class="sha1-input"/>
          <a-button v-if="sha1" type="link" class="copy-button" v-clipboard:copy="sha1" v-clipboard:success="onCopy">
            <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
          </a-button>
          <a-button v-if="!sha1" :disabled="editDisabled || rebuildLoading" type="link" class="rebuild-button" @click="rebuild()">
          <rebuild-icon />
          {{$t('AndroidCertificate.button.rebuild')}}
        </a-button>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button key="back" @click="handleToggle">{{$t('public.close.text')}}</a-button>
      </template>
    </a-modal>
  </section>
</template>
<script>
import {InfoIcon} from '@/core/icons'
import { getAppMap, saveAppMap, getAppAndroidCert,regenerateAndroidCert } from "@/api/appExploit"

export default {
  props:{
    appId:{ type:String, default:'' },
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false},  
  },
  data (){
    return {
      form:{},
      visible: false,
      sha1:'',
      rebuildLoading:false
    }
  },
  components:{
    InfoIcon
  },
  mounted(){
    this.getAppMap()
    this.getAppAndroidCert()
  },
  methods:{
    // 获取数据
    async getAppMap(){
      const res = await getAppMap({appId:this.appId,version:this.version})
      if(res.code!==0)return
      this.form = res.data
    },

    // Android证书获取
    async getAppAndroidCert(){
      const res = await getAppAndroidCert({ appId: this.appId, version: this.version })
      if( res.code !== 0 ) return
      this.sha1 = res.data.ksSha1 || ''
    },

    // 保存数据
    saveForm(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        const res = await saveAppMap({appId:this.appId,...this.form})
        if(res.code!==0)return
        this.$message.success(this.$t('public.save.ok'))
        this.getAppMap()
      });
    },

    // 开启/关闭获取sha1弹窗
    handleToggle(){
      this.visible = !this.visible
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
    // 复制
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


.tips{
  padding: 0 0 0 5px;
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
.sha1-input{
  width: 440px;
}
</style>