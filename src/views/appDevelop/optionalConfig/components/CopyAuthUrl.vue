<template>
  <a-modal
    :title="$t('optionalConfig.copy.authorize.url')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p class="prompt">{{$t('optionalConfig.copy.authorize.prompt1')}}</p>
      <p class="prompt">{{$t('optionalConfig.copy.authorize.prompt2')}}</p>
      <a-form-model ref="form" class="regular-form" :model="form"  :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-model-item :label="$t('optionalConfig.copy.authorize.label.clientId')" prop="clientId" >
          <a-input v-model="form.clientId" :disabled="true"/>
          <a-button type="link" class="copy-button" v-clipboard:copy="form.clientId" v-clipboard:success="onCopy">
            <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
          </a-button>
        </a-form-model-item>
        <a-form-model-item :label="$t('optionalConfig.copy.authorize.label.clientScrect')" prop="clientScrect" >
          <a-input v-model="form.clientScrect" :disabled="true"/>
          <a-button type="link" class="copy-button" v-clipboard:copy="form.clientScrect" v-clipboard:success="onCopy">
            <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
          </a-button>
        </a-form-model-item>
        <a-form-model-item :label="$t('optionalConfig.copy.authorize.label.gatewayUrl')" prop="gatewayUrl" >
          <a-input v-model="form.gatewayUrl" :disabled="true"/>
          <a-button type="link" class="copy-button" v-clipboard:copy="form.gatewayUrl" v-clipboard:success="onCopy">
            <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
          </a-button>
        </a-form-model-item>
        <a-form-model-item :label="$t('optionalConfig.copy.authorize.label.authUrl')" prop="authUrl" >
          <a-input v-model="form.authUrl" :disabled="true"/>
          <a-button type="link" class="copy-button" v-clipboard:copy="form.authUrl" v-clipboard:success="onCopy">
            <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
          </a-button>
        </a-form-model-item>
        <a-form-model-item :label="$t('optionalConfig.copy.authorize.label.tokenUrl')" prop="tokenUrl" >
          <a-input v-model="form.tokenUrl" :disabled="true"/>
          <a-button type="link" class="copy-button" v-clipboard:copy="form.tokenUrl" v-clipboard:success="onCopy">
            <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer">
      <a-button key="cancel"  @click="handleCancel">{{$t('public.close.text')}}</a-button>
    </template>
  </a-modal>
</template>

<script>

export default ({
  name:"CopyAuthUrl",
  props:{
    visible: { type: Boolean, default: false },
    data: { type: Object, default: ()=>{} }
  },
  data () {
    return {
      confirmLoading:false,
      form:{},
    }
  },
  watch:{
    visible(val){
      if(!val) return
      this.form = this.data
    },
  },
  methods:{
    handleCancel(){
      this.$emit('cancel')
    },

    // 复制
    onCopy() {
      this.$message.success(this.$t('public.copy.succeed'));
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
.prompt{
  color: @aithings-text-color-gray;
  line-height: 20px;
}
.regular-form{
  margin-top: 24px;
}
.copy-button{
  padding: 0;
  margin-left: 10px;
}
/deep/.ant-input {
  width: 400px;
  background: @aithings-table-thread-color;
}
</style>