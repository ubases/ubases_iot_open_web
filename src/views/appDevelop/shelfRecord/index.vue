<template>
  <section class="page-wrap no-padding" @click="showProductSearch=false">
    <a-page-header :title="$t('shelfRecord.title')">
      <template v-if="!noData">
        <app-change @dataChange="appChange" @isData="isData"/>
      </template>
      <section v-if="!noData && appId" class="content">
        <template v-if="tabsList">
          <a-tabs v-model="activeTab">
            <a-tab-pane v-for="(tab,index) in tabsList" :key="index+1" :tab="tab.label">
              <record
                :type="tab.type"
                :appId="appId"
                :appKey="appKey"
                :appName="appName"
                :version="version"
                />
            </a-tab-pane>
          </a-tabs>
        </template>
      </section>
      <template v-if="noData">
        <no-data :text="$t('optionalConfig.noData.text')" :buttonText="$t('optionalConfig.noData.button')" path="/appDevelop/OEMApp/index"/>
      </template>
    </a-page-header>
  </section>
</template>
<script>
import AppChange from '@/components/detailChange/AppChange.vue'
import NoData from "@/components/NoData/index.vue"
import Record from './components/Record.vue'

export default {
  name: "ShelfRecord",
  components: {
    AppChange,
    NoData,
    Record
  },
  data() {
    return {
      appId:"",
      appKey:"",
      appName: "",
      version:'',
      tabsList:[
        { label: this.$t('shelfRecord.tab1'), type:1},
        { label: this.$t('shelfRecord.tab2'), type:2 },
        { label: this.$t('shelfRecord.tab3'), type:3 },
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
      this.appName = data.name
      this.version = data.version
    },

    // 是否有产品
    isData(value){
      this.noData = !value
    }
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
