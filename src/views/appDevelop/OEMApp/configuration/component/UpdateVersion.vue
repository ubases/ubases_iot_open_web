<template>
  <a-modal
    :title="$t('updateVersion.title')"
    :visible="visible"
    :width="460"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p class="tips">{{$t('updateVersion.tips')}}</p>
      <a-form-model ref="form" :model="form"  :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{span: 18}">
        <a-form-model-item prop="version" :label="$t('updateVersion.newVersion')">
          <a-input v-model="form.version" :placeholder="$t('updateVersion.placeholder.version')"  />
          <span class="version-tips">{{$t('updateVersion.tips.version')}}</span>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { VersionRules} from "@/utils/validate"
import {updateAppVersion} from "@/api/appExploit"

export default {
  props:{
    appId: { type:String, default:'' },
    form: { type:Object, default:()=>{} },
    visible: { type:Boolean, default:false },
    version: { type:String, default:'' },
  },
  data(){
    return {
      rules:{
        version:VersionRules()
      },
      confirmLoading:false
    }
  },
  methods:{
    // 确定更新版本
    handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = await updateAppVersion({appId:this.appId, version:this.version, newVersion:this.form.version})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$emit('sumitVersion')
      });
    },

    handleCancel(){
      this.$emit('cancelVersion')
    }
  }
}
</script>
<style scoped lang="less">
@import "../../../../../global.less";
.tips{
  padding: 10px;
  color: @aithings-warning-color-FF8E35;
}
.version-tips{
  font-size: 12px;
  color: @aithings-text-color-gray;
}
</style>