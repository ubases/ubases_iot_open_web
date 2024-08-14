<template>
  <a-modal
    :title="actionType == 'add'? $t('deviceDebugging.add.appAccount') : $t('deviceDebugging.update.appAccount')"
    :width="580"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    >
    <p class="tips">{{ $t('deviceDebugging.tips') }}</p>
    <a-spin :spinning="confirmLoading">
      
       <a-form-model ref="form" class="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 11 }">
        <a-form-model-item>
          
        </a-form-model-item>
        <a-form-model-item :label="$t('deviceDebugging.label.appKey')" prop="appKey" >
          <a-select v-model="form.appKey" :placeholder="$t('deviceDebugging.placeholder.appKey')" :options="appOptions"/>
          <div v-if="form.appKey" @click="handleCode" class="check-code tap-pointer">{{ $t('deviceDebugging.check.qrcode.url') }}</div>
        </a-form-model-item>
        <a-form-model-item :label="$t('deviceDebugging.label.regionServerId')" prop="regionServerId" >
          <a-select v-model="form.regionServerId" :placeholder="$t('deviceDebugging.placeholder.regionServerId')" :options="areaOptions"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('deviceDebugging.createVirtualDevice.label.userAccount')" prop="userAccount" >
          <a-input v-model="form.userAccount" :placeholder="$t('deviceDebugging.createVirtualDevice.placeholder.userAccount')"/>
        </a-form-model-item>
       </a-form-model>
    </a-spin>
    <a-modal
    :title="$t('deviceDebugging.download.public.app')"
    :width="580"
    :visible="codeVisible"
    :confirm-loading="confirmLoading"
    @cancel="codeVisible=false"
    >
      <p class="download-text">{{$t('deviceDebugging.please.download')}}“{{qrCodeData.label}}”{{$t('deviceDebugging.try.communication')}}</p>
      <section class="qr-code-wrap">
        <qr-code :text="qrCodeData.url" :options="{margin:0}"/>
      </section>
      <div slot="footer">
        <a-button @click="codeVisible=false">{{ $t('public.know') }}</a-button>
      </div>
    </a-modal>
  </a-modal>
</template>

<script>
import { AddAppAccount } from '@/api/device'
import { AccountRules } from '@/utils/validate'
import QrCode from "@/components/VueQrCode/index.vue"
import { getQrCodeUrl } from "@/api/appExploit"

export default {
  props:{
    visible:{ type:Boolean, default: false},
    deviceId:{ type:String, default: ''},
    productId:{ type:String, default: ''},
    actionType: {type:String, default: 'add'},
    form: {type:Object, default: ()=>{}},
    areaOptions:{type:Array, default: ()=>[]},
    appOptions:{type:Array, default: ()=>[]},
  },
  components:{
    QrCode
  },
  data() {
    return {
      confirmLoading:false,
      rules:{
        appKey:[{ required: true, message: this.$t('deviceDebugging.rules.appKey'), trigger: 'change' }],
        regionServerId:[{ required: true, message: this.$t('deviceDebugging.placeholder.regionServerId'), trigger: 'change' }],
        userAccount:AccountRules(),
      },
      codeVisible:false,
      qrCodeData:{}
    }
  },
  created(){

  },
  methods:{
    // 取消
    handleCancel(){
      this.$emit('cancelCreate')
      this.$refs.form.resetFields();
    },

    // 确定
    async handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const { appKey, userAccount,regionServerId }= {...this.form}
        const res = await AddAppAccount({appKey, account:userAccount, deviceId: this.deviceId, productId:this.productId, regionServerId})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$emit('sumitCreate')
        this.$refs.form.resetFields();
      })
      
    },

    async handleCode(){
      let data= this.appOptions.filter(item=>item.value == this.form.appKey)?.pop()
      if(data.url){
        this.qrCodeData = {...data}
      } else{
        const res = await getQrCodeUrl({appId:data.appId, version:data.version})
        if(res.code!==0)return
        this.qrCodeData = {...data, url:res.data}
      }
      this.codeVisible = true
    }
  }
}
</script>
<style scoped lang="less">
  @import "../../../../global.less";

  /deep/.ant-modal-body{
    padding: 30px 0 40px;
  }
  .download-text{
    color: @aithings-text-color-black;
    line-height: 20px;
    text-align: center;
  }
  .qr-code-wrap {
    padding: 25px 0 42px;
    text-align: center;
    img{
      width: 160px;
      height: 160px;
    } 
  }
  /deep/.ant-modal-body{
    padding-top: 10px;
  }
  .tips{
    padding: 0 20px 10px;
  }
  .check-code{
    position: absolute;
    right: -110px;
    top: -14px;
    color: @primary-color;
  }
</style>