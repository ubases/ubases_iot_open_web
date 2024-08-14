<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('oemApp.list.title')" @back="backRouter">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
        <!-- app详情 -->
        <section class="details-wrap flex y-axis-center">
          <section class="image-wrap">
            <img :src="appDetails.iconUrl || logoUrl" class="details-image"/>
          </section>
          <section class="app-details-content">
            <section class="flex y-axis-center name-wrap">
              <p v-text="appDetails.name" class="details-name"></p>
              <div class="status">{{$DictName('oem_app_status', status)}}</div>
              <a-button type="link" :disabled="editDisabled" class="edit-app-name" @click="handleEditName">{{$t('oemApp.update.appName')}}</a-button>
            </section>
            <section class="flex y-axis-center x-space-between">
              <a-row :gutter="{ xs: 8, sm: 16, md: 20, xxl:40 }" type="flex">
                <a-col>
                  {{$t('oemApp.ios.package.name')}}：{{appDetails.iosPkgName}}
                </a-col>
                <a-col>
                  {{$t('oemApp.Android.package.name')}}：{{appDetails.androidPkgName}}
                </a-col>
                <a-col>
                  {{$t('oemApp.channel')}}：{{appDetails.channel}}
                </a-col>
                <a-col>
                  App Key：{{appDetails.appKey}}
                </a-col>
              </a-row>
              <a-row :gutter="{ xs: 8, sm: 16, md: 20, xxl:30 }" type="flex">
                <a-col>
                  {{$t('oemApp.version')}}：{{appDetails.version}}
                  <span v-if="allowUpdateVersion" class="change-template tap-pointer" @click="updateVersion">{{$t('oemApp.update.version')}}</span>
                </a-col>
                <a-col>
                  {{$t('oemApp.currentTemplate.version')}}：{{appDetails.appTemplateVersion}}
                  <span v-if="status == 1" class="change-template tap-pointer" @click="handleChangeTemp">{{$t('oemApp.changeTemplate.title')}}</span>
                </a-col>
              </a-row>
            </section>
          </section>
        </section>
        <!-- /app详情 -->

        <section :class="['content', {'no-tabs':activeStep == 4 || activeStep == 5}]">
          <section class="steps-bar">
            <steps :stepList="stepList" :activeStep="activeStep" @stepChange="stepChange"/>
          </section>
          <template v-if="tabsList[activeStep]">
            <a-tabs v-model="activeTab">
              <a-tab-pane v-for="(tab,index) in tabsList[activeStep]" :key="index+1" :tab="tab.label">
                <component 
                :is="tab.components" 
                :contentType="tab.contentType"
                :appId="appId"
                :editDisabled="editDisabled"
                :version="version"
                :logoUrl="appDetails.iconUrl"
                :appKey="appDetails.appKey"
                @updateDetails="getAppDetail"
                @changeTab="changeTab"
                />
              </a-tab-pane>
            </a-tabs>
          </template>
          <template v-if="activeStep == 4">
            <!-- 构建&测试 -->
            <build-test 
              :appId="appId" 
              :version="version"
              :editDisabled="editDisabled" 
              :status="status" 
              :tipsVisible="showBuildTips" 
              :appName="appDetails.name"
              @isToPublish="isToPublish"
              @cancelBuildTips="cancelBuildTips" 
              @sumitBuild="sumitBuild"
              @changeTab="changeTab"
              />
          </template>
          <template v-if="activeStep == 5">
            <on-store :appId="appId" :version="version" :status="status" :appName="appDetails.name"/>
          </template>
        </section>
        
    </a-page-header>
    <footer class="footer">
      <a-button v-if="activeStep !== 0 && stepList[activeStep-1].button[0]" @click="lastStep" class="last-button">{{stepList[activeStep-1].button[0]}}</a-button>
      <a-button v-if="activeStep !== 0 && stepList[activeStep-1].button[1]" type="primary" :disabled="nextStepDisabled" @click="nextStep">{{stepList[activeStep-1].button[1]}}</a-button>
    </footer>
    <!-- 修改app名称弹窗 -->
    <edit-app-name :appId="appId" :visible="visible" :form="form" @sumitEditApp="sumitEditApp" @cancelEditApp="cancelEditApp"/>
    <!-- 更新版本弹窗 -->
    <update-version :appId="appId" :visible="versionVisible" :version="version" :form="versionForm" @sumitVersion="sumitVersion" @cancelVersion="cancelVersion"/>
    <!-- 更换模板 -->
    <change-template :visible="templateVisible" :data="appDetails" @handleCancel="cancelChangeTemp" @handleSelect="sumitChangeTemp"/>
    
  </section>
</template>
<script>
import Steps from "@/components/Steps/index.vue"
import AppLogo from "./interfaceConfig/AppLogo.vue"
import IOSInit from "./interfaceConfig/IOSInit.vue"
import AndroidInit from "./interfaceConfig/AndroidInit.vue"
import ThemeColor from "./interfaceConfig/ThemeColor.vue"
import AppFooterBar from "./interfaceConfig/AppFooterBar.vue"
import Personalization from "./interfaceConfig/Personalization.vue"
import DefaultRoom from "./interfaceConfig/DefaultRoom.vue"
import ExpandFunction from "./functionConfig/ExpandFunction.vue"
import UserAgreement from "./releaseNecessary/UserAgreement.vue"
import IOSCertificate from "./releaseNecessary/IOSCertificate.vue"
import AndroidCertificate from "./releaseNecessary/AndroidCertificate.vue"
import Map from "./releaseNecessary/Map.vue"
import BuildTest from "./buildTest/index.vue"
import OnStore from "./onStore/index.vue"
import EditAppName from "./component/EditAppName.vue"
import UpdateVersion from "./component/UpdateVersion.vue"
import ChangeTemplate from "../components/ChangeTemplate.vue"
import { getAppDetail, changeCurrentStep, publishApp,getAppFunctionConfig,publishing } from "@/api/appExploit"


export default{

  components:{
    Steps,
    AppLogo,
    IOSInit,
    AndroidInit,
    ThemeColor,
    AppFooterBar,
    Personalization,
    DefaultRoom,
    ExpandFunction,
    UserAgreement,
    IOSCertificate,
    AndroidCertificate,
    Map,
    BuildTest,
    OnStore,
    EditAppName,
    UpdateVersion,
    ChangeTemplate
  },
  data (){
    return {
      stepList:[
        {name: this.$t('oemApp.step.interfaceConfiguration'), button:['', this.$t('oemApp.step.nextStep.functionalConfiguration')], disabled:false, tabsList:true},
        {name: this.$t('oemApp.step.functionalConfiguration'), button:[ this.$t('oemApp.step.lastStep.interfaceConfiguration'), this.$t('oemApp.step.nextStep.onEssential')], disabled:true, tabsList:true},
        {name: this.$t('oemApp.step.onEssential'), button:[this.$t('oemApp.step.lastStep.functionalConfiguration'), this.$t('oemApp.step.nextStep.buildAndTest')], disabled:true, tabsList:true},
        {name: this.$t('oemApp.step.buildAndTest'), button:[this.$t('oemApp.step.lastStep.onEssential'),this.$t('oemApp.step.nextStep.buildImmediately')], disabled:true, tabsList:false},
        {name: this.$t('oemApp.step.onTheManagement'), button:[this.$t('oemApp.step.lastStep.buildAndTest'), this.$t('oemApp.step.nextStep.sumitOnEssential')], disabled:true, tabsList:false},
      ],
      tabsList:{
        1:[
          { label: this.$t('oemApp.tab.AppLogo'), components:"AppLogo" },
          { label: this.$t('oemApp.tab.IOSInit'), components:"IOSInit" },
          { label: this.$t('oemApp.tab.AndroidInit'), components:"AndroidInit" },
          { label: this.$t('oemApp.tab.ThemeColor'), components:"ThemeColor" },
          { label: this.$t('oemApp.tab.AppFooterBar'), components:"AppFooterBar" },
          { label: this.$t('oemApp.tab.DefaultRoom'), components:"DefaultRoom" },
          { label: this.$t('oemApp.tab.Personalization'), components:"Personalization" }
        ],
        2:[
          { label: this.$t('oemApp.tab.ExpandFunction'), components:"ExpandFunction"},
        ],
        3:[]
      },
      releaseNeedTab:[
        { label: this.$t('oemApp.tab.UserAgreement.1'), components:"UserAgreement", contentType:1 },
        { label: this.$t('oemApp.tab.UserAgreement.2'), components:"UserAgreement", contentType:2 },
        { label: this.$t('oemApp.tab.IOSCertificate'), components:"IOSCertificate"},
        { label: this.$t('oemApp.tab.AndroidCertificate'), components:"AndroidCertificate"},
        
      ],
      appId:null,
      appDetails:{},
      status:0, // 1 配置中, 2 构建中, 3 构建完成, 4 上架中, 5 已上架
      activeStep: 0, // 目前在的步骤
      currentStep:1, // 用户配置到的步骤
      activeTab:1,
      visible:false,
      form:{},
      logoUrl:require('../../../../assets/image/logo_default.png'),
      showBuildTips:false,
      versionVisible:false,
      versionForm:{},
      version:'',
      templateVisible: false,
      isToPublishValue:false,
      turnSetTab:null  // 点击配置按钮跳转
    }
  },
  watch:{
    currentStep(step){
      this.stepList = this.stepList.map((item,index)=>{
        item.disabled = index+1 > step
        return item
      })
    },
    activeStep(step){
      if(step == 3){
        this.getExpandFunction()
      }
    },
    status(val){
      if(val == 5){
        // 上架完成不显示下一步按钮
        this.stepList[4].button = [this.$t('oemApp.step.lastStep.buildAndTest')]
      } else {
        this.stepList[4].button = [this.$t('oemApp.step.lastStep.buildAndTest'), this.$t('oemApp.step.nextStep.sumitOnEssential')]
      }
      if(val == 1){
        // 配置中
        this.stepList[3].button = [this.$t('oemApp.step.lastStep.onEssential'), this.$t('oemApp.step.nextStep.buildImmediately')]
      } else if(val == 2){
        // 构建中
        this.stepList[3].button = [this.$t('oemApp.step.lastStep.onEssential')]
      } else{
        // 构建完成
        this.stepList[3].button = [this.$t('oemApp.step.lastStep.onEssential'), this.$t('oemApp.step.nextStep.OnTheManagement')]
      }
    }
  },
  computed:{
    nextStepDisabled(){
      // 是否可点击下一步
      const isBuilding = (this.activeStep == 4 && this.status == 2)  // 构建中不可点击下一步
      const isToPublishing = (this.activeStep == 4 && this.status == 3 && !this.isToPublishValue)  // 没有构建成功的包不可点击上架管理
      const noLogoUrl = (this.activeStep == 1 && !this.appDetails.iconUrl)  // 无logourl不可点击下一步
      if(isBuilding || noLogoUrl || isToPublishing) return true
      return false
    },

    editDisabled(){
      // 是否禁止编辑
      if(this.status == 2 ||this.status == 4 || this.status == 5) return true // 构建中，上架中，上架完成不可编辑（仅限查看）
      return false
    },

    allowUpdateVersion(){
      // 是否允许更新版本
      return this.status == 4 || this.status == 5  // 可更新版本：上架中，上架完成
    }
  },
  async created(){
    this.appId = this.$route.query.appId ?? 0
    // await this.getAppTemplateDetail()
    await this.getAppDetail()
    // 初始页面时不同状态，显示不同配置页
    if (this.status == 2 || this.status == 3){
      this.activeStep = 4
    } else if (this.status == 4 || this.status == 5){
      this.activeStep = 5
    } else {
      this.activeStep = 1
    }
  },
  mounted(){

  },
  methods:{
    // App配置详情
    async getAppDetail(){
      const res = await getAppDetail({appId:this.appId})
      if(res.code !== 0) return
      // buildStatus 1 未构建, 2 构建中, 3 构建完成
      // status 1 配置中, 2 构建中, 3 构建完成, 4 上架中, 5 已上架
      this.appDetails = res.data
      this.status = this.appDetails.status
      this.version = this.appDetails.version
      this.currentStep = res.data.currentStep || 1
    },

    stepChange(step){
      this.activeStep = step
      this.activeTab = 1
    },

    // 上一步
    lastStep(){
      this.activeStep--
      this.activeTab = 1
    },

    // 点击下一步按钮
    async nextStep(){
      if(this.activeStep == 4 && this.status == 1){
        // 点击构建&测试--显示构建包弹窗
        this.showBuildTips = true
        return 
      } 
      // 确认上架弹窗
      if(this.activeStep == 5 && this.status == 4){
        this.$WarningModal(this, this.$t('oemApp.isSumitOnStore')).then(async() => {
          this.publishApp()
        })
        return
      }
      // 上架管理
      if(this.activeStep == 4 && this.status == 3){
          const res = await publishing({appId:this.appId, version:this.version})
          if (res.code !== 0) return
      }
      if(this.activeStep == this.currentStep) {
        // 请求跳转下一步
        const res = await changeCurrentStep({ appId:this.appId, currentStep: this.currentStep+1})
        if(res.code !== 0) return
        this.currentStep++
        await this.getAppDetail()
      }
      this.activeStep++
      this.activeTab = 1

    },

    // 获取拓展功能状态
    async getExpandFunction(){
      const res = await getAppFunctionConfig({appId:this.appId, version:this.version})
      if(res.code !== 0) return
      const data = res.data
      this.tabsList[3] = []
      if(data.aboutUs == 1) this.tabsList[3].push({ label: this.$t('oemApp.tab.UserAgreement.3'), components:"UserAgreement", contentType:3})
      
      this.tabsList[3] = [...this.tabsList[3],...this.releaseNeedTab]
      if(data.geo == 1) {
        this.tabsList[3] = [...this.tabsList[3],{ label: this.$t('oemApp.tab.Map'), components:"Map"}]
      }
      if(this.turnSetTab){
        this.activeTab = data.aboutUs == 1 ? this.turnSetTab + 1 : this.turnSetTab
        this.turnSetTab = null
      }
    },

    // 修改app名称
    handleEditName(){
      this.form = { name:this.appDetails.name, nameEn:this.appDetails.nameEn}
      this.visible = true
    },
    // 确定修改app名称
    sumitEditApp(){
      this.getAppDetail()
      this.visible = false
    },
    // 取消修改app名称
    cancelEditApp(){
      this.visible = false
    },

    // 点击更新版本按钮
    updateVersion(){
      this.versionForm = { version: this.appDetails.version}
      this.versionVisible = true
    },

    // 确认更新版本
    sumitVersion(){
      this.getAppDetail()
      this.versionVisible = false
      this.activeStep = 1
      this.activeTab = 1
    },

    // 取消更新版本
    cancelVersion(){
      this.versionVisible = false
    },

    // 点击更换模板
    handleChangeTemp(){
      this.templateVisible = true
    },

    // 取消更换模板
    cancelChangeTemp(){
      this.templateVisible = false
    },

    // 确认更换模板
    sumitChangeTemp(){
      this.templateVisible = false
      this.getAppDetail()
    },

    // 是否可点击上架管理
    isToPublish(value){
      this.isToPublishValue = value
    },
    // 上架App
    async publishApp(){
      const res = await publishApp({appId:this.appId, version:this.version})
      if (res.code !== 0) return
      this.getAppDetail()
    },

    // 取消构建app包
    cancelBuildTips(){
      this.showBuildTips = false
    },

    // 确认构建app包
    sumitBuild(){
      this.getAppDetail()
      this.showBuildTips = false
    },

    // 构建配置跳转
    async changeTab(item){
      if(item.activeStep>this.currentStep){
        // 请求跳转下一步
        const res = await changeCurrentStep({ appId:this.appId, currentStep: this.currentStep+1})
        if(res.code !== 0) return
        this.currentStep++
        await this.getAppDetail()
      }
      this.activeStep = item.activeStep
      this.turnSetTab = item.activeTab
    },
  
    // 返回
    backRouter(){
      this.$router.push({path:"/appDevelop/OEMApp/index"})
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../global.less";
.page-wrap{
  height: 100%;
  position: relative;
}
.ant-page-header{
  height: calc(100% - 60px);
  overflow-y: auto;
}

/deep/.ant-page-header-content{
  overflow:unset;
}
/deep/.ant-page-header-heading{
  padding: 20px !important;
}

.config-content{
  min-height: calc(100vh - 440px);
}
.page-content{
  height: 100%;
  overflow-y: auto;
}

.details-wrap{
  padding: 0 20px 30px;
  font-size: 12px;
  line-height: 17px;
  .image-wrap{
    width: 48px;
    height: 48px;
    margin-right: 10px;
    overflow: hidden;
    border-radius: 4px;
    .details-image{
      max-width: 48px;
      max-height: 48px;
    }
  }
  .app-details-content{
    flex:1;
  }
  .name-wrap{
    padding-bottom: 7px;
  }
  .details-name{
    color: @aithings-text-color-black;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
  }
  .status{
    margin-left: 10px;
    padding: 0 9px;
    height: 20px;
    border-radius: 11px;
    border: 1px solid @primary-color;
    font-size: 12px;
    line-height: 18px;
    color: @primary-color;
  }
  .edit-app-name{
    padding: 0 0 0 20px;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
  }
  .update-version{
    width: 91px;
    border-color: @primary-color;
    color: @primary-color;
  }
  .change-template{
    padding-left: 15px;
    color: @primary-color;
  }
}
.steps-bar{
  padding: 0 20px 18px;
}
.no-tabs{
  .steps-bar{
  padding: 0 20px;
}
}
/deep/.ant-tabs-bar{
  margin: 0;
}
/deep/ .ant-tabs-nav .ant-tabs-tab{
  padding: 12px 20px;
}
/deep/ .ant-tabs-nav-container{
  font-size: 16px;
}
.footer{
  position: absolute;
  bottom:0;
  left: 0;
  height: 60px;
  width: 100%;
  text-align: center;
  background: #FFFFFF;
  box-shadow: 0px -1px 14px 0px rgba(131, 146, 167, 0.16);
  border-radius: 0px 0px 4px 4px;
  line-height: 60px;
  .ant-btn + .ant-btn {
    margin-left: 20px;
  }
  .ant-btn-primary:disabled{
    background: @primary-color;
    color:#fff;
    opacity: 0.5;
  }
  .last-button{
    border: 1px solid @aithings-text-color-gray;
    color: @aithings-text-color-gray;
  }
}

</style>