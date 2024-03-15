<template>
  <section class="report-content flex y-axis-center">
    <img :src="reportCover" class="report-cover"/>
    <section class="details">
      <h4>"{{details.name}}"{{$t('setting.finished.test.report')}}</h4>
      <p>{{$t('setting.finished.test.type')}}：{{$DictName('test_type', data.testType)}}</p>
      <p>{{$t('setting.finished.test.report.effectiveness')}}：{{$DictName('is_valid', data.isValid)}}</p>
      <p>{{$t('setting.finished.test.resource')}}：{{$DictName('test_origin', data.testOrigin)}}</p>
      <p>{{$t('setting.finished.test.generated.time')}}：{{ data.createdAt | momentFilter }}</p>
    </section>
    <section class="action">
      <a-button class="download-button"  @click="handleDownload">{{$t('setting.finished.test.download.report')}}</a-button>
      <a-button v-if="status == 2" class="upload-button" @click="reUpload">{{$t('setting.finished.test.reload')}}</a-button>
    </section>
  </section>
</template>
<script>
import { UploadIcon } from "@/core/icons"

export default {
  props:{
    productTypeId: { type: String, default: '' },
    details:{ type: Object, default: () => {}},
    data:{ type: Object, default: () => {}},
    status: { type: Number, default: 0 },
  },
  components:{
    UploadIcon
  },
  data(){
    return{
      reportCover:require('@/assets/image/report_cover.png'),
    }
  },
  methods:{
    //下载报告
    handleDownload(){
      this.$DownloadTemplate(
        this,
        {
          url: this.data.filePath,
        },
        this.data.fileName,
        'get'
      );
    },

    // 重新上传
    reUpload(){
      this.$emit('reUpload')
    }
  }
}
</script>
<style scoped lang="less">
@import "../../../../../global.less";
  .report-content{
    padding-top: 40px;
  }
  .report-cover{
    width: 204px;
    height: 273px;
  }
  .details{
    flex: 1;
    padding-left: 29px;
    h4{
      padding-bottom: 20px;
      font-size: 15px;
    }
    p{
      color: @aithings-text-color-gray;
      line-height: 40px;
    }
  }
  .action{
    min-width: 140px;
    width: 30%;
  }
  .download-button{
    display: block;
    width: 140px;
    border: 1px solid @primary-color;
    color: @primary-color;
  }
  .upload-button{
    display: block;
    margin-top: 29px;
    width: 140px;
    border: 1px solid @aithings-text-color-gray;
    color: @aithings-text-color-gray;
  }

</style>