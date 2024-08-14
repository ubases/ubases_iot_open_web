<template>
  <a-modal
    :title="$t('addFirmware.title')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <section class="steps-wrap flex x-axis-center">
        <a-steps size="small" :current="stepIndex">
          <a-step :title="$t('addFirmware.basic.msg')"/>
          <a-step :title="$t('addFirmware.upload.version')"/>
        </a-steps>
      </section>
      <a-form-model v-show="stepIndex == 0" ref="ruleForm" class="regular-form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item :label="$t('firmware.inputName.zh')" prop="name" >
          <a-input v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.inputName.en')" prop="nameEn" >
          <a-input v-model="form.nameEn"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('addFirmware.label.flag')" prop="flag" >
          <a-input v-model="form.flag"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('addFirmware.label.type')" prop="type" >
          <a-select v-model="form.type" default-value="" :options="firmTypeOptions">
          </a-select>
        </a-form-model-item>
        <a-form-model-item :label="$t('addFirmware.label.flashSize')" prop="flashSize" >
          <a-select v-model="form.flashSize" default-value="" :options="$DictList('flash_size')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('addFirmware.label.upgradeOvertime')" prop="upgradeOvertime" >
           <a-input-number
              v-model="form.upgradeOvertime"
              :precision="0"
              :min="0"
              :max="300"
            />
            <span class="ant-form-text">{{$t("firmware.second")}}</span>
        </a-form-model-item>
        <a-form-model-item :label="$t('public.remark')" prop="remark" >
          <a-textarea v-model="form.remark" :auto-size="{ minRows: 2}"/>
        </a-form-model-item>
      </a-form-model>
      <a-form-model v-show="stepIndex == 1" ref="versionForm" class="regular-form" :model="form" :rules="versionRules" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item :label="$t('addFirmware.label.version')" prop="version" >
          <a-input v-model="form.version"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('addFirmware.label.versionDesc')" prop="versionDesc" >
          <a-textarea v-model="form.versionDesc" :auto-size="{ minRows: 2}"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('addFirmware.label.upgradeMode')" prop="upgradeMode" >
        <a-radio-group v-model="form.upgradeMode" :options="$DictList('upgrade_pkg_mode')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('addFirmware.label.upgradeFilePath')" prop="upgradeFilePath" >
          <a-input v-show="false" v-model="form.upgradeFilePath" />
          <upload-button 
            accept=".bin"
            :buttonText="$t('addFirmware.label.upload')"
            warningFileType="bin"
            catalogName="firmware"
            :limitSize="10"
            :showFile="false"
            :suffixValid="true"
            @uploaded="e=>uploaded(e,'upgradeFilePath','upgradeFileName','upgradeFileSize','upgradeFileKey')"
          />
          <p v-text="form.upgradeFileName || ''"></p>
        </a-form-model-item>
        <a-form-model-item :label="$t('addFirmware.label.prodFilePath')" prop="prodFilePath" >
          <a-input v-show="false" v-model="form.prodFilePath" />
          <upload-button 
            accept=".bin"
            :buttonText="$t('addFirmware.label.upload')"
            warningFileType="bin"
            catalogName="firmware"
            :limitSize="10"
            :showFile="false"
            :suffixValid="true"
            @uploaded="e=>uploaded(e,'prodFilePath','prodFileName','prodFileSize','prodFileKey')"
          />
          <p v-text="form.prodFileName || ''"></p>
        </a-form-model-item>
        <a-form-model-item :label="$t('addFirmware.label.isMust')" prop="isMust" >
          <a-radio-group v-model="form.isMust" :options="$DictList('yes_no')" />
        </a-form-model-item>
      </a-form-model>
        <section class="footer">
          <a-button class="cancel-btn" type="info" @click="handleCancel">{{cancelText}}</a-button>
          <a-button class="confirm-btn" type="primary" @click="handleOk">{{okText}}</a-button>
          <a-button v-show="stepIndex == 0" class="firmware-key-btn" type="info" @click="generateKey">{{ $t('firmware.generate.firmware.key') }}</a-button>
        </section>

    </a-spin>
  </a-modal>
</template>
<script>
import { addFirmware } from "@/api/firmware"
import UploadButton from "@/components/uploadButton"
import { CommonNameRules, VersionRules} from "@/utils/validate"

export default ({
  props:{
    visible: { type: Boolean, default: false },
    productId: { type: String, default: '' },
    disabledType: { type: Array, default: ()=>[] }
  },
  components:{
    UploadButton
  },
  data () {
    return {
      stepIndex:0,
      confirmLoading:false,
      form:{},
      rules: {
        name: CommonNameRules(this.$t("firmware.inputName.valid.zh")),
        nameEn: CommonNameRules(this.$t("firmware.inputName.valid.en")),
        flag: CommonNameRules(this.$t("firmware.inputFlag")),
        type: [{ required: true, message: this.$t("firmware.inputType"), trigger: 'change' }],
        flashSize: [{required: true,message: this.$t("firmware.inputFlashSize"),trigger: 'change',}],
        upgradeOvertime: [ { required: true, message: this.$t("firmware.inputUpgradeTime"), trigger: 'blur' },],
        remark:[ { max:500, message: this.$t('firmware.version.rule.versionDesc'), trigger: 'blur' },]
      },
      versionRules:{
        version: VersionRules(),
        versionDesc:[ { max:500, message: this.$t('firmware.version.rule.versionDesc'), trigger: 'blur' },],
        upgradeMode: [{ required: true, message: this.$t("firmware.upgradeType.valid"), trigger: 'change' }],
        upgradeFilePath: [{ required: true, message: this.$t("firmware.upgradeFirmware.valid"), trigger: 'change' }],
        isMust: [{ required: true, message: this.$t("firmware.keyVersion.valid"), trigger: 'change' }],
      },
      okText: this.$t('firmware.version.label.upload'),
      cancelText: this.$t('public.cancel'),
    }
  },
  mounted(){

  },
  watch:{
    // 按钮文字
    stepIndex (val) {
      if(val == 0){
        this.okText  = this.$t('firmware.version.label.upload'),
        this.cancelText = this.$t('public.cancel')
      } else {
        this.okText= this.$t('public.submit'),
        this.cancelText= this.$t('public.upstep')
      }
    },
    visible(val){
      if(val){
        this.$refs.ruleForm?.resetFields();
        this.$refs.versionForm?.resetFields();
        this.form = {}
      }
    }
  },
  computed:{
    firmTypeOptions(){
      return this.$DictList('firmware_type').map(item=>{
        if(this.disabledType.length > 0 && this.disabledType.some(t=>t==item.value)){
          return {...item, disabled: true}
        }else {
          return item
        }
      })
    }
  },
  methods:{
    handleOk() {
      if(this.stepIndex == 0) {
        // 新增固件
        this.$refs.ruleForm.validate(async(valid) => {
          if (!valid) return
          this.stepIndex = 1
        });
      } else {
        // 新增固件版本
        this.$refs.versionForm.validate(async(valid) => {
          if (!valid) return
          this.confirmLoading = true;
          const param = {...this.form, isMust: Number(this.form.isMust)}
          if(this.productId) param['productId'] = this.productId
          const resVersion = await addFirmware(param)
          this.confirmLoading = false;
          if(resVersion.code !== 0 ) return
          this.form = {}
          this.stepIndex = 0
          this.$emit("sumitEdit")
        });
      }
    },
    generateKey(){
      this.$refs.ruleForm.validate(async(valid) => {
          if (!valid) return
          this.confirmLoading = true;
          const param = {...this.form}
          if(this.productId) param['productId'] = this.productId
          const resVersion = await addFirmware(param)
          this.confirmLoading = false;
          if(resVersion.code !== 0 ) return
          this.form = {}
          this.$emit("sumitEdit")
        });
    },
    handleCancel() {
      if(this.stepIndex == 0) {
        this.$emit("cancelEdit")
      } else{
        this.stepIndex = 0
      }
    },

    // 文件上传
    uploaded(data,path,name,size,key){
      this.$set(this.form,path,data.fullPath)
      this.$set(this.form,name,data.name)
      this.$set(this.form,size,data.size)
      this.$set(this.form,key,data.key)
      this.$refs["ruleForm"].clearValidate([path]);
    },
   
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
.steps-wrap{
  width: 80%;
  margin: 20px auto 30px;
}

/deep/ .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after{
  background-color: @aithings-border-color;
}
/deep/ .ant-steps-item-wait .ant-steps-item-icon{
  border-color: @aithings-text-tips-color;
}
/deep/.ant-steps-item-process .ant-steps-item-icon{
  border-color: @primary-color;
  background: @primary-color;
}
/deep/ .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon{
  color: @aithings-text-tips-color;
}
/deep/ .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title{
  color: @aithings-text-tips-color;
}
/deep/ .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title{
  font-weight: 600;
}
/deep/.ant-steps-item-finish .ant-steps-item-icon{
  border-color: @primary-color;
  background: @primary-color;
}
/deep/.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon{
  color: #fff;
}
/deep/.ant-form{
  padding: 0 30px;
}
/deep/.ant-modal-body{
  padding: 0;
}
.footer{
    width: 100%;
    padding: 10px 0;
    text-align: center;
    border: 0;
    background: @aithings-search-bg-color;
    .ant-btn{
      padding: 0 28px;
      border: 1px solid @aithings-text-tips-color;
      color: @aithings-text-tips-color;
    }
    .ant-btn+.ant-btn{
      margin-left: 20px;
    }
    .ant-btn-primary{
      background: @primary-color;
      border: 1px solid @primary-color;
      color: #fff;
      &:disabled{
        color: rgba(0,0,0,.25);
        background-color: #f5f5f5;
        border-color: #d9d9d9;
      }
    }

  }
</style>