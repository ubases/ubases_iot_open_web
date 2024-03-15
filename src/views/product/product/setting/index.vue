<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="productDetails.name" :avatar="{ props: { src: productImg} }" @back="backRouter">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <template slot="subTitle">
        <span v-if="developState == 2" @click="editProduct">
          <icon-font type="icon-edit" :style="{ fontSize: '20px' }" />
        </span>
      </template>
      <section slot="extra" class="flex y-axis-center">
        <template v-if="developState == 2"> 
          <section class="develop-status flex y-axis-center">
            <span class="status-icon"></span>
            <p>{{$t('setting.developing')}}</p>
          </section>
          <a-button type="primary" @click="sumitFinish"> {{$t('setting.develop.finished')}}</a-button>
        </template>
        <template v-if="developState == 1">
          <section class="develop-status flex y-axis-center">
            <p class="back-tips">{{$t('setting.notEditMsg')}}</p>
            <a-button class="back-dev-btn" @click="backDevelop">{{$t('setting.back.develop')}}</a-button>
          </section>
        </template>
      </section>
      <div class="product-details">
        <a-descriptions size="small" :column="3">
          <a-descriptions-item :label="$t('setting.label.productTypeName')">
            {{productDetails.productTypeName}}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('setting.label.networkType')">
            {{$DictName('network_type',productDetails.networkType)}}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('setting.label.wifiFlag')">
            {{productDetails.wifiFlag}}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('setting.label.productKey')">
            {{productDetails.productKey}}
            <span class="copy-icon" v-clipboard:copy="productDetails.productKey" v-clipboard:success="onCopy">
              <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('setting.label.powerConsumeType')">
            {{$DictName('power_consume_type',productDetails.powerConsumeType)}}
          </a-descriptions-item>
        </a-descriptions>
        <span v-if="developState == 1" class="develop-finish-icon">
          <develop-finish-icon />
        </span>
        
      </div>
      <a-tabs v-model="activeTab">
        <a-tab-pane v-for="(tab,index) in tabsList" :key="index" :tab="tab.label">
          <component 
            :is="tab.components" 
            :status="developState" 
            :productId="productId" 
            :productTypeId="productTypeId" 
            :baseProductId="baseProductId" 
            :details="productDetails"
            :activeTab="activeTab"
            @refreshDetails ="getProductDetails"
            @changeTab="changeTab"
            />
        </a-tab-pane>
      </a-tabs>
    <finish-sumit :productId="productId" :data="productDetails" :visible="finishSumitVisible" @confirmFinished="confirmFinished" @cancelFinish="cancelFinish" @toSeting ="cancelFinish"/>
    <edit-product :visible="EditVisible" :form="productDetails" @confirmEdit="confirmEdit" @cancelEdit="cancelEdit" />
    </a-page-header>
  </section>
</template>
<script>
import FunctionDefinition from "./functionDefinition/index.vue"
import HardwareDevelop from "./hardwareDevelop/index.vue"
import Panels from "./panels/index.vue"
import BasicConfig from "./basicConfig/index.vue"
import FinishSumit from "../components/FinishSumit.vue"
import EditProduct from "../components/EditProduct.vue"
import TestService from "./testService/index.vue"
import VoiceControl from "./voiceControl/index.vue"
import { DevelopFinishIcon } from '@/core/icons'
import { getProductDetails, returnDevelop } from '@/api/product'
let tab = 0
export default{

  components:{
    FunctionDefinition,
    HardwareDevelop,
    Panels,
    BasicConfig,
    FinishSumit,
    EditProduct,
    TestService,
    DevelopFinishIcon,
    VoiceControl
  },
  data (){
    return {
      productDetails:{},
      developState:0,  // 1 开发完成  2 开发中
      finishSumitVisible:false,
      EditVisible:false,
      tabsList:[
        {
          label: this.$t('setting.tab.FunctionDefinition'),
          components:"FunctionDefinition"
        },
        {
          label: this.$t('setting.tab.HardwareDevelop'),
          components:"HardwareDevelop"
        },
        {
          label: this.$t('setting.tab.Panels'),
          components:"Panels"
        },
        {
          label: this.$t('setting.tab.BasicConfig'),
          components:"BasicConfig"
        },
        {
          label: this.$t('setting.voiceControl'),
          components:"VoiceControl"
        },
        {
          label: this.$t('setting.tab.TestService'),
          components:"TestService"
        }],
      productId: '',
      productTypeId:'',
      baseProductId:'',
      productImg:'',
      activeTab:0,
      tipsContent:<div style="text-align:left;"><p>返回开发状态可能造成产品信息的人为修改。</p><p>若产品已生产或出货到消费者，不建议返回。</p><p>返回后修改产品信息可能会导致设备功能异常，配网失败等问题，请谨慎操作!</p></div>
    }
  },
  watch:{
    activeTab(val){
      if(val == 2){
        this.getProductDetails()
      }
    }
  },

  async mounted(){
    this.productId = `${this.$route.query.productId}`
    this.activeTab = this.$route.params?.tab || tab || 0
    await this.getProductDetails()
  },
  methods:{
    // 获取产品详情
    async getProductDetails(){
      const res = await getProductDetails(this.productId)
      if(res.code !== 0) return
      this.productDetails = {...res.data} ?? {}
      this.productImg = this.productDetails.imageUrl ?? ''
      this.developState = res.data?.status || 0
      this.productTypeId = `${res.data.productTypeId}`
      this.productId = `${res.data.id}`
      this.baseProductId = `${res.data.baseProductId}`
    },

    // 点击开发完成
    sumitFinish() {
      this.finishSumitVisible = true
    },

    // 确认完成开发
    confirmFinished() {
      this.finishSumitVisible = false
      this.getProductDetails()
    },

    // 取消完成开发
    cancelFinish(code) {
      if(code) this.activeTab = code - 1
      this.finishSumitVisible = false
    },

    // 点击返回开发
    backDevelop() {
      this.$ConfirmModal(this, this.tipsContent,this.$t('setting.status.change'),this.$t('setting.sumit.back')).then(async() => {
        const res = await returnDevelop({id:this.productId})
        if(res.code !== 0) return
        this.$message.success(this.$t('public.action.succeed'))
        this.getProductDetails()
      })
    },

    // 点击编辑产品
    editProduct() {
      this.EditVisible = true
    },

    // 确认编辑完成
    confirmEdit() {
      this.EditVisible = false
      this.getProductDetails()
    },

    // 取消编辑完成
    cancelEdit() {
      this.EditVisible = false
    },

    // 复制ID成功
    onCopy() {
       this.$message.success(this.$t('public.copy.succeed'));
    },
    
    // 切换tab标签
    changeTab(index){
      this.activeTab = index
    },
    
    // 返回
    backRouter(){
      this.$router.push({path:"/product/product/index"})
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "StudioPanel") {
      tab= Number(from.params.tab || 2)
    }
    next();
  }
}
</script>
<style lang="less" scoped>
@import "../../../../global.less";
.page-wrap{
  height: 100%;
}
  /deep/.ant-page-header-heading{
    padding: 18px 20px 12px !important;
  }
  /deep/ .ant-page-header-content{
    position: relative;
    padding-top: 0;
    .develop-finish-icon{
      position: absolute;
      right: -15px;
      top: 0;
    }
  }
  /deep/.ant-avatar{
    width: 32px;
    height: 32px;
    padding: 1px;
    line-height: 30px;
    border-radius: 0;
    img{
      object-fit: unset;
      border-radius: 4px;
    }
  }
  .develop-status{
    margin-right: 16px;
    color: @aithings-text-color-gray;
    line-height: 20px;
    .status-icon{
      display: block;
      width: 8px;
      height: 8px;
      margin-right: 8px;
      border-radius: 50%;
      background: @primary-color;
      box-shadow: 0 0 2px 4px rgba(59, 124, 255, 0.2);
    }
    .back-dev-btn{
      width: 91px;
      border: 1px solid @aithings-text-tips-color;
      color: @aithings-text-tips-color;
    }
  }
  .back-tips{
    padding-right: 10px;
    color: @aithings-warning-color;
  }
  .product-details{
    padding: 0 0 20px 21px;
    max-width: 800px;
    font-size: 12px;
    color: @aithings-text-color-gray;
    line-height: 17px;
  }
  /deep/.ant-tabs-tabpane{
    padding: 0 20px 20px;
  }
  .copy-icon{
    margin-left: 3px;
  }

</style>