<template>
  <section class="page-content">
    <span class="details">{{$t('setting.test.service.details')}}</span><a-button v-if="fileData.filePath" type="link" @click="handleDownload">{{$t('setting.test.service.details1')}}</a-button>
    <section v-if="!fileData.filePath" class="card-list-wrap flex y-axis-center">
      <div class="card">
        <test-edit-icon />
        <h4>{{$t('setting.test.service.edit.example.title')}}</h4>
        <p class="details">{{details.productTypeName + $t('setting.test.service.template.name')}}</p>
        <a-button @click="handleDownload">{{$t('setting.test.service.download.example')}}</a-button>
      </div>
      <div class="arrow">
        <arrow-right-large />
      </div>
      <div class="card">
        <test-self-icon />
        <h4>{{$t('setting.test.service.finish.test.title')}}</h4>
        <p class="details">{{$t('setting.test.service.finish.test.reference')}}</p>
        <p class="details">{{$t('setting.test.service.finish.test.reference1')}}</p>
      </div>
      <div class="arrow">
        <arrow-right-large />
      </div>
      <div class="card">
        <test-report-icon />
        <h4>{{$t('setting.test.service.upload.report.title')}}</h4>
        <p class="details">{{$t('setting.test.service.upload.report.reference')}}</p>
        <a-button v-if="status == 2" @click="handleUpload">{{$t('setting.test.service.upload.report.button')}}</a-button>
      </div>
    </section>
    <template v-if="fileData.filePath">
      <finished-test :data="fileData" :details="details" :productTypeId="productTypeId" :status="status" @reUpload="handleUpload"/>
    </template>
    <!-- <app-test-account :productId="productId" v-if="status==2"/> -->
    <a-modal
      :title="$t('setting.test.service.upload.report.title')"
      :visible="visible"
      :width="540"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-model-item prop="testResult" :label="$t('setting.test.service.prop.testResult')">
            <a-radio-group v-model="form.testResult" :options="$DictList('product_test_result')" />
          </a-form-model-item>
          <a-form-model-item prop="file" :label="$t('setting.test.service.prop.file')">
            <a-upload
              name="file"
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :showUploadList="false"
              :beforeUpload="beforeUpload"
            >
              <a-button class="upload-button"><upload-icon />{{$t('public.upload.file')}}</a-button>
            </a-upload>
            <p class="file-name" v-text="form.fileName"></p>
            <span class="tips">{{$t('setting.test.service.file.type')}}</span>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </section>
</template>
<script>
import { ArrowRightLarge, TestEditIcon, TestSelfIcon, TestReportIcon, UploadIcon } from "@/core/icons"
import FinishedTest from "./FinishedTest.vue"
import { getTestReportFile , getTestTemplate, uploadTestReport} from "@/api/product"
import AppTestAccount from "./AppTestAccount.vue"

export default {
  props:{
    productId: { type: String, default: '' },
    productTypeId: { type: String, default: '' },
    details:{ type: Object, default: () => {}},
    status: { type: Number, default: 0 },
  },
  components:{
    ArrowRightLarge,
    TestEditIcon,
    TestSelfIcon,
    TestReportIcon,
    UploadIcon,
    FinishedTest,
    AppTestAccount
  },
  data(){
    return{
      visible:false,
      confirmLoading:false,
      form:{},
      rules:{
        testResult:[{ required: true, message: this.$t('setting.test.service.rules.testResult'), trigger: 'change' },],
        file:[{ required: true, message: this.$t('setting.test.service.rules.file'), trigger: 'change' },]
      },
      fileData:{},
      templateData:{},
      
    }
  },
  mounted(){
    this.getTestReportFile()
    this.getTestTemplate()
  },
  methods:{
    // 产品测试用例查询
    async getTestReportFile(){
      const res = await getTestReportFile({productId:this.productId})
      if(res.code !== 0)return
      this.fileData = res.data || {}
    },

    // 测试用例模板详细信息查询
    async getTestTemplate(){
      const res = await getTestTemplate({productTypeId:this.productTypeId})
      if(res.code !== 0)return
      this.templateData = res.data || {}
    },

    // 下载测试用例
    handleDownload(){
      if(!this.templateData.tplFile){
        this.$message.warning(this.$t('setting.test.service.no.test.template'))
        return
      } 
      this.$DownloadTemplate(
        this,
        {
          url: this.templateData.tplFile,
        },
        this.templateData.tplFileName,
        "get"
      );
    },

    // 上传报告
    handleUpload(){
      this.form = {}
      this.visible = true
    },

    // 确认上传
    async handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        let formData = new FormData()
        formData.append("file", this.form.file);
        formData.append("testResult", this.form.testResult)
        formData.append("productId", this.productId);
        const res = await uploadTestReport(formData)
        this.confirmLoading = false
        if(res.code !== 0) return
        this.visible = false
        this.$refs.form?.resetFields()
        this.getTestReportFile()
      })
    },

    handleCancel(){
      this.visible = false
      this.$refs.form?.resetFields()
    },

    beforeUpload(file){
      if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.warning(this.$t('setting.test.service.upload.fileType'))
        return false
      } 
      const isLimit = file.size / 1024 / 1024 > 10
      if (isLimit) {
        this.$message.warning(this.$t('setting.test.service.upload.fileSize'))
        return false
      }
      this.form.file = file
      this.$set(this.form,'fileName',file.name)
      this.$refs.form.clearValidate(["file"])
      return false
    },

    
  }
}
</script>
<style scoped lang="less">
@import "../../../../../global.less";
  .page-content{
    padding-top: 16px;
    height: 100%;
  }
  .card-list-wrap{
    padding-top: 40px;
  }
  .details{
    color: @aithings-text-color-gray;
    line-height: 20px;
  }
  .card{
    flex: 1;
    height: 273px;
    padding-top: 40px;
    border-radius: 4px;
    border: 1px solid @aithings-border-color;
    text-align:center;
    h4{
      padding: 10px 0;
      font-size: 15px;
    }
    /deep/.ant-btn{
      margin-top: 29px;
      min-width: 140px;
      border: 1px solid @primary-color;
      color: @primary-color;
    }
  }

  .arrow{
    padding: 0 18px 0 7px;
  }

  /deep/.ant-modal-body{
    padding: 37px 20px 53px;
  }
  .upload-button{
    width: 116px;
    border: 1px solid @primary-color;
    color: @primary-color;
    svg{
      transform: translateY(3px);
      margin-right: 10px;
    }
  }
  .tips{
    padding-left: 15px;
    font-size: 12px;
    color: @aithings-text-tips-color;
    line-height: 17px;
  }

</style>