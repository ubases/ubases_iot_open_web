<template>
  <a-spin :spinning="isLoading" wrapperClassName="spin-ele">
    <a-upload
      name="file"
      list-type="picture-card"
      class="image-uploader"
      :disabled="disabled"
      :multiple="multiple"
      :showUploadList="false"
      :accept="accept"
      :beforeUpload="beforeUpload"
      :customRequest="customRequest"
    >
      <div v-if="!fileUrl" class="unupload">
        <plus-icon/>
        <div class="ant-upload-text">
          {{ buttonText}}
        </div>
      </div>
      <section v-if="fileUrl" class="image-wrap">
        <img :src="fileUrl" class="image"/>
      </section>
    </a-upload>
  </a-spin>
</template>

<script>
import { beforeUpload } from "@/utils/validate"
import { PlusIcon } from "@/core/icons"
import { uploadFile } from "@/api/common"
import { getBase64 } from "@/utils/util"

export default ({
  name:"UploadCard",
  props:{
    disabled: { type: Boolean, default: false },    // 是否禁止
    accept: { type: String, default: '' },          // 可上传文件类型
    showFileList: { type: Boolean, default: false },  // 是否显示文件列表
    multiple: { type: Boolean, default: false },    // 是否上传多张
    buttonText: { type: String, default: '上传'},  // 按钮文字
    acceptList: { type: Array, default: [] },     // 校验文件类型
    limitSize: { type: Number, default: 0 },     // 限制文件大小
    limitWidth: { type: Number, default: 0 },    // 限制文件宽度
    limitHeight: { type: Number, default: 0 },   // 限制文件高度
    limitRatio: { type: String, default: '' },   // 限制文件比例
    warningFileType: { type: String, default: '' },   // 提示语的文件类型
    fileUrl: { type: String, default: '' },    // 已上传的文件地址
    catalogName: { type: String, default: 'open' },    // 文件上传至服务器的目录
    isRequest: { type: Boolean, default: true },     // 是否上传接口
  },
  components:{
    PlusIcon
  },
  data () {
    return {
      isLoading: false
    }
  },
  mounted(){},
  methods:{
    beforeUpload(file){
      if (!this.acceptList.some(item => item == file.type)) {
        this.$message.warning(this.$t('public.upload.type.limit',{type:this.warningFileType}))
        return false
      }
      return beforeUpload(this,file,this.limitSize,this.limitWidth,this.limitHeight,this.limitRatio)
    },

    // 图片上传
    async customRequest(fileData){
      if(!this.isRequest){
        const res = await getBase64(fileData.file)
        this.$emit('uploaded',{file:fileData.file,url:res})
      } else {
        this.isLoading = true
        const file = fileData.file
        const res = await uploadFile(file,this.catalogName)
        this.isLoading = false
        if (res.code !== 0) return
        this.$emit('uploaded',res.data)
        this.$message.success(this.$t('public.upload.succeed'))
      }

    }
  }

})
</script>
<style lang="less" scoped>
@import "../../global.less";

/deep/.ant-upload-picture-card-wrapper{
    width: fit-content;
    display: block;
  }
  /deep/.ant-upload.ant-upload-select-picture-card{
    width: 70px;
    height: 70px;
    border: 1px dashed @primary-color;
    background: transparent;
    img{
      width: 70px;
      height: auto;
    }
    .unupload{
      padding: 10px 0 0;
      width: 70px;
      height: 70px;
    }
  }
  .ant-upload-text{
    color: @primary-color;
    line-height: 20px;
    font-size: 14px;
  }
</style>