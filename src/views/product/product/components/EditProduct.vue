<template>
    <a-modal
    :title="$t('setting.edit.product.title')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item :label="$t('setting.edit.product.label.name')" prop="name" >
          <a-input v-model="form.name" :placeholder="$t('setting.edit.product.placeholder.name')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.edit.product.label.imageUrl')" prop="imageUrl" >
          <input v-show="false" v-model="form.imageUrl">
          <upload-button 
            accept="image/jpeg,image/png,image/x-ms-bmp"
            :acceptList="['image/jpeg','image/png','image/x-ms-bmp']"
            :limitSize="1"
            limitRatio="1:1"
            warningFileType="JPG,JPEG,PNG,BMP"
            catalogName="product"
            :fileUrl="form.imageUrl || ''"
            @uploaded="uploaded"
          >
          <p class="upload-image-tips" slot="tipsDown">
            {{$t('create.product.image.tips')}}
          </p>
          </upload-button>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.edit.product.label.model')" prop="model" >
          <a-input v-model="form.model" placeholder=""/>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.edit.product.label.id')" prop="id" >
          <span>{{form.productKey}}</span>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.edit.product.label.networkType')" prop="networkType" >
          <a-radio-group v-model="form.networkType" :options="$DictList('network_type')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.edit.product.label.powerConsumeType')" prop="powerConsumeType" >
          <a-radio-group v-model="form.powerConsumeType" :options="$DictList('power_consume_type')" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import UploadButton from "@/components/uploadButton"
import { CommonNameRules } from '@/utils/validate'
import { editProduct } from '@/api/product'

export default ({
  name:"EditProduct",
  components:{
    UploadButton
  },
  props:{
    form: { type: Object, default: ()=>{} },
    visible: {type: Boolean, default: false}
  },
  data(){
    return {
      confirmLoading:false,
      productImg:"",
      rules:{
        name: CommonNameRules(this.$t('setting.edit.product.rules.name')),
        model: CommonNameRules(this.$t('setting.edit.product.rules.model')),
        imageUrl: [{ required: true, message: this.$t('setting.edit.product.rules.imageUrl'), trigger: 'change' }],
        networkType: [{ required: true, message: this.$t('setting.edit.product.rules.networkType'), trigger: 'change' }],
        powerConsumeType: [{ required: true, message: this.$t('setting.edit.product.rules.powerConsumeType'), trigger: 'change' }],
      },
    }
  },
  methods:{
    handleOk(){
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        const res = await editProduct(
          {          
          id: this.form.id,
          name:this.form.name,
          model: this.form.model,
          imageUrl: this.form.imageUrl,
          powerConsumeType: this.form.powerConsumeType,
          networkType:this.form.networkType,
          }
        )
        if(res.code !== 0 ) return
        this.$message.info(this.$t('public.edit.succeed'));
        this.$refs.ruleForm?.resetFields();
        this.$emit("confirmEdit")
      });
      
    },
    handleCancel(){
      this.$refs.ruleForm?.resetFields();
      this.$emit("cancelEdit")
    },
    // 图片上传
    uploaded(data){
      this.form.imageUrl = data.fullPath;
      this.$refs["ruleForm"].clearValidate('imageUrl');
    },

  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
  /deep/.ant-form-item-label > label{
    color: @aithings-text-color-gray;
  }
  .upload-image-tips{
    font-size: 12px;
    max-width: 330px;
    padding-top: 2px;
    color:@aithings-text-tips-color;
    line-height: 18px;
  }
</style>