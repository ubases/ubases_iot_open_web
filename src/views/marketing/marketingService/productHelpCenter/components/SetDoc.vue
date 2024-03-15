<template>
    <a-modal
    :title="$t('helpCenter.setDoc.title')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model  ref="ruleForm" class="regular-form" :model="formData" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item ref="name" :label="$t('helpCenter.setDoc.label.sort')" prop="sortId">
          <a-input-number v-model="formData.sortId"  :placeholder="$t('helpCenter.setDoc.placeholder.sort')" :min="0" :max="1000" :precision="0" class="sort-input"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.setDoc.label.isEnable')" prop="status">
          <a-radio-group v-model="formData.status" :options="$DictList('is_doc_enable')" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { enableHelpDoc } from "@/api/productHelpCenter"

export default ({
  name:"CreateHelpDoc",
  props:{
    visible: { type: Boolean, default: false },
    form: { type: Object, default: ()=>{} }
  },

  data () {
    return {
      confirmLoading:false,
      formData:{},
      rules: {
        sortId: [{ required: true, message: this.$t('helpCenter.setDoc.rules.sort'), trigger: 'blur' },],
        status: [{ required: true, message: this.$t('helpCenter.setDoc.rules.isEnable'), trigger: 'change' }],
      },
    }
  },
  watch:{
    visible(val){
      if(!val) return
      this.formData = this.$deepClone(this.form)
    }
  },
  mounted(){
    
  },
  methods:{
    
    // 确认
    handleOk() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true;
        const {relationId, sortId, status} = {...this.formData}
        let res = await enableHelpDoc({relationId, sortId, status})
        this.confirmLoading = false;
        if(res.code !== 0 ) return
        this.$emit("handleOk")
        this.formData = {}
        this.$refs.ruleForm?.resetFields()
      });
    },

    handleCancel() {
      this.$emit("handleCancel")
      this.formData = {}
      this.$refs.ruleForm?.resetFields()
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
.regular-form{
  padding-top: 30px;
}
.ant-modal .ant-modal-body .ant-form-item{
  margin-bottom: 20px;
}
/deep/.ant-input, .select-wrap{
  width: 400px;
}

/deep/.ant-checkbox-inner{
  width: 16px;
  height: 16px;
  border: 1px solid @aithings-text-tips-color;
}
/deep/.ant-form-item-label{
  line-height: 34px;
}
/deep/.ant-form-item-control{
  line-height: 34px;
}
.ant-radio-wrapper{
  color: @aithings-text-color-black;
}
.sort-input{
  width: 100%;
}
</style>