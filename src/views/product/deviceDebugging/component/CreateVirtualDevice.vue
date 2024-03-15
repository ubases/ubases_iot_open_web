<template>
  <a-modal
    :title="$t('deviceDebugging.add.virtualDevice')"
    :width="580"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    >
    <a-spin :spinning="confirmLoading">
      <p class="download-text">{{$t('deviceDebugging.please.download')}}“{{appName}}”{{$t('deviceDebugging.try.communication')}}</p>
      <section class="qr-code-wrap">
        <qr-code :text="appUrl" :options="{margin:0}"/>
      </section>
       <a-form-model ref="form" class="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item :label="$t('deviceDebugging.createVirtualDevice.label.userAccount')" prop="userAccount" >
          <a-input v-model="form.userAccount"  :placeholder="$t('deviceDebugging.createVirtualDevice.placeholder.userAccount')"/>
          <p class="tips">{{$t('deviceDebugging.createVirtualDevice.tips')}}</p>
        </a-form-model-item>
       </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { addVirtualDevice, qrCodeUrl } from '@/api/device'
import QrCode from "@/components/VueQrCode/index.vue"
import { AccountRules } from '@/utils/validate'

export default {
  props:{
    visible:{ type:Boolean, default: false},
    productId:{ type:String, default: ''}
  },
  components:{
    QrCode
  },
  data() {
    return {
      confirmLoading:false,
      form:{},
      appUrl:'',
      appName:'',
      rules:{
        userAccount:AccountRules()
      },
      appKey:''
    }
  },
  created(){
    this.qrCodeUrl()
  },
  methods:{
    // 添加真实设备取消
    handleCancel(){
      this.$emit('cancelCreate')
      this.$refs.form.resetFields();
      this.form = {}
    },

    // 添加真实设备确定
    async handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = await addVirtualDevice({userAccount:this.form.userAccount, productId: this.productId, appKey:this.appKey})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$emit('sumitCreate')
        this.$refs.form.resetFields();
        this.form = {}
      });
    },

    // 获取构建包二维码链接
    async qrCodeUrl(){
      const res = await qrCodeUrl()
      if(res.code !== 0 ) return
      this.appUrl = res.data.url
      this.appKey = res.data.appKey
      this.appName = res.data.name
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
    color: @aithings-warning-color-FF8E35;
  }
</style>