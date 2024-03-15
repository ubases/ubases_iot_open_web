<template>
  <a-modal
    :title="actionType == 'add'? $t('deviceDebugging.add.appAccount') : $t('deviceDebugging.update.appAccount')"
    :width="480"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    >
    <p class="tips">{{ $t('deviceDebugging.tips') }}</p>
    <a-spin :spinning="confirmLoading">
      
       <a-form-model ref="form" class="form" :model="form" :rules="rules" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item>
          
        </a-form-model-item>
        <a-form-model-item :label="$t('deviceDebugging.label.appKey')" prop="appKey" >
          <a-select v-model="form.appKey" :placeholder="$t('deviceDebugging.placeholder.appKey')" :options="appOptions"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('deviceDebugging.label.userAccount')" prop="userAccount" >
          <a-input v-model="form.userAccount" :placeholder="$t('deviceDebugging.placeholder.userAccount')"/>
        </a-form-model-item>
       </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { AddAppAccount } from '@/api/device'
import { getAppList } from '@/api/appExploit'
import { AccountRules } from '@/utils/validate'

export default {
  props:{
    visible:{ type:Boolean, default: false},
    deviceId:{ type:String, default: ''},
    productId:{ type:String, default: ''},
    actionType: {type:String, default: 'add'},
    form: {type:Object, default: ()=>{}}
  },
  data() {
    return {
      confirmLoading:false,
      rules:{
        appKey:[{ required: true, message: this.$t('deviceDebugging.rules.appKey'), trigger: 'change' }],
        userAccount:AccountRules(),
      },
      appOptions:[]
    }
  },
  created(){
    this.getAppList()
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
        const { appKey, userAccount }= {...this.form}
        const res = await AddAppAccount({appKey, account:userAccount, deviceId: this.deviceId, productId:this.productId})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$emit('sumitCreate')
        this.$refs.form.resetFields();
      })
      
    },

    // 获取全部应用
    async getAppList(){
      const res = await getAppList()
      if (res.code !==0) return
      this.appOptions = res.data?.list?.map(item=>{
        return{
          label: item.name,
          value: item.appKey
        }
      })
    },
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
</style>