<template>
  <section class="page-wrap no-padding" @click="showProductSearch=false">
    <a-page-header :title="$t('deviceDebugging.title')">
      <template v-if="!noData">
        <!-- 产品详情 -->
        <product-change :param="{enableCheck:true}" @dataChange="productChange" @isData="isData" :productId="productId"/>
        <!-- /产品详情 -->

        <!-- 真实设备调试 -->
        <section class="content">
          <!-- 表格操作栏 -->
          <div class="table-operator">
            <p class="operator-title">{{$t('deviceDebugging.realDevice.title')}}</p>
            <a-button type="primary" @click="exchangeCreateReal" class="grean-button">
              <icon-font type="icon-add" :style="{ fontSize: '18px' }" />{{$t('deviceDebugging.realDevice.addButton')}}
            </a-button>
          </div>

          <!-- 表格 -->
          <a-table
            size="small"
            rowKey="id"
            :data-source="dataSource"
            :columns="columns"
            :loading="loading"
            :pagination="false"
          >
            <template  slot="appName" slot-scope="text, record">
              {{record.appName}}&nbsp;&nbsp;{{record.userAccount}}
            </template>
            <template v-slot:action="item">
              <a-button type="link" size="small" @click="handleDetails(item, 1)">
                {{ $t("public.debug") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click="exchangeUpdateAccount(item)">
                {{item.userAccount? $t('public.change'):$t('public.add')}}{{$t('deviceDebugging.appAccount.button')}}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click="deleteDevice(item.id,1)">
                {{$t("public.delete")}}
              </a-button>
            </template>
          </a-table>
        </section>

        <!-- 虚拟设备调试 -->
        <section class="content" v-if="this.productDetails.isVirtualTest !== 0">
          <!-- 表格操作栏 -->
          <div class="table-operator">
            <p class="operator-title">{{$t('deviceDebugging.virtualDevice.title')}}</p>
            <a-button type="primary" @click="exchangeCreateVirtual" class="grean-button">
              <icon-font type="icon-add" :style="{ fontSize: '18px' }" />{{$t('deviceDebugging.virtualDevice.addButton')}}
            </a-button>
          </div>

          <!-- 表格 -->
          <a-table
            size="small"
            rowKey="id"
            :data-source="virtualDataSource"
            :columns="virtualColumns"
            :loading="virtualLoading"
            :pagination="false"
          >
            <template v-slot:action="item">
              <a-button type="link" size="small" @click="handleDetails(item,2)">
                {{ $t("public.debug") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click="deleteDevice(item.id,2)">
                {{$t("public.delete")}}
              </a-button>
            </template>
          </a-table>
        </section>
      </template>
      <template v-if="noData">
        <no-data :text="$t('deviceDebugging.noData.text')" :buttonText="$t('deviceDebugging.noData.button')" path="/product/product/createProduct/index"/>
      </template>
      <!-- 添加真实设备弹窗 -->
      <create-real-device :visible="addRealVisible" :productId="productId" :productKey="productDetails.productKey" @cancelCreate="exchangeCreateReal" @sumitCreate="sumitCreateReal"/>
      <!-- 添加虚拟设备弹窗 -->
      <create-virtual-device :visible="addVirtualVisible" :productId="productId" @cancelCreate="exchangeCreateVirtual" @sumitCreate="sumitCreateVirtual" />
      <!-- 添加/ 更改APP账号 -->
      <update-app-account :visible="updateAccountVisible" :productId="productId" :deviceId="appData.did" :form="appData" :actionType="appActionType" @cancelCreate="exchangeUpdateAccount" @sumitCreate="sumitUpdateAccount" />
    </a-page-header>
  </section>
</template>
<script>
import ProductChange from '@/components/detailChange/ProductChange.vue'
import CreateRealDevice from './component/CreateRealDevice.vue'
import CreateVirtualDevice from './component/CreateVirtualDevice.vue'
import UpdateAppAccount from './component/UpdateAppAccount.vue'
import { getTestDeviceList,deleteTestDevice } from '@/api/device'
import NoData from "@/components/NoData/index.vue"

export default {
  name: "deviceDebugging",
  components: {
    ProductChange,
    NoData,
    CreateRealDevice,
    CreateVirtualDevice,
    UpdateAppAccount
  },
  data() {
    return {
      noData:false,
      columns:[
        {
          title: this.$t('deviceDebugging.realDevice.columns.did'),
          dataIndex: "did",
          scopedSlots: { customRender: "did" },
        },
        {
          title: this.$t('deviceDebugging.realDevice.columns.userId'),
          dataIndex: "userId",
          scopedSlots: { customRender: "userId" },
        },
        {
          title: this.$t('deviceDebugging.realDevice.columns.appName'),
          dataIndex: "appName",
          scopedSlots: { customRender: "appName" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      productDetails:{},
      dataSource: [],
      loading: false,
      addRealVisible:false,
      virtualDataSource:[],
      virtualColumns:[
        {
          title: this.$t('deviceDebugging.virtualDevice.columns.did'),
          dataIndex: "did",
          scopedSlots: { customRender: "did" },
        },
        {
          title: this.$t('deviceDebugging.virtualDevice.columns.userId'),
          dataIndex: "userAccount",
          scopedSlots: { customRender: "userAccount" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      virtualLoading:false,
      addVirtualVisible:false,
      updateAccountVisible:false,
      appData:{},
      appActionType:'',
      productId:''
    };
  },
  created(){
    this.productId = this.$route.params.productId || ''
    if (!this.$route.meta.isBack) {
      // 初始化data的值
      Object.assign(this.$data, this.$options.data.call(this))
    }
  },
  beforeRouteEnter (to, from, next) {
    // 上次路由，设置isBack为 true 还是 false
    to.meta.isBack = from.path === '/product/deviceDebugging/debugDetails/index' || from.path === '/dashboard/index'
    next()
  },

  activated () {
    if (this.$route.meta.isBack) {
      this.$route.meta.isBack = false // 重置isBack
      if(!this.productId) return
      this.realList()
      this.virtualList()
    }
  },
  methods: {

    // 产品切换
    productChange(data){
      this.productDetails = data
      if(this.productId && this.productId == this.productDetails.id) return
      this.productId = this.productDetails.id
      this.realList()
      this.virtualList()
    },

    // 是否有产品
    isData(value){
      this.noData = !value
    },

    // 获取真实设备列表
    async realList() {
      const res = await getTestDeviceList({productId : this.productId})
      if (res.code !== 0) return
      this.dataSource = res.data.list
    },

    //  获取虚拟设备列表
    async virtualList(){
      const res = await getTestDeviceList({productId : this.productId, isVirtual:1})
      if (res.code !== 0) return
      this.virtualDataSource = res.data.list
    },

    // 删除设备
    deleteDevice(id,useType){
      this.$WarningModal(this, this.$t('deviceDebugging.delete.device')).then(async() => {
        const res = await deleteTestDevice({id,useType})
        if (res.code !== 0) return
        useType === 2 ? this.virtualList() : this.realList()
      })
    },

    // 设备调试
    handleDetails(item,type){
      const query = { 
        productKey : this.productDetails.productKey, 
        productId: this.productId, 
        did: item.did,
        type
      }
      this.$router.push({ path:"/product/deviceDebugging/debugDetails/index",query})
    },

    // 添加真实设备弹窗
    exchangeCreateReal(){
      this.addRealVisible = !this.addRealVisible
    },

    // 添加真实设备确定
    async sumitCreateReal(){
      this.addRealVisible = false
      this.realList()
    },

    // 添加虚拟设备弹窗
    exchangeCreateVirtual(){
      this.addVirtualVisible = !this.addVirtualVisible
    },

    // 添加虚拟设备确定
    async sumitCreateVirtual(){
      this.addVirtualVisible = false
      this.virtualList()
    },

    // 添加/更改APP账号弹窗
    exchangeUpdateAccount(item){
      if(item) {
        this.appData = {...item}
        this.appActionType = item.userAccount? 'edit':'add'
      }
      this.updateAccountVisible = !this.updateAccountVisible
    },

    // 确认添加/更改APP账号
    sumitUpdateAccount(){
      this.updateAccountVisible = false
      this.realList()
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../../global.less";
.page-wrap{
  box-shadow:none;
}
/deep/.ant-page-header{
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
}
.table-operator{
  margin: 0;
}
.operator-title{
  margin-bottom: 15px;
  height: 21px;
  font-size: 15px;
  font-weight: 600;
  color: @aithings-text-color-black;
  line-height: 21px;
}
.grean-button{
  margin-bottom: 16px;
}
.add-remind{
  color: @aithings-text-color-gray;
  padding-left: 90px;
}
.content{
  padding: 20px;
}

</style>
