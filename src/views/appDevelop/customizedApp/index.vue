<template>
  <section class="page-wrap">
    <a-page-header :title="$t('customizedApp.list.title')">
      <div class="table-msg">{{$t('customizedApp.list.details')}}</div>
        <!-- 表格操作栏 -->
        <div class="table-operator">
          <a-button type="primary" @click="handleAdd({},'add')" class="grean-button">
            <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
            {{$t('createOemApp.title')}}
          </a-button>
        </div>
        <!-- /表格操作栏 -->

        <!-- 表格 -->
        <a-table
          size="small"
          rowKey="id"
          :data-source="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @change="onChangePagination"
        >
          <template slot="status" slot-scope="status">
            <div :class="{'finished-status':status === 5}">{{$DictName('oem_app_status',status)}}</div>
          </template>
          <template slot="app" slot-scope="app, record" >
            <section class="flex y-axis-center">
              <section  class="product-img-wrap flex xy-axis-center">
                <img :src="record.appIconUrl || record.iocnUrl" class="product-img"/>
              </section>
              <section>
                <p class="product-name">{{record.name}}</p>
              </section>
            </section>
          </template>
          <template slot="iosVersion" slot-scope="iosVersion">
            {{ iosVersion || $t('public.not.available') }}
          </template>
          <template slot="androidInterVersion" slot-scope="androidInterVersion">
            {{ androidInterVersion || $t('public.not.available') }}
          </template>
          <template slot="androidOuterVersion" slot-scope="androidOuterVersion">
            {{ androidOuterVersion || $t('public.not.available') }}
          </template>
          <template slot="createdAt" slot-scope="createdAt">
            {{ createdAt | momentFilter }}
          </template>
          <template slot="updatedAt" slot-scope="updatedAt">
            {{ updatedAt | momentFilter }}
          </template>
          <template v-slot:action="record">
            <template v-if="record.isDefault != 1">
              <a-button type="link" size="small" @click="handleVersionManage(record)">
                {{ $t("customizedApp.list.column.action.versionManage") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click="handleLinkProducts(record)">
                {{ $t("oemApp.link.products") }}
              </a-button>
              <a-divider type="vertical"/>
              <a-button v-if="!record.iosVersion && !record.androidInterVersion && !record.androidOuterVersion" type="link" size="small" @click="deleteApp(record.id)">
                {{$t("public.delete")}}
              </a-button>
              <a-button  v-else type="link" size="small" @click="handleDetails(record)">
                {{ $t("public.allocation") }}
              </a-button>
            </template>
            <template v-if="record.isDefault == 1">
              <a-button type="link" size="small" @click="handleDetails(record)">
                {{ $t("public.allocation") }}
              </a-button>
            </template>
          </template>
        </a-table>
        <!-- 创建App弹窗 -->
      <creat-app :visible="creatAppVisible" @handleCancel="cancelApp" @handleOk="createdApp"></creat-app>
      <link-products :visible="linkProductsVisible" :appKey="linkAppData.appKey" :appName="linkAppData.name" :allProductList="allProductList" @handleCancel="cancelLink" @handleOk="updateLink"></link-products>
    </a-page-header>
  </section>
</template>
<script>
import { getAppList, deleteApp } from "@/api/appExploit";
import { getProductList } from "@/api/product"
import creatApp from './components/creatApp.vue'
import LinkProducts from '../OEMApp/components/linkProducts.vue'
export default {
  components: {
    creatApp,
    LinkProducts
  },
  data(){
    return {
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total')+`:${total}` + this.$t('public.pagination.current') +`:${range[0]}-${range[1]}`,
      },
      columns:[
        {
          title: "App",
          dataIndex: "app",
          scopedSlots: { customRender: "app" },
        },
        {
          title: "App Key",
          dataIndex: "appKey",
          width: "130px",
        },
        {
          title: this.$t('customizedApp.list.column.iosVersion'),
          dataIndex: "iosVersion",
          scopedSlots: { customRender: "iosVersion" },
          width: "120px",
        },
        {
          title: this.$t('customizedApp.list.column.androidVersion1'),
          dataIndex: "androidInterVersion",
          scopedSlots: { customRender: "androidInterVersion" },
          width: "120px",
        },
        {
          title: this.$t('customizedApp.list.column.androidVersion2'),
          dataIndex: "androidOuterVersion",
          scopedSlots: { customRender: "androidOuterVersion" },
          width: "120px",
        },
        {
          title: this.$t('oemApp.link.products'),
          dataIndex: "productListStr",
          width: "15%",
        },
        {
          title: this.$t('oemApp.column.createdAt'),
          dataIndex: "createdAt",
          scopedSlots: { customRender: "createdAt" },
        },
        {
          title: this.$t('oemApp.column.updatedAt'),
          dataIndex: "updatedAt",
          scopedSlots: { customRender: "updatedAt" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "260px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      creatAppVisible:false,
      logoUrl:require('../../../assets/image/logo_default.png'),
      allProductList:[],
      linkProductsVisible:false,
      linkAppData:{}
    }
  },
  async created () {
    await this.queryAppList()
    this.getProductList()
  },
  methods: {
    //获取App列表
    async queryAppList() {
      const res = await getAppList({pageNum:this.pagination.current, pageSize:this.pagination.pageSize, appDevType:2})
      if (res.code !== 0) return
      this.dataSource = res.data.list?.map(item => {
        return {
          ...item,
          productListStr: item.productList?.join('、') || ''
        }
      }) || []
      this.pagination.total = res.data.total
    },
    
    async getProductList() {
      const res = await getProductList({})
      if(res.code !== 0)return
      this.allProductList = res.data?.list?.map(item=>{
        return {
          key:item.productKey,
          id:item.id,
          name:item.name
        }
      }) || []
    },

    // 删除App
    deleteApp(id){
      this.$WarningModal(this, this.$t('oemApp.isDelete.app')).then(async() => {
        const res = await deleteApp({'appId':id})
        if(res.code !== 0) return
        this.queryAppList()
      })
    },

    //点击创建App弹窗，弹起弹窗
    handleAdd(){
      this.creatAppVisible = true
    },

    onChangePagination(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryAppList()
    },

    //关闭弹窗
    cancelApp(){
      this.creatAppVisible = false
    },

    // 创建App完成
    createdApp(){
      this.creatAppVisible = false
      this.queryAppList()
    },
    //点击配置查调整详情
    handleDetails(data){
      this.$router.push({path:"/appDevelop/customizedApp/configuration/index",query:{appId:data.id}})
    },

    // 点击版本管理
    handleVersionManage(data){
      this.$router.push({path:"/appDevelop/customizedApp/versionManage/index",query:{appId:data.id}})
    },

    // 点击关联产品
    handleLinkProducts(data){
      this.linkAppData = data
      this.linkProductsVisible = true
    },

    cancelLink(){
      this.linkProductsVisible = false
    },
    updateLink(){
      this.linkProductsVisible = false
      this.queryAppList()
    }

  },

}
</script>
<style lang="less" scoped>
@import "../../../global.less";
.page-wrap{
  box-shadow:none;
}
/deep/.ant-page-header{
  padding: 20px !important;
}
.finished-status{
  color: @aithings-green-color-38CB52;
}
.table-title{
  height: 22px;
  font-size: 16px;
  font-weight: 500;
  color: @aithings-text-color-black;
  line-height: 22px;
}
.table-msg{
  padding-top: 12px;
  font-size: 12px;
  font-weight: 400;
  color: @aithings-text-color-gray;
  line-height: 17px;
}
.table-operator{
  padding-top: 7px ;
}
.product-img-wrap{
  width: 48px;
  height: 48px;
  margin: 2px 10px 2px 2px ;
  .product-img{
    max-width: 48px;
    max-height: 48px;
    border-radius: 4px;
  }
}
</style>
