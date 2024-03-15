<template>
  <section class="page-wrap no-padding" @click="showProductSearch=false">
    <a-page-header :title="$t('multilingual.title')">
      <template v-if="!noData">
        <product-change @dataChange="productChange" @isData="isData"/>
      </template>
      <section v-if="!noData" class="content">
        <template v-if="tabsList">
          <a-tabs v-model="activeTab">
            <a-tab-pane v-for="(tab,index) in tabsList" :key="index+1" :tab="tab.label">
              <component 
                :is="tab.components" 
                :contentType="index+1"
                :productId="productId"
                :productKey="productKey"
                :productDetail="productDetail"
                />
            </a-tab-pane>
          </a-tabs>
        </template>
      </section>
      <template v-if="noData">
        <no-data :text="$t('multilingual.noData.text')" :buttonText="$t('multilingual.noData.buttonText')" path="/product/product/createProduct/index"/>
      </template>
    </a-page-header>
  </section>
</template>
<script>
import ProductChange from '@/components/detailChange/ProductChange.vue'
import productName from "./configuration/productName"
import productFunctions from "./configuration/productFunctions"
import networkScheme from "./configuration/networkScheme"
import panel from "./configuration/panel.vue"
import NoData from "@/components/NoData/index.vue"
export default {
  name: "multilingual",
  components: {
    ProductChange,
    productName,
    productFunctions,
    networkScheme,
    panel,
    NoData
  },
  data() {
    return {
      productId:"",
      tabsList:[
        { label:this.$t('multilingual.tabsList.tab1'), components:"productName"},
        { label:this.$t('multilingual.tabsList.tab2'), components:"productFunctions" },
        { label:this.$t('multilingual.tabsList.tab3'), components:"networkScheme" },
        { label:this.$t('multilingual.tabsList.tab4'), components:"panel" },
      ],
      activeTab:1,
      productKey:'',
      noData: false,
      productDetail:{}
    };
  },

  methods: {
    // 产品切换
    productChange(data){
      this.productId = data.id
      this.productKey = data.productKey
      this.productDetail = data
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
/deep/.ant-tabs-nav .ant-tabs-tab{
  padding:5px 20px 15px !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}
.ant-tabs-tabpane{
  padding:4px  20px 0;
}
.content{
  height: calc(100% - 89px);
}
/deep/.ant-tabs {
  height: 100%;
}
/deep/.ant-tabs-content{
  height: calc(100% - 57px);
}
/deep/.ant-tabs-tabpane{
  height: 100%;
  overflow-y: auto;
}

</style>
