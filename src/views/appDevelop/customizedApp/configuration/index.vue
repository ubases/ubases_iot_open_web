<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('customizedApp.config.title')" @back="backRouter">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <!-- app详情 -->
      <section class="details-wrap flex y-axis-center">
        <section class="image-wrap">
          <img :src="appDetails.appIconUrl" class="details-image"/>
        </section>
        <section class="app-details-content">
          <section class="flex y-axis-center name-wrap">
            <p v-text="appDetails.name" class="details-name"></p>
            <a-button v-if="appDetails.isDefault != 1" type="link" class="edit-app-name" @click="handleEditName">{{$t('customizedApp.config.edit.msg')}}</a-button>
          </section>
          <section class="flex y-axis-center x-space-between">
            <a-row :gutter="40" type="flex">
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
                APP key：{{appDetails.appKey}}
              </a-col>
            </a-row>
          </section>
        </section>
      </section>
      <!-- /app详情 -->

      <section class="content">
        <template v-if="tabsList">
          <a-tabs v-model="activeTab">
            <a-tab-pane v-for="(tab,index) in tabsList" :key="index+1" :tab="tab.label">
              <component 
                :is="tab.components"
                :appId="appId"
                :appKey="appDetails.appKey"
                :version="appDetails.version"
                :contentType="tab.contentType || 0"
              />
            </a-tab-pane>
          </a-tabs>
        </template>
      </section>
    </a-page-header>
    <!-- 修改app名称弹窗 -->
    <edit-app-msg :appId="appId" :visible="visible" :form="form" @sumitEditApp="sumitEditApp" @cancelEditApp="cancelEditApp"/>
    
  </section>
</template>
<script>
import DefaultRoom from "./components/DefaultRoom.vue"
import UserAgreement from "./components/UserAgreement.vue"
import EditAppMsg from "../components/EditAppMsg.vue"
import { getAppDetail } from "@/api/appExploit"


export default{

  components:{
    DefaultRoom,
    UserAgreement,
    EditAppMsg,
  },
  data (){
    return {
      appId:null,
      appDetails:{},
      activeTab:1,
      visible:false,
      form:{},
      tabsList:[
        { label: this.$t('oemApp.tab.UserAgreement.1'), components:"UserAgreement", contentType:1 },
        { label: this.$t('oemApp.tab.UserAgreement.2'), components:"UserAgreement", contentType:2 },
        { label: this.$t('oemApp.tab.UserAgreement.3'), components:"UserAgreement", contentType:3 },
        { label: this.$t('oemApp.tab.DefaultRoom'), components:"DefaultRoom" },
      ],
    }
  },
  watch:{
  },
  computed:{
  },
  async created(){
    this.appId = this.$route.query.appId ?? 0
    await this.getAppDetail()
  },
  mounted(){

  },
  methods:{
    // APP配置详情
    async getAppDetail(){
      const res = await getAppDetail({appId:this.appId})
      if(res.code !== 0) return
      this.appDetails = res.data
      
    },

    // 修改app名称
    handleEditName(){
      this.form = { name:this.appDetails.name, appIconUrl:this.appDetails.appIconUrl }
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

    // 返回
    backRouter(){
      this.$router.push({path:"/appDevelop/customizedApp/index"})
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
  margin-bottom: 20px;
  padding: 0 20px 20px;
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


</style>