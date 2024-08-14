<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="title[type] + $t('offlinePanelDetail.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="container">
        <section class="form-wrap content-padding">
          <a-spin :spinning="confirmLoading">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 13 }"
          >
            <a-form-model-item :label="$t('offlinePanelDetail.label.name')" prop="name">
              <a-input v-if="!readOnly" v-model="form.name" :maxLength="50" :placeholder="$t('offlinePanelDetail.placeholder.name')"/>
              <span v-if="readOnly">{{ form.name }}</span>
            </a-form-model-item>
            <a-form-model-item :label="$t('offlinePanelDetail.label.type')" prop="panelType">
              <a-radio-group name="radioGroup" :default-value="1">
                <a-radio :value="1">{{$t('panel.type.offline')}}</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item :label="$t('offlinePanelDetail.label.productType')" prop="baseProductId">
              <a-cascader 
                v-if="!readOnly"
                v-model="productTypeCascader"
                :disabled="readOnly" 
                :options="productTypeOptions" 
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                :placeholder="$t('offlinePanelDetail.placeholder.productType')" 
                @change="classifyChange"
               />
               <span v-if="readOnly">{{ form.productTypeText }}</span>
            </a-form-model-item>
            <a-form-model-item :label="$t('offlinePanelDetail.label.product')" prop="productId">
              <a-select 
              v-if="!readOnly" 
              v-model="form.productId" 
              :disabled="readOnly" 
              :options="productfilterOptions" 
              :allowClear="true"
              :placeholder="$t('offlinePanelDetail.placeholder.product')" 
              />
              <span v-if="readOnly">{{form.productId ? $FilterLabel(productOptions,form.productId) :'所有产品' }}</span>
            </a-form-model-item>
            <a-form-model-item :label="$t('offlinePanelDetail.label.previewImg')" prop="previewUrl" >
              <section class="flex y-axis-center">
                <div class="flex">
                  <upload-card 
                    :disabled="readOnly" 
                      accept="image/png,image/jpeg,image/x-ms-bmp"
                      :acceptList="['image/png','image/jpeg','image/x-ms-bmp']"
                      :limitSize="1"
                      limitRatio="3:4"
                      warningFileType="JPEG,PNG,BMP"
                      catalogName="panel"
                      :fileUrl="form.previewUrl"
                      :isRequest="false"
                      @uploaded="e=>uploaded(e,'panelPreview','previewUrl')"
                    />
                    <a style="margin-left: 20px;" v-if="form.previewUrl && type !== 'add'" @click="downloadTemplate(form.previewUrl,form.previewName)">下载</a>
                </div>
                <p v-if="!readOnly" class='upload-tips'>{{$t('offlinePanelDetail.tips.previewImg')}}</p>
              </section>
            </a-form-model-item>
            <a-form-model-item :label="$t('offlinePanelDetail.label.file')" prop="panelUrl" >
              <span>{{ form.panelUrlName }}</span>
              <a style="margin-left: 20px;" v-if="form.panelUrl && type !== 'add'" @click="downloadTemplate(form.panelUrl,form.panelUrlName)">下载</a>
                <upload-button 
                  v-if="!readOnly"
                  :disabled="readOnly" 
                  accept=".zip"
                  :buttonText="$t('public.upload')"
                  warningFileType="zip"
                  catalogName="panel"
                  :showFile="false"
                  :suffixValid="true"
                  :limitSize="2"
                  type="file"
                  :fileUrl="form.panelUrl"
                  :isRequest="false"
                  @uploaded="e=>uploaded(e,'panelFile','panelUrl','panelUrlName')"
                />
              <p v-if="!readOnly" class='upload-tips'>{{ $t('offlinePanelDetail.tips.file') }}</p>
            </a-form-model-item>
            <a-form-model-item :label="$t('offlinePanelDetail.label.lang')" prop="langFileName" >
              <span>{{ form.langFileName }}</span>
              <a style="margin-left: 20px;" v-if="form.langFileName && type !== 'add'" @click="downloadTemplate(`/v1/platform/web/lang/appResources/download?belongType=4&belongId=${id}`,form.langFileName)">下载</a>
              <upload-button 
                v-if="!readOnly"
                :disabled="readOnly" 
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                :acceptList="['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv']"
                :buttonText="$t('public.upload.file')"
                warningFileType="xls,csv"
                catalogName="panel"
                :showFile="false"
                :limitSize="2"
                type="file"
                :fileUrl="form.langUrl"
                :isRequest="false"
                @uploaded="e=>uploaded(e,'langFile','langUrl','langFileName')"
              />
              <p v-if="!readOnly" class='upload-tips'>{{ $t('offlinePanelDetail.tips.lang') }}</p>
              
            </a-form-model-item>
            <a-form-model-item :label="$t('offlinePanelDetail.label.desc')" prop="desc">
              <a-textarea v-if="!readOnly" v-model="form.desc" :disabled="readOnly" :maxLength="500" :placeholder ="$t('offlinePanelDetail.placeholder.desc')" :auto-size="{ minRows: 4}"/>
              <span v-if="readOnly">{{ form.desc || '无' }}</span>
            </a-form-model-item>
            <a-form-model-item v-if="!readOnly" :wrapper-col="{ span: 14, offset: 3 }">
              <a-button type="primary" @click="handleSave"> {{$t('public.sumit')}}</a-button>
              <a-button @click="$router.back()" class="cancel-btn">{{$t('public.cancel')}}</a-button>
            </a-form-model-item>
            <a-form-model-item v-if="readOnly" :wrapper-col="{ span: 14, offset: 3 }">
              <a-button type="primary" @click="readOnly=false"> {{$t('public.Modify')}}</a-button>
              <a-button class="cancel-btn" @click="handleDelete"> {{$t('public.delete')}}</a-button>
              <a-button @click="$router.back()" class="cancel-btn">{{$t('public.cancel')}}</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
        </section>
      </section>
    </a-page-header>
  </section>
</template>
<script>
import UploadCard from "@/components/uploadCard"
import UploadButton from "@/components/uploadButton"
import{ getProductClassifyList,getProductList } from "@/api/product"
import { getPanelDetail,editPanel,addPanel,deletePanel } from "@/api/offlinePanel"
import { flatArr } from "@/utils/util"

export default {
  name: "OfflinePanelDetail",
  components:{
    UploadCard,
    UploadButton
  },
  data() {
    return {
      id: '',
      form: {},
      rules: {
        name: [{ required: true, message: this.$t('offlinePanelDetail.placeholder.name'), trigger: '' }],
        baseProductId: [{ required: true, message: this.$t('offlinePanelDetail.placeholder.productType'), trigger: 'change' }],
        previewUrl: [{ required: true, message: this.$t('offlinePanelDetail.placeholder.previewImg'), trigger: 'change' }],
        panelUrl: [{ required: true, message: this.$t('offlinePanelDetail.placeholder.file'), trigger: 'change' }],
        langFileName: [{ required: true, message: this.$t('offlinePanelDetail.placeholder.lang'), trigger: 'change' }],
      },
      type:'',
      title:{
        add: this.$t('public.add'),
        edit: this.$t('public.edit'),
        check: this.$t('public.view'),
      },
      productTypeOptions:[],
      productOptions:[],
      productTypeCascader:[null],
      productTypeList:[],
      readOnly:true,
      confirmLoading:false
    }
  },
  computed: {
    productfilterOptions(){
      if(this.form.baseProductId){
        return this.productOptions.filter(item=>item.baseProductId == this.form.baseProductId)
      } else {
        return this.productOptions
      }
    }
  },
  async created() {
    this.id = this.$route.query.id || ''
    this.type = this.$route.query.type || '' // add：添加， check：查看， edit：编辑，
    this.readOnly = this.type === 'check'

    await this.getProductClassifyList()
    await this.getProductList()
    if(this.type && this.type !== 'add'){
      this.getDetail()
    }
  },
  methods: {

    // 获取产品分类列表
    async getProductClassifyList() {
      const res = await getProductClassifyList()
      if(res.code !== 0) return
      this.productTypeList = []
      const productTypeOptions= res.data?.list?.map(item =>{
        return {
          ...item,
          children: item.children?.map(p=>{
            p.children = p.products
            this.productTypeList= [...this.productTypeList,...p.products]
            return p
          }) ||[]
        } 
      })
      this.productTypeOptions = productTypeOptions.filter(item=>item.children.length > 0)
    },

    // 产品类型切换
    classifyChange(value){
      console.log(value)
      this.$set(this.form,'baseProductId',value[value.length - 1] ?? '')
      this.$set(this.form,'productId','')
      this.$refs.ruleForm?.clearValidate(['baseProductId'])
    },

    // 获取产品列表
    async getProductList() {
      const res = await getProductList({page:0})
      if(res.code !== 0)return
      this.productOptions = res.data?.list?.map(item=>{
        return{
          label: item.name,
          value: item.id,
          baseProductId:item.schemeId
        }
      })
    },

    // 获取详情
    async getDetail(){
      const res = await getPanelDetail(this.id)
      if(res.code !== 0) return
      this.form = {...res.data, name:res.data.panelName}
      const data = this.productTypeList.filter(item=>item.id == this.form.baseProductId)?.pop() || null
      if(data){
        if(data.productTypeIdPath && data.productTypeIdPath.length>0){
          this.productTypeCascader = [...data.productTypeIdPath,this.form.baseProductId]
        } else{
          this.productTypeCascader = [this.form.baseProductId]
        }
        this.$set(this.form,'productTypeText',data.name)
      }
    },

    // 图片上传
    uploaded(data, file, url,name){
      this.$set(this.form,file,data.file)
      this.$set(this.form,url,data.url)
      this.$refs.ruleForm.clearValidate([url]);
      if(name){
        this.$set(this.form,name,data.file.name)
      }

    },

    // 保存
    handleSave(){
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = this.type === 'add' ? await addPanel({...this.form,panelType:3}) : await editPanel({...this.form,panelType:3})
        this.confirmLoading = false
        if(res.code !== 0 ) return
        this.$router.push({path:"/panel/offlinePanel/index"})
      })
    },

    handleDelete() {
      if(this.form.useCount>0){
        // 已应用于产品
        this.$WarningModal(this, this.$t('offlinePanelList.delete.disabled'))
      }else{
        // 产品未使用
        this.$WarningModal(this, this.$t('offlinePanelList.delete.confirm')).then(async () => {
          const res = await deletePanel(this.id)
          this.$message.success(this.$t('public.delete_success'))
          if (res.code !== 0) return
          this.$router.push({ path: "/panel/offlinePanel/index" })
        });
      }
    },

    downloadTemplate(url, name){
      this.$DownloadTemplate( this, { url }, name, "get" )
    }

  }
}
</script>
<style lang="less" scoped>
  @import "../../../../global.less";
  .page-wrap, /deep/.ant-page-header{
    height: 100%;
  }
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .container{
    padding: 0 20px 30px;
  }
  .form-wrap{
    max-width: 1130px;
  }
  .content-padding{
    padding-top: 10px;
  }
  .form-item-detail{
    padding-top: 4px;
  }
  .tips{
    color: @aithings-text-color-gray;
  }
  .ant-btn{
    margin-top: 20px;
    padding: 0 28px;
  }
  .ant-btn + .ant-btn {
    margin-left: 20px;
  }
  .cancel-btn{
    color: @primary-color;
    border-color: @primary-color;
  }
  .upload-tips{
    color: #8392A7;
  }

</style>
