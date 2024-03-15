<template>
  <a-modal
    :title="$t('deviceDebugging.addRealDevice.title')"
    :width="580"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    >
    <a-spin :spinning="confirmLoading">
      <a-radio-group v-model="form.addMode" @change="createError = false">
        <a-radio :value="1">
          {{$t('deviceDebugging.addRealDevice.batch')}}
          <div class="form-wrap">
            <a-input-number v-model="form.number" :precision="0" :min="1" :max="100" :placeholder="$t('deviceDebugging.addRealDevice.placeholder.number')"/>
            <p class="tips">{{$t('deviceDebugging.addRealDevice.number.tips')}}</p>
            <p class="error" v-if="createError && form.addMode == 1">{{$t('deviceDebugging.addRealDevice.number.rule')}}</p>
          </div>
        </a-radio>
        <a-radio :value="2">
          {{$t('deviceDebugging.addRealDevice.already.exist')}}
          <div class="form-wrap">
            <a-input v-model="form.deviceId" :placeholder="$t('deviceDebugging.addRealDevice.placeholder.deviceId')" :maxLength="50"/>
            <p class="error" v-if="createError && form.addMode == 2">{{$t('deviceDebugging.addRealDevice.rule.deviceId')}}</p>
          </div>
        </a-radio>
      </a-radio-group>
    </a-spin>
  </a-modal>
</template>

<script>
import { generatorTestDevice } from '@/api/device'
export default {
  props:{
    visible: { type:Boolean, default: false},
    productId: { type:String, default: ''},
    productKey: { type:String, default: ''},
  },
  data() {
    return {
      confirmLoading:false,
      form:{
        addMode:1
      },
      createError:false,
    }
  },
  methods:{
    // 添加真实设备取消
    handleCancel(){
      this.$emit('cancelCreate')
      this.form = {
        addMode:1
      }
    },

    // 添加真实设备确定
    async handleOk(){
      if((this.form.addMode == 1 && !this.form.number) || (this.form.addMode == 2 && !this.form.deviceId)){
        this.createError = true
        return
      }
      this.createError = false
      this.confirmLoading = true
      const res = await generatorTestDevice({...this.form, productId: this.productId, productKey:this.productKey})
      this.confirmLoading = false
      if(res.code !== 0) return
      this.$emit('sumitCreate')
      this.form = {
        addMode:1
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "../../../../global.less";
  /deep/.ant-input-number{
  width: 400px;
  }
  .ant-radio-wrapper{
    display: block;
    /deep/.ant-radio-inner{
      width: 14px;
      height: 14px;
      &::after{
        width: 6px;
        height: 6px;
      }
    }
    /deep/.ant-radio{
      vertical-align:middle
    }
    span.ant-radio + *{
      padding: 0 4px;
    }
  }
  /deep/.ant-modal-body{
    padding: 20px 78px 30px;
  }
  .form-wrap{
    padding: 15px 0 10px 24px;
    .tips{
      padding-top: 10px;
      font-size: 12px;
      font-weight: 400;
      color: @aithings-text-color-gray;
      line-height: 17px;
    }
    .error{
      padding-top: 4px;
      min-height: 22px;
      line-height: 1.5;
      color: @aithings-color-F5222D;
      
    }
  }
</style>