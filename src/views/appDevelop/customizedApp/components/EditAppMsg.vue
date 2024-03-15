<template>
  <a-modal
    :title="$t('editAppName.title')"
    :visible="visible"
    :width="460"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="form"  :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{span: 18}">
        <a-form-model-item prop="name" :label="$t('customizedApp.edit.label.name')">
          <a-input v-model="form.name" :placeholder="$t('customizedApp.edit.rules.name')" :maxLength="6" />
        </a-form-model-item>
        <a-form-model-item prop="appIconUrl" :label="$t('customizedApp.edit.label')">
          <upload-button 
            accept="image/png"
            :acceptList="['image/png']"
            :limitSize="2"
            :limitWidth="1024"
            :limitHeight="1024"
            warningFileType="PNG"
            catalogName="app"
            :fileUrl="form.appIconUrl"
            :buttonText="$t('public.reupload')"
            @uploaded="uploaded"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {editAppName} from "@/api/appExploit"
import UploadButton from "@/components/uploadButton"
export default {
  props:{
    appId: { type:String, default:'' },
    form: { type:Object, default:()=>{} },
    visible: { type:Boolean, default:false },
  },
  components:{
    UploadButton
  },
  data(){
    return {
      rules:{
        name:[{ required: true, message: this.$t('customizedApp.edit.rules.name'), trigger: '' }],
        appIconUrl:[{ required: true, message: this.$t('customizedApp.createAPP.rules.appIcon'), trigger: '' }],
      },
      confirmLoading:false,
    }
  },
  methods:{
    // 确定修改app名称
    handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = await editAppName({ appId: this.appId, ...this.form })
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$emit('sumitEditApp')
      });
    },

    handleCancel(){
      this.$emit('cancelEditApp')
    },

    // 图片上传
    uploaded(data){
      this.$set(this.form,'appIconUrl',data.fullPath)
      this.$refs.form.clearValidate('appIconUrl');
    },

  }
}
</script>
<style scoped lang="less">
@import "../../../../global.less";
.name-tips{
  font-size: 12px;
  color: @aithings-text-color-gray;
  line-height: 20px;
}
</style>