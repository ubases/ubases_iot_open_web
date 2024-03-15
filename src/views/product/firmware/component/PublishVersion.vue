<template>
    <a-modal
    :title="$t('firmware.putaway-version')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p class="warning-text">{{$t('firmware.publish.warning.text')}}</p>
      <a-form-model ref="ruleForm" class="regular-form" :model="firmwareVersionData" :rules="rules" :hideRequiredMark="true" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-model-item :label="$t('firmware.publish.label.name')">  {{data.name}}  </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.id')">  {{data.id}}  </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.flag')"> {{data.flag}}  </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.type')" >  {{ $DictName('firmware_type',data.type)}}  </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.upgradeChannel')" >  {{data.upgradeChannel}} </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.flashSize')">  {{data.flashSize}} </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.upgradeOvertime')"> {{data.upgradeOvertime}} </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.version')" prop="version" >  {{firmwareVersionData.version}}  </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.desc')" prop="desc" >  {{firmwareVersionData.desc}} </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.upgradeMode')" prop="upgradeMode" >
        <a-radio-group v-model="firmwareVersionData.upgradeMode" :options="$DictList('upgrade_pkg_mode')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.upgradeFilePath')" prop="upgradeFilePath" >
          <section class="flex y-axis-center">
              <input v-show="false" v-model="firmwareVersionData.upgradeFileName" />
              <span v-text="firmwareVersionData.upgradeFileName || ''" class="file-name"></span>
              <a-input v-show="false" v-model="firmwareVersionData.upgradeFilePath" />
              <upload-button 
                type="file"
                accept=".bin"
                :buttonText="$t('public.reupload')"
                warningFileType="bin"
                catalogName="firmware"
                :limitSize="10"
                :showFile="false"
                :suffixValid="true"
                @uploaded="e=>uploaded(e,'upgradeFilePath','upgradeFileName','upgradeFileSize','upgradeFileKey')"
              />
          </section>
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.prodFilePath')" prop="prodFilePath" >
          <section class="flex y-axis-center">
              <input v-show="false" v-model="firmwareVersionData.prodFileName" />
              <span v-text="firmwareVersionData.prodFileName || ''" class="file-name"></span>
              <a-input v-show="false" v-model="firmwareVersionData.prodFilePath" />
              <upload-button 
                type="file"
                accept=".bin"
                :buttonText="firmwareVersionData.prodFilePath ? $t('public.reupload') : $t('firmware.version.label.upload')"
                warningFileType="bin"
                catalogName="firmware"
                :limitSize="10"
                :showFile="false"
                :suffixValid="true"
                @uploaded="e=>uploaded(e,'prodFilePath','prodFileName','prodFileSize','prodFileKey')"
              />
          </section>
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.publish.label.isMust')" prop="isMust" >
          <a-radio-group v-model="firmwareVersionData.isMust" :options="$DictList('yes_no')" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { onShelfFirmwareVersion, getFirmwareDetail} from "@/api/firmware"
import UploadButton from "@/components/uploadButton"

export default ({
  props:{
    visible: { type: Boolean, default: false },
    firmwareVersionData: { type: Object, default: () =>{}},
    firmwareId: {type: String, default: ''},
  },
  components:{
    UploadButton
  },
  data () {
    return {
      stepIndex:0,
      confirmLoading:false,
      form:{},
      data:{},
      rules:{
        prodFilePath: [{ required: true, message: this.$t("firmware.upgradeFirmware.valid"), trigger: '' }],
      },

    }
  },
  watch:{
    firmwareId(val){
      if(val){
        this.getFirmwareDetail()
      }
    }
  },
  mounted(){
    if(this.firmwareId){
      this.getFirmwareDetail()
    }
  },
  methods:{
    // 获取固件详情
    async getFirmwareDetail(){
      this.confirmLoading = true
      const res = await getFirmwareDetail(this.firmwareId)
      this.confirmLoading = false
      if (res.code !==0) return
      this.data = res.data
    },

    handleOk() {
        this.$refs.ruleForm.validate(async(valid) => {
          if (!valid) return
          this.confirmLoading = true;
          // id需要提交版本id
          const res = await onShelfFirmwareVersion({...this.firmwareVersionData})
          this.confirmLoading = false;
          if(res.code !== 0 ) return
          this.$emit("handleOk")
          this.$refs.ruleForm?.resetFields()
        });
    },
    handleCancel() {
      
      this.$emit("handleCancel")
      this.$refs.ruleForm?.resetFields()
    },

    // 文件上传
    uploaded(data,path,name,size,key){
      this.$set(this.firmwareVersionData,path,data.fullPath)
      this.$set(this.firmwareVersionData,name,data.name)
      this.$set(this.firmwareVersionData,size,data.size)
      this.$set(this.firmwareVersionData,key,data.key)
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

.warning-text{
    color: @aithings-warning-color;
    line-height: 20px;
    margin-bottom: 20px;
}

/deep/ .ant-modal .ant-modal-body .ant-form-item{
  margin-bottom: 0;
}
.file-name{
  margin-right: 10px;

}
</style>