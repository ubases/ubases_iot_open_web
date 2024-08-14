<template>
  <a-modal
    :title="$t('device.generate.triple.title')"
    :width="600"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules"  :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-model-item :label="$t('device.generate.triple.label.number')" prop="number">
          <a-input-number v-model="form.number" :precision="0" :min="1" :placeholder="$t('device.generate.triple.placeholder')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('device.export.triple.fileName')" prop="fileName">
          <a-upload
            name="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
            :showUploadList="false"
            :beforeUpload="beforeUpload"
          >
            <a-button> {{$t('public.import')}} </a-button>
          </a-upload>
          <p class="warning-tips">{{ $t('manufacture.button.addTriple.tips') }}</p>
          <input v-show="false" v-model="form.fileName"/>
          <p v-text="form.fileName || ''"></p>
        </a-form-model-item>
        <a-form-model-item :label="$t('device.generate.triple.label.batchId')" prop="batchId">
          <a-input-number  v-model="form.batchId" :min="0" :precision="0" :placeholder="$t('device.generate.triple.placeholder')"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { deviceImport } from "@/api/device";

export default ({
  name:"GeneratTriple",
    props:{
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
       // 添加编辑弹框
      rules:{
        number:[{type:'number', required: true, message: this.$t('device.generate.triple.rule.number'), trigger: 'blur' }],
        fileName:[{ required: true, message: this.$t('device.generate.triple.rule.fileName'), trigger: 'change' }],
      },
      form: {},
      confirmLoading: false,
      downloadDisable:false,
    }
  },
  created() {

  },
  methods:{

    handleCancel(){
      this.form = {}
      this.$emit('handleCancel')
    },

    // 确认
    handleOk(){
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true;
        let formData = new FormData();
        formData.append("file", this.form.file);
        formData.append("number", this.form.number);
        if(this.form.batchId){
          formData.append("batchId", this.form.batchId);
        }
        const res = await deviceImport(formData)
        this.confirmLoading = false;
        if(res.code !== 0 ) return
        this.form = {}
        this.$emit('handleOk')
      });
    },

    beforeUpload(file){
      console.log(file.type)
      if (file.type!='text/csv' && file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.warning(this.$t('device.generate.triple.file.type'))
        return false
      } 
      return new Promise((resolve, reject) => {
        const isLimit = file.size / 1024 / 1024 > 10;
        if (isLimit) {
          this.$message.warning(this.$t('device.generate.triple.file.size'));
          reject(false);
        }
        this.form = {
           ...this.form,
           file: file,
           fileName: file.name,
         };
        this.$refs["ruleForm"].clearValidate(["fileName"]);
        reject(false); // 阻止上传
      });
    }
  }
})
</script>
<style lang="less" scoped>
  @import "../../../../global.less";

  .ant-form-item-children{
    .ant-btn{
      padding: 0 28px;
      border: 1px solid @primary-color;
      color: @primary-color;
    }
    .download{
      border: 0;
    }
  }
  .warning-tips{
    font-size: 12px;
    color: @aithings-text-tips-color;
  }
  
</style>
