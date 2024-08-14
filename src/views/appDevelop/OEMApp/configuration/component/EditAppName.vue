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
        <a-form-model-item prop="name" :label="$t('editAppName.label.name')">
          <a-input v-model="form.name" :placeholder="$t('editAppName.placeholder.name')" :maxLength="6" />
        </a-form-model-item>
        <a-form-model-item prop="nameEn" :label="$t('editAppName.label.nameEn')">
          <a-input v-model="form.nameEn" :placeholder="$t('editAppName.placeholder.nameEn')" :maxLength="12" />
        </a-form-model-item>
        <a-form-model-item  label=" " :colon="false">
          <p class="name-tips">{{$t('editAppName.tips')}}</p>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {editAppName} from "@/api/appExploit"
export default {
  props:{
    appId: { type:String, default:'' },
    form: { type:Object, default:()=>{} },
    visible: { type:Boolean, default:false },
  },
  data(){
    return {
      rules:{
        name:[{ required: true, message: this.$t('editAppName.rules.name'), trigger: '' }],
        nameEn:[{ required: true, message: this.$t('editAppName.rules.nameEn'), trigger: '' }],
      },
      confirmLoading:false
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
    }
  }
}
</script>
<style scoped lang="less">
@import "../../../../../global.less";
.name-tips{
  font-size: 12px;
  color: @aithings-text-color-gray;
  line-height: 20px;
}
</style>