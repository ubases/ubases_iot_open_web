<template>
  <section class="upload-button-wrap flex y-axis-center">
    <template v-if="showFile">
      <div class="img-wrap" v-if="type=='img' && fileUrl" :style="{ width: `${imgWrapWidth}px`, height: `${imgWrapHeight}px` }">
        <img :src="fileUrl" class="image"  @click=" $PreviewModal({ url: fileUrl})"/>
      </div>
      <a v-if="type=='file' && fileUrl" :href="fileUrl" class="file-name">{{ fileName }}</a>
    </template>
    <div class="upload-wrap">
      <slot name="tips"></slot>
      <a-upload
        name="file"
        :accept="accept"
        :disabled="disabled"
        :multiple="multiple"
        :showUploadList="showFileList"
        :before-upload="beforeUpload"
        :customRequest="customRequest"
      >
        <a-button :disabled="disabled || isLoading" :loading="isLoading" :class="['upload-button',btnClass]">
          <template v-if="!isLoading">
            <upload-blue-icon/>
          </template> 
          {{ buttonText }} 
        </a-button>
      </a-upload>
      <slot name="tipsDown"></slot>
    </div>
  </section>
</template>

<script>
import { beforeUpload } from "@/utils/validate"
import { uploadFile } from "@/api/common"
import { UploadBlueIcon } from "@/core/icons"

export default ({
  name:"UploadButton",
  props:{
    disabled: { type: Boolean, default: false },    // 是否禁止
    accept: { type: String, default: '' },   // 可上传文件类型
    showFileList: { type: Boolean, default: false },    // 是否显示文件列表
    multiple: { type: Boolean, default: false },    // 是否上传多张
    buttonText: { type: String, default: '上传图片'}, // 按钮文字
    type: { type: String, default: 'img' },   // 图片img， 文件file
    acceptList: { type: Array, default: ()=>[] },   // 校验文件类型
    limitSize: { type: Number, default: 0 },    // 限制文件大小
    limitWidth: { type: Number, default: 0 },    // 限制文件宽度
    limitHeight: { type: Number, default: 0 },   // 限制文件高度
    limitRatio: { type: String, default: '' },   // 限制文件比例
    warningFileType: { type: String, default: '' },     // 提示语的文件类型
    fileUrl: { type: String, default: '' },          // 已上传的文件地址
    fileName: { type: String, default: '' },        // 已上传的文件名称
    catalogName: { type: String, default: 'open' },      // 文件上传至服务器的目录
    imgWrapWidth: { type: Number, default: 80 },        // 图片显示框宽度
    imgWrapHeight: { type: Number, default: 80 },       // 图片显示框高度
    showFile: { type: Boolean, default: true },         // 是否显示已上传文件
    btnClass: { type: String, default: '' },            // 上传按钮的类名
    suffixValid: { type: Boolean, default: false },     // 是否通过文件名称判断类型
    showMsg: { type: Boolean, default: true },     // 是否显示上传成功的提示
  },
  components:{
    UploadBlueIcon
  },
  data () {
    return {
      isLoading: false
    }
  },
  mounted(){},
  methods:{
    beforeUpload(file){
      if (!this.suffixValid && !this.acceptList.some(item => item == file.type)) {
        this.$message.warning(this.$t('public.upload.type.limit',{type:this.warningFileType}))
        return false
      } else if(this.suffixValid) {
        if (file.name.split('.').pop() !== this.warningFileType) {
          this.$message.warning(this.$t('public.upload.type.limit',{type:this.warningFileType}))
          return false
        } 
      } 
      return beforeUpload(this,file,this.limitSize,this.limitWidth,this.limitHeight,this.limitRatio)
    },

    // 图片上传
    async customRequest(fileData){
      this.isLoading = true
      const file = fileData.file
      const res = await uploadFile(file,this.catalogName)
      this.isLoading = false
      if (res.code !== 0) return
      this.$emit('uploaded',res.data)
      if(this.showMsg){
        this.$message.success(this.$t('public.upload.succeed'))
      }
      
    }
  }

})
</script>
<style lang="less" scoped>
@import "../../global.less";

.img-wrap{
  padding: 8px;
  border-radius: 4px;
  border: 1px solid @aithings-color-E9EAEE;
  .image{
    display: block;
    max-width: 100%;
    height: auto;
  }
}
.file-name{
  color: @primary-color;
  text-decoration: underline;
}
.img-wrap,.file-name{
  margin-right: 14px;
}
.upload-button{
    border: 1px solid @primary-color;
    color: @primary-color;
    svg{
      transform: translateY(3px);
      margin-right: 10px;
    }
    &:disabled{
      opacity: 0.4;
      background: #fff;
    }
  }
  .upload-button.primary{
    border: 1px solid @primary-color;
    background: @primary-color;
    color: #fff;
    &:disabled{
      opacity: 0.4;
      background: @primary-color;
    }
  }
  .ant-btn{
    padding: 0 20px;
  }
</style>