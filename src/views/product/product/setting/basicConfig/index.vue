<template>
  <section class="panel-wrap">
    <a-row :gutter="[20, 20]">
      <a-col v-for="item in list" :key="item.type" :span="12">
        <button-card :key="item.type" :data="item" @handleClick="config(item)"></button-card>
      </a-col>
      <a-col :span="12">
        <section class="card-wrap">
          <p class="title" v-text="$t('setting.basic.config.instruction.title')"></p>
          <p class="details" v-text="$t('setting.basic.config.instruction.details')"></p>
          <a-upload
            v-if="!productManualData.fileName"
            name="file"
            :multiple="false"
            accept="application/pdf"
            :showUploadList="false"
            :beforeUpload="beforeUpload"
            :customRequest="handleUpload"
          >
            <a-button class="regular-button" :disabled="loading" :loading="loading">{{$t('public.upload')}}</a-button>
          </a-upload>
          
          <section class="flex y-axis-center x-space-between action-wrap" v-if="productManualData.fileName">
            <div class="flex y-axis-center">
              <a-icon type="file-pdf" />
              <p>{{productManualData.fileName}}</p>
              <div class="download" v-text="$t('public.download')" @click="handleDownload(productManualData.fileUrl,productManualData.fileName)"></div>
            </div>
            <div>
              <a-upload
                name="file"
                :multiple="false"
                accept="application/pdf"
                :showUploadList="false"
                :beforeUpload="beforeUpload"
                :customRequest="handleUpload"
              >
                <a-button class="regular-button" :disabled="loading" :loading="loading">{{$t('public.reupload')}}</a-button>
              </a-upload>
              <a-button class="regular-button" @click="handledelete">{{$t('public.delete') }}</a-button>
            </div>
          </section>
        </section>
      </a-col>
      <a-col :span="12">
        <section class="card-wrap">
          <div class="flex"><p class="title" v-text="ruleConfig.title"></p><p class="subtitle" v-text="ruleConfig.subtitle"></p></div>
          <p class="details" v-text="ruleConfig.detail1"></p>
          <p class="details" v-text="ruleConfig.detail2"></p>
          <a-button class="regular-button" @click="config(ruleConfig)">{{ ruleConfig.buttonText }}</a-button>
        </section>
      </a-col>
    </a-row>
  </section>
</template>

<script>
import ButtonCard from "../../components/ButtonCard.vue"
import { uploadFile } from "@/api/common"
import { addManual, editManual, deleteManual, getManualDetail } from "@/api/product"
export default ({
  name:"BasicConfig",
  props:{
    productId: { type: String, default: '' },
    details: { type: Object, default: {} },
    status: { type: Number, default: 0 },
  },
  components:{
    ButtonCard
  },
  watch:{
    status(val){
      this.list[0].buttonText = val== 1 ? this.$t('public.view') :this.$t('setting.basic.config.button')
    },
    ['details.productKey'](){
      this.getProductManual()
    }
  },
  data() {
    return {
      list:[
        {
          title: this.$t('setting.basic.config.connectWork.title'),
          details: this.$t('setting.basic.config.connectWork.details'),
          buttonText: this.status == 1 ? this.$t('public.view') :this.$t('setting.basic.config.button'),
          type:"connectWork",
          disabled:false,
        },{
          title: this.$t('setting.basic.config.language.title'),
          details: this.$t('setting.basic.config.language.details'),
          buttonText: this.$t('setting.basic.config.button'),
          type:"language",
          disabled:false,
        },{
          title: this.$t('setting.basic.config.scene.title'),
          details: this.$t('setting.basic.config.scene.details'),
          buttonText: this.$t('setting.basic.config.button'),
          type:"sceneLinkage",
          disabled:false,
        }
      ],
      productManualData:{
        fileName:'',
        fileUrl:''
      },
      ruleConfig:{
        type: 'ruleConfig',
        title: this.$t('setting.basic.config.ruleConfig.title'),
        subtitle: this.$t('setting.basic.config.ruleConfig.subtitle'),
        detail1: this.$t('setting.basic.config.ruleConfig.detail1'),
        detail2: this.$t('setting.basic.config.ruleConfig.detail2'),
        buttonText: this.$t('setting.basic.config.button'),
      },
      loading: false
    }
  },
  created(){
    if(this.details.productKey){
      this.getProductManual()
    }
    
  },
  methods:{
    // 配置
    config(item){
      if (item.type == 'connectWork') {
        this.$router.push({path:'/product/product/setting/basicConfig/networkInfo/index',query:{productId:this.productId, status: this.status}})
      } else if (item.type == 'language'){
        this.$router.push({path:'/appDevelop/multilingual/index',query:{productId:this.productId}})
      } else if(item.type == 'sceneLinkage'){
        this.$router.push({path:'/product/product/setting/basicConfig/sceneLinkage/index',query:{productId:this.productId, productKey:this.details.productKey, status: this.status}})
      } else if (item.type == 'ruleConfig') {
        this.$router.push({path:'/product/product/setting/basicConfig/ruleConfig/index',query:{productId:this.productId, productKey:this.details.productKey, status: this.status, from:'product'}})
      }
      
    },
    // 获取产品说明书详情
    async getProductManual(){
      const res = await getManualDetail({productKey:this.details.productKey})
      if(res.code!==0)return
      this.productManualData = res.data || {}
    },

    // 上传前校验
    beforeUpload(file){
      if (file.type !== 'application/pdf') {
        const msg = this.$t('public.uploadImg.type') + 'application/pdf' + this.$t('public.file')
        this.$message.warning(msg)
        return false
      } 
      const isLimit = file.size / 1024 / 1024 > 10;
      if (isLimit) {
        this.$message.warning(this.$t('public.file.max') +"10M");
        return false
      }
    },

    //上传产品说明书
    async handleUpload(fileData){
      const file = fileData.file
      this.loading = true
      const res = await uploadFile(file,'manual')
      if (res.code == 0) {
        this.$set(this.productManualData,'fileUrl',res.data.fullPath)
        this.$set(this.productManualData,'fileName',res.data.name)
        this.$set(this.productManualData,'fileMd5',res.data.key)
        const param = {productKey: this.details.productKey, ...this.productManualData}
        const res1 = this.productManualData.id ? await editManual(param): await addManual(param)
        if(res1.code == 0){
          this.$message.success(this.$t('public.file.upload.succeed'))
          this.getProductManual()
        } else {
          this.$message.error(res1.data.msg)
        }
        
      } else {
        this.$message.error(this.$t('public.upload.fault'))
      }
      this.loading = false
    },

    // 删除产品说明书
    handledelete(){
      this.$WarningModal(this, this.$t('public.confirm.delete')+`${this.productManualData.fileName}?`).then(async () => {
        const res = await deleteManual({id:this.productManualData.id})
        if(res.code!==0)return
        this.getProductManual()
      });
    },

    // 下载固件
    async handleDownload(path,name){
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
@import "../../../../../global.less";
.panel-wrap{
  padding-top: 20px;
}
.card-wrap{
    border: 1px solid @aithings-border-color;
    padding: 20px;
    .title{
      font-weight: 600;
      color: @aithings-text-color-black;
      line-height: 20px;
      padding-bottom: 5px;
    }
    .subtitle{
      font-weight: 500;
      font-size: 12px;
      color: @aithings-text-color-black;
      line-height: 20px;
    }
    .details{
      line-height: 18px;
      color: @aithings-text-color-gray;
    }
    /deep/.ant-btn{
      margin-top: 15px;
      padding: 0 35px;
      border: 1px solid @primary-color;
      color: @primary-color;
      &:disabled {
        background: @aithings-table-thread-color;
        border: 1px solid @aithings-border-color;
        color: @aithings-text-tips-color;
      }
    }
  }
  .download{
    color: @primary-color;
    padding-left: 10px;
    cursor: pointer;
  }
  .action-wrap{
    margin-top: 20px;
    .ant-btn{
      margin: 0;
    }
    .regular-button{
      margin-left: 10px;
    }
  }
</style>