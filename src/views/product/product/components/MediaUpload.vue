<template>
  <a-upload
    name="file"
    accept="image/png,image/gif,video/mp4"
    :showUploadList="false"
    :customRequest="handCustomerRequest"
    @change="handleFileChange"
  >
    <a-button size="small" class="upload" :loading="isLoading" >{{$t('public.upload')}}</a-button>
  </a-upload>
</template>
<script>
import { uploadFile } from "@/api/common"

export default ({
  name:"MediaUpload",
  data() {
    return{
      isLoading: false
    }
    
  },

  mounted() {
  },

  methods:{
    // 图片上传
    async handleFileChange(fileData) {
      const file = fileData.file
      if (file.type !== 'image/png' && file.type !== 'image/gif' && file.type !== 'video/mp4') {
        this.$message.warning(this.$t('setting.network.info.file.type'))
        return false
      } 
      const isLimitImage = file.size / 1024 / 1024 > 0.3
      if (isLimitImage && /image/.test(file.type)) {
        this.$message.error(this.$t('setting.network.info.image.size'))
        return false
      }
      const isLimitVideo = file.size / 1024 / 1024 > 0.5
      if (isLimitVideo && /video/.test(file.type)) {
        this.$message.error(this.$t('setting.network.info.vedio.size'))
        return false
      }
      this.isLoading = true
      const res = await uploadFile(file.originFileObj,"network")
      this.isLoading = false
      if (res.code !== 0) return
      this.$emit('uploaded', { data: res.data, type: file.type.includes('mp4') ? 'video' :'image' })
      
    },
    handCustomerRequest() {},
  },

  

})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
  /deep/ .ant-btn.upload{
    width: 80px;
    margin-top: 17px;
  }
  .upload{
    margin-right: 10px;
    border: 1px solid @primary-color;
    color: @primary-color;
  }
</style>