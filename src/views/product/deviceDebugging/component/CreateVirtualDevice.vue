<template>
  <a-modal
    :title="$t('deviceDebugging.add.virtualDevice')"
    :width="580"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    >
    
    <a-spin :spinning="confirmLoading">
       <a-form-model ref="form" class="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 11 }">
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
        <p class="tips">{{$t('deviceDebugging.createVirtualDevice.tips')}}</p>
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
import { addVirtualDevice } from '@/api/device'
import QrCode from "@/components/VueQrCode/index.vue"
import { AccountRules } from '@/utils/validate'
import { getQrCodeUrl } from "@/api/appExploit"

export default {
  props:{
    visible:{ type:Boolean, default: false},
    productId:{ type:String, default: ''},
    appOptions:{ type:Array, default: []},
    areaOptions:{ type:Array, default: []},
  },
  components:{
    QrCode
  },
  data() {
    return {
      confirmLoading:false,
      form:{},
      rules:{
        appKey:[{ required: true, message: this.$t('deviceDebugging.rules.appKey'), trigger: 'change' }],
        regionServerId:[{ required: true, message: this.$t('deviceDebugging.placeholder.regionServerId'), trigger: 'change' }],
        userAccount:AccountRules()
      },
      codeVisible:false,
      qrCodeData:{}
    }
  },
  created(){
  },
  methods:{
    // 添加设备取消
    handleCancel(){
      this.$emit('cancelCreate')
      this.$refs.form.resetFields();
      this.form = {}
    },

    // 添加设备确定
    async handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = await addVirtualDevice({productId: this.productId, ...this.form})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$emit('sumitCreate')
        this.$refs.form.resetFields();
        this.form = {}
      });
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
    padding: 20px 0 30px;
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
  .tips{
    padding-left: 40px;
    color: @aithings-warning-color-FF8E35;
  }
  .check-code{
    position: absolute;
    right: -110px;
    top: -14px;
    color: @primary-color;
  }
</style>