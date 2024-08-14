<template>
    <a-modal
    :title="data.id? $t('firmware.version.title.edit') : $t('firmware.version.title.add')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="versionForm" class="regular-form" :model="data" :rules="versionRules" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item :label="$t('firmware.version.label.version')" prop="version" >
          <a-input v-if="!data.id" v-model="data.version"/>
          <span v-if="data.id">{{data.version}}</span>
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.version.label.desc')" prop="desc" >
          <a-textarea v-model="data.desc" :maxLength="500" :auto-size="{ minRows: 2}"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.version.label.upgradeMode')" prop="upgradeMode" >
        <a-radio-group v-model="data.upgradeMode" :options="$DictList('upgrade_pkg_mode')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.version.label.upgradeFilePath')" prop="upgradeFilePath" >
          
          <section class="flex y-axis-center">
            <a-input v-show="false" v-model="data.upgradeFilePath" />
            <span class="file-name tap-pointer" v-text="data.upgradeFileName || ''" @click="handleDownload(data.upgradeFilePath,data.upgradeFileName)"></span>
            <upload-button 
              type="file"
              accept=".bin"
              :buttonText="data.upgradeFilePath ? $t('public.reupload') : $t('firmware.version.label.upload')"
              warningFileType="bin"
              catalogName="firmware"
              :limitSize="10"
              :showFile="false"
              :suffixValid="true"
              @uploaded="e=>uploaded(e,'upgradeFilePath','upgradeFileName','upgradeFileSize','upgradeFileKey')"
            />
            
          </section>
          
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.version.label.prodFilePath')" prop="prodFilePath" >
          <a-input v-show="false" v-model="data.prodFilePath" />
          <section class="flex y-axis-center">
            <span class="file-name tap-pointer" v-text="data.prodFileName || ''" @click="handleDownload(data.prodFilePath,data.prodFileName)"></span>
            <a-input v-show="false" v-model="data.prodFilePath" />
            <upload-button 
              type="file"
              accept=".bin"
              :buttonText="data.prodFilePath ? $t('public.reupload') : $t('firmware.version.label.upload')"
              warningFileType="bin"
              catalogName="firmware"
              :limitSize="10"
              :showFile="false"
              :suffixValid="true"
              @uploaded="e=>uploaded(e,'prodFilePath','prodFileName','prodFileSize','prodFileKey')"
            />
          </section>
          
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.version.label.isMust')" prop="isMust" >
          <a-radio-group v-model="data.isMust" :options="$DictList('yes_no')" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { addFirmwareVersion, editFirmwareVersion } from "@/api/firmware";
import UploadButton from "@/components/uploadButton"
import { VersionRules} from "@/utils/validate"
export default ({
  props:{
    visible: { type: Boolean, default: false },
    data: {type: Object, default: ()=>{}},
    firmwareId: {type: String, default: ''},
    source: { type: Number, default: 0 }
  },
  components:{
    UploadButton
  },
  data () {
    return {
      stepIndex:0,
      confirmLoading:false,
      versionRules:{
        version: VersionRules(),
        versionDesc:[ { max:500, message: this.$t('firmware.version.rule.versionDesc'), trigger: 'blur' },],
        upgradeMode: [{ required: true, message: this.$t("firmware.upgradeType.valid"), trigger: 'change' }],
        upgradeFilePath: [{ required: true, message: this.$t("firmware.upgradeFirmware.valid"), trigger: 'change' }],
        isMust: [{ required: true, message: this.$t("firmware.keyVersion.valid"), trigger: 'change' }],
      },
    }
  },
  mounted(){
    
  },
  methods:{

    handleOk() {
      // 判断新建/编辑
        this.$refs.versionForm.validate(async(valid) => {
          if (!valid) return
          this.confirmLoading = true;
          let res = {}
          if(this.data.id){
            res = await editFirmwareVersion({firmwareId:this.firmwareId,...this.data})
          } else{
            const params = {firmwareId:this.firmwareId,...this.data}
            if(this.source){
              params.source = this.source
            }
            res = await addFirmwareVersion(params)
          }
          this.confirmLoading = false;
          if(res.code !== 0 ) return
          this.$refs.versionForm?.resetFields()
          this.$emit("sumitEdit")
          
        });
      
    },
    handleCancel() {
      this.$refs.versionForm?.resetFields()
      this.$emit("cancelEdit")
    },

    // 文件上传
    uploaded(data,path,name,size,key){
      this.$set(this.data,path,data.fullPath)
      this.$set(this.data,name,data.name)
      this.$set(this.data,size,data.size)
      this.$set(this.data,key,data.key)
      this.$refs["versionForm"].clearValidate([path]);
    },

    
    // 下载固件
    async handleDownload(path,name){
      this.downloadDisable = true
      await this.$DownloadTemplate(
        this,
        {
          url: path,
        },
        name,
        "get",
      );
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";

/deep/.ant-form-item-label{
  line-height: 40px;
}
/deep/.ant-radio-wrapper{
  margin-right: 74px;
}
.file-name{
  margin-right: 10px;
  color: @primary-color;
  text-decoration: underline;
}
</style>