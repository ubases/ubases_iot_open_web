<template>
  <section class="page-wrap no-padding" @click="showProductSearch=false">
    <a-page-header :title="$t('optionalConfig.title')">
      <template v-if="!noData">
        <app-change :param="{isDefault:2}" @dataChange="appChange" @isData="isData"/>
      </template>
      <section v-if="!noData" class="content">
        <template v-if="tabsList">
          <a-tabs v-model="activeTab">
            <a-tab-pane v-for="(tab,index) in tabsList" :key="index+1" :tab="tab.label">
              <component 
                :is="tab.components" 
                :appId="appId"
                :appKey="appKey"
                :appData="appData"
                :version="version"
                @updateAppData ="updateAppData"
                />
            </a-tab-pane>
          </a-tabs>
        </template>
      </section>
      <template v-if="noData">
        <no-data :text="$t('optionalConfig.noData.text')" :buttonText="$t('optionalConfig.noData.button')" path="/appDevelop/customizedApp/index"/>
      </template>
    </a-page-header>
  </section>
</template>
<script>
import AppChange from '@/components/detailChange/AppChange.vue'
import ThirdPartyService from './components/ThirdPartyService.vue'
import NoData from "@/components/NoData/index.vue"
import AutoUpgrade from "./components/AutoUpgrade.vue"

export default {
  name: "OptionalConfig",
  components: {
    AppChange,
    NoData,
    ThirdPartyService,
    AutoUpgrade
  },
  data() {
    return {
      appId:"",
      appKey:"",
      version:'',
      appData:{},
      tabsList:[
        { label: this.$t('optionalConfig.tab.label.ThirdPartyService'), components:"ThirdPartyService" },
        { label: this.$t('optionalConfig.tab.label.autoUpgrade'), components:"AutoUpgrade" },
      ],
      activeTab:1,
      noData: false
    };
  },

  methods: {
    // app切换
    appChange(data){
      this.appId = data.appId
      this.appKey = data.appKey
      this.version = data.version
      this.appData = {...data}
    },

    // 更新详情
    updateAppData(){
      this.$refs.appChange.getAppDetail(this.appId)
    },

    // 是否有产品
    isData(value){
      this.noData = !value
    },

  },
};
</script>
<style lang="less" scoped>
@import "../../../global.less";
.page-wrap{
  box-shadow:none;
  height: 100%;
}

/deep/.product-details{
  border-bottom: none;
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
    padding:0;
  }
  .ant-tabs-content{
    height: calc(100% - 41px);
  }
}

.content{
  height: calc(100% - 89px);
  overflow-y: auto;
}

</style>
