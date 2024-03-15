<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('create.product.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <a-steps :current="currentStep" direction="vertical" size="small">
        <!-- 步骤一  请选择你想创建的产品 -->
        <a-step disabled>
          <section slot="title" class="flex y-axis-center">
            <p class="step-title" v-text="selectedProduct!==null ? $t('create.product.productType') : $t('create.product.you.want')"></p>
            <a-button type="link" v-if="selectedProduct!==null" @click="reselect(0)">{{$t('create.product.reselect')}}</a-button>
          </section>
          <section slot="description" class="description">
            <a-tabs v-if="currentStep === 0" v-model="productTab">
              <a-tab-pane v-for="(item,index) in productList" :key="index" :tab="item.name">
                <section v-for="child in item.children" :key="child.id">
                  <p class="category" v-text="child.name"></p>
                  <section class="flex">
                    <radio-card
                      v-for="product in child.products"
                      :data="{ ...product, productTypeId:child.id}"
                      :imgUrl="product.imageUrl || ''"
                      @cardSelected="handleSelectproduct"
                      :key="product.id">
                      <p class="product-name" v-text="product.name"></p>
                    </radio-card>
                  </section>
                </section>
               
              </a-tab-pane>
            </a-tabs>
            <!-- 选中后样式 -->
            <section class="flex" v-if="currentStep !== 0 && selectedProduct !== null">
              <radio-card class="active" :imgUrl="selectedProduct.imageUrl || ''">
                <p class="product-name" v-text="selectedProduct.name"></p>
              </radio-card>
            </section>
          </section>

        </a-step>
        <!-- /步骤一  请选择你想创建的产品 -->

        <!-- 步骤二  选择产品开发方案 -->
        <a-step disabled>
          <section slot="title" class="flex y-axis-center">
            <p class="step-title" v-text="selectedProject!==null? $t('create.product.project') : $t('create.product.select.project')"></p>
          </section>
          <section slot="description" class="description">
            <!-- 选中后样式 -->
            <section v-if="currentStep !== 0 && selectedProject !==null" class="flex">
              <radio-card class="project-card active" :imgUrl="selectedProject.imageUrl || ''">
                <section class="flex xy-axis-center">
                  <p class="project-name" v-text="selectedProject.name"></p>
                  <span class="tag">MCU</span>
                  <span class="tag">{{$t('create.product.module')}}</span>
                  <span class="tag">SDK</span>
                </section>
                <p class="details" v-text="$DictName('network_type',selectedProject.networkType)"></p>
                <p class="details" v-text="selectedProject.remark || ''"></p>
              </radio-card>
            </section>

          </section>
        </a-step>
        <!-- /步骤二  选择产品开发方案 -->

        <!-- 步骤三  完善产品信息 -->
        <a-step disabled>
          <section slot="title" class="flex y-axis-center">
            <p class="step-title">{{$t('create.product.step.title')}}</p>
          </section>
          <section v-if="currentStep === 2" slot="description"  class="form-description">
            <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{sm: {span: 3}, xxl:{span: 2}}" :wrapper-col="{ span: 8 }">
              <a-form-model-item :label="$t('create.product.label.name')" prop="name" >
                <a-input v-model="form.name" :placeholder="$t('create.product.placeholder.name')"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('create.product.label.model')" prop="model" >
                <a-input v-model="form.model"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('create.product.label.imageUrl')" prop="imageUrl"  :label-col="{sm: {span: 3}, xxl:{span: 2}}" :wrapper-col="{ span: 20 }">
                <input v-show="false" v-model="form.imageUrl">
                <upload-button 
                  accept="image/jpeg,image/png,image/x-ms-bmp"
                  :acceptList="['image/jpeg','image/png','image/x-ms-bmp']"
                  :limitSize="1"
                  limitRatio="1:1"
                  warningFileType="JPG,JPEG,PNG,BMP"
                  catalogName="product"
                  :fileUrl="form.imageUrl"
                  @uploaded="uploaded"
                >
                <p class="image-tips" slot="tipsDown">
                  {{$t('create.product.image.tips')}}
                </p>
                </upload-button>
              </a-form-model-item>
              <a-form-model-item :label="$t('create.product.label.networkType')" prop="networkType">
                <a-radio-group v-model="form.networkType" :options="$DictList('network_type')" />
              </a-form-model-item>
              <a-form-model-item :label="$t('create.product.label.powerConsumeType')" prop="powerConsumeType">
                <a-radio-group v-model="form.powerConsumeType" :options="$DictList('power_consume_type')" />
              </a-form-model-item>
              <a-form-model-item>
                <a-space :size="10">
                  <a-button type="primary" @click="handleSubmit" class="footer-btn">
                    {{$t('public.ok')}}
                  </a-button>
                  <a-button style="margin-left: 10px;" @click="cancel" class="footer-btn">
                    {{$t('public.cancel')}}
                  </a-button>
                </a-space>
              </a-form-model-item>
            </a-form-model>
          </section>
        </a-step>
        <!-- /步骤三  完善产品信息 -->
      </a-steps>
    </a-page-header>
  </section>
</template>
<script>
import RadioCard from "../components/RadioCard.vue"
import { getProductClassifyList, createProduct} from "@/api/product"
import { CommonNameRules } from '@/utils/validate'
import UploadButton from "@/components/uploadButton"

export default {
  name: "CreateProduct",
  components:{
    RadioCard,
    UploadButton
  },
  data() {
    return {
      productList:[],
      projectList:[],
      productTab:0,
      currentStep:0,
      selectedProduct:null,
      selectedProject:null,
      form: {},
      rules: {
        name: CommonNameRules(this.$t('create.product.rules.name'),50,1,blur),
        model:CommonNameRules(this.$t('create.product.rules.model'),50,1,blur),
        imageUrl: [{ required: true, message: this.$t('create.product.rules.imageUrl'), trigger: 'change' }],
        networkType: [{ required: true, message: this.$t('create.product.rules.networkType'), trigger: 'change' }],
        powerConsumeType: [{ required: true, message: this.$t('create.product.rules.powerConsumeType'), trigger: 'change' }],
      },
    }
  },
  async mounted(){
    await this.getProductClassifyList()
  },
  methods: {
    // 获取产品分类列表
    async getProductClassifyList() {
      const res = await getProductClassifyList()
      if(res.code !== 0) return
      this.productList = res.data?.list ?? []
    },

    // 确认提交
    handleSubmit() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        const params = {
          ...this.form,
          networkType:this.form.networkType,
          baseProductId:this.selectedProduct.id,
          schemeId:this.selectedProduct.id,
          productTypeId: this.selectedProduct.productTypeId,
         }
        const res = await createProduct(params)
        if(res.code !== 0 ) return
        this.resetForm()
        this.$router.push({path:"/product/product/setting/index",query:{productId:res.data,type:"dev"}})
      });
    },

    // 选中产品
    async handleSelectproduct(data){
      this.selectedProduct = data
      // 方案写固定的
      this.currentStep = 2
      this.selectedProject = data
      this.form['imageUrl'] = data.imageUrl
      this.$set(this.form, 'powerConsumeType',data.powerConsumeType)
      this.$set(this.form, 'networkType',data.networkType)
    },


    // 重新选择
    reselect(step){
      this.currentStep = step
      this.form = {}
      this.selectedProject = null
      if (step!== 0) return
      this.selectedProduct =null
    },

    resetForm(){
      this.selectedProduct =null
      this.selectedProject = null
      this.form = {}
    },

    //取消
    cancel(){
      this.resetForm()
      this.$router.push({path:'/product/product/index'})
      
    },

    // 图片上传
    uploaded(data){
      this.$set(this.form,'imageUrl',data.fullPath)
      this.form = this.$deepClone(this.form)
      this.$refs["ruleForm"].clearValidate('imageUrl');
    },

  }
}
</script>
<style lang="less" scoped>
@import "../../../../global.less";
@import "../../../../utils/utils.less";
// 页面布局
/deep/.ant-page-header{
    .ant-page-header-heading{
      border-bottom: 1px solid @aithings-border-color;
    }
    .ant-page-header-content{
      padding: 20px;
    }
  }
  .step-title{
    font-size: 16px;
    font-weight: 600;
    color: @aithings-text-color-gray;
    line-height: 22px;
  }
  /deep/ .ant-steps-small .ant-steps-item-icon{
    width: 23px;
    height: 23px;
    line-height: 23px;
  }
  /deep/ .ant-steps-item-finish{
    .ant-steps-item-icon>.ant-steps-icon{
      color: #fff;
    }
    .ant-steps-item-icon{
      background: @primary-color;
    }
  }
  /deep/ .ant-steps-item-finish,.ant-steps-item-active{
     .step-title{
      color: @aithings-text-color-black;
    }
  }
  /deep/ .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-tail::after,/deep/.ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-tail::after{
    background-color: @aithings-border-color;
  }
  /deep/ .ant-steps-item-wait .ant-steps-item-icon{
    border-color:@aithings-text-tips-color;
  }
  /deep/ .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon{
    color:@aithings-text-tips-color;
  }
  /deep/ .ant-steps-item-process .ant-steps-item-icon{
    background: @primary-color;
  }
  /deep/ .ant-steps-item-process .ant-steps-item-icon{
    border-color: @primary-color;
  }
  .category{
    font-weight: 600;
    color: @aithings-text-color-black;
    line-height: 20px;
  }
  .card{
    .product-name{
      min-width: 127px;
      color: @aithings-text-color-black;
    }
    .project-name{
      max-width: 127px;
      margin-right:5px;
      font-weight: 600;
      line-height: 20px;
      color: @aithings-text-color-black;
      .textOverflow();
    }
    .tag{
      padding: 2px 11px;
      margin-left:5px;
      border: 1px solid @primary-color;
      font-size: 10px;
      font-weight: 400;
      color: @primary-color;
      line-height: 14px;
      text-align: center;
      border-radius: 10px;
    }
    .details{
      margin-top: 5px;
      max-width: 230px;
      .textOverflow();
      color: @aithings-text-color-gray;
      line-height: 20px;
    }
  }

  .project-card{
    padding: 30px 30px 30px 5px;
  }
  /deep/.project-card .card-img-wrap {
    margin-right: 10px;
  }
  .form-description{
    margin-top: 25px;
  }
  .footer-btn{
    padding: 0 29px;
  }
  .ant-form{
    .ant-form();
    /deep/.ant-form-item label, /deep/.ant-radio-wrapper{
      color: @aithings-text-color-black;
    }
  }

  .image-tips{
    color: @aithings-text-tips-color;
  }
</style>