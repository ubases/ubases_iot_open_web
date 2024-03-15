<template>
  <section class="page-wrap no-padding" @click="showProductSearch=false">
    <a-page-header :title="$t('customizedApp.versionManage.title')" @back="backRouter">
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
              <version-list :os="tab.os" :appId="appId" :appName="appDetails.name"/>
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
import AppChange from '@/components/detailChange/AppChange.vue'
import versionList from '../components/versionList.vue'
import NoData from "@/components/NoData/index.vue"
import EditAppMsg from "../components/EditAppMsg.vue"
import { getAppDetail } from "@/api/appExploit"

export default {
  name: "VersionManage",
  components: {
    AppChange,
    NoData,
    versionList,
    EditAppMsg
  },
  data() {
    return {
      appId:"",
      version:'',
      tabsList:[
        { label: this.$t('customizedApp.versionManage.tab.label.ios'), os: 1},
        { label: this.$t('customizedApp.versionManage.tab.label.android1'), os: 2 },
        { label: this.$t('customizedApp.versionManage.tab.label.android2'), os: 3 },
      ],
      activeTab:1,
      appDetails:{},
      visible:false,
      form:{},
    };
  },
  async created(){
    this.appId = this.$route.query.appId ?? 0
    await this.getAppDetail()
  },
  methods: {
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


  },
};
</script>
<style lang="less" scoped>
@import "../../.././../global.less";
.page-wrap{
  box-shadow:none;
  height: 100%;
}

/deep/.ant-page-header{
  height: 100%;
  font-size: 12px;
  font-weight: 400;
  color: @aithings-text-color-gray;
  line-height: 17px;
}
/deep/.ant-page-header-heading{
  padding: 20px !important;
}
/deep/.ant-page-header-content{
  padding-top: 0;
  height: calc(100% - 72px);
}
/deep/.ant-tabs{
  height: 100%;
  .ant-tabs-nav .ant-tabs-tab{
    padding:5px 20px 15px !important;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
  }
  .ant-tabs-bar{
    margin: 0;
  }
  .ant-tabs-tabpane{
    padding: 20px;
  }

}

.content{
  height: calc(100% - 89px);
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

</style>
