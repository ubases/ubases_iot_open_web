<template>
  <div class="product-details flex y-axis-center">
    <section class="image-wrap">
      <img :src="appDetails.iconUrl || logoUrl" class="product-image" />
    </section>
    <section class="details">
      <p v-text="appDetails.name" class="product-name"></p>
      <section>
        <a-row :gutter="40" type="flex">
          <a-col v-for="item in detailList" :key="item">
            {{detailOrigin[item]}}：{{appDetails[item]}}
          </a-col>
        </a-row>
      </section>
    </section>
    <section class="exchange-product-wrap">
      <a-button @click.stop="exchangeApp"><exchange-icon></exchange-icon>{{$t('appChange.change.app')}}</a-button>
      <a-select
        class="product-search"
        v-if="showAppSearch"
        defaultOpen
        show-search
        :placeholder="$t('appChange.placeholder.app.search')"
        @change="handleAppChange"
      >
        <a-select-option
          v-for="item in appList"
          :key="item.id"
          :value="item.name+'_'+item.id"
        >
          <section class="flex y-axis-center">
            <h4>{{ item.name }}</h4>
            <div class="app-status" style="margin-left:10px; height:22px; font-size: 14px; line-height:20px; padding: 0 10px; border: 1px solid #DAE6F8; border-radius:14px;">
              {{ $DictName("oem_app_status", item.status) }}
            </div>
          </section>
          <section class="flex y-axis-center app-details">
            <span>App Key: {{ item.appKey }}</span>
            <span style="margin-left:40px">{{$t('appChange.app.version')}}：{{ item.version }}</span>
          </section>
        </a-select-option>
      </a-select>
    </section>
  </div>
</template>

<script>
import { ExchangeIcon } from "@/core/icons";
import { getAppList, getAppDetail } from "@/api/appExploit";
export default {
  props:{
    status:{ type:Number, default: 0},
    detailList:{ type: Array, default: ()=>['iosPkgName','androidPkgName','channel','appKey']},
    param:{type:Object, default:()=>{}}
  },
  components: {
    ExchangeIcon,
  },
  data(){
    return {
      showAppSearch: false,
      appDetails:{},
      appList:[],
      logoUrl: require("../../assets/image/logo_default.png"),
      detailOrigin:{
        iosPkgName: this.$t('appChange.detailOrigin.iosPkgName'),
        androidPkgName: this.$t('appChange.detailOrigin.androidPkgName'),
        channel: this.$t('appChange.detailOrigin.channel'),
        version: this.$t('appChange.detailOrigin.version'),
        appKey: 'App key'
      }
    }
  },
  created() {
    this.getAppList()
  },
  methods:{
    // app信息列表
    async getAppList() {
      let params = { page: 0}
      if(this.status) params.status = this.status
      if(this.param){
        params = {...params, ...this.param}
      }
      const res = await getAppList(params)
       this.$emit('isData',res?.code == 0 && res.data?.list && res.data?.list?.length > 0)
      if (res.code !== 0) return;
      this.appList = res.data?.list || []
      const id = this.appList.length > 0 ? this.appList[0].id : ''
      if(id) this.getAppDetail(id)
    },

    // App详情
    async getAppDetail(id) {
      const res = await getAppDetail({ appId: id })
      if (res.code !== 0) return
      this.appDetails = res.data
      this.$emit('dataChange',this.appDetails)
    },

    // 点击切换app
    exchangeApp() {
      this.showAppSearch = !this.showAppSearch
    },

    // 切换app
    handleAppChange(val) {
      this.showAppSearch = !this.showAppSearch
      const id = val.split('_').pop()
      this.getAppDetail(id)
    },

  }
}
</script>

<style scoped lang="less">
@import "../../global.less";
.product-details {
  padding: 0 20px 25px;
  border-bottom: 1px solid #dae6f8;
  .image-wrap {
    margin-right: 10px;
    width: 64px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    .product-image {
      max-width: 64px;
      max-height: 64px;
      border-radius: 4px;
    }
  }
  .details {
    flex: 1;
  }

  .product-name {
    margin-bottom: 7px;
    height: 22px;
    font-size: 16px;
    color: @aithings-text-color-black;
    font-weight: 600;
    line-height: 22px;
  }
  /deep/.ant-btn {
    color: @primary-color;
    border: 1px solid @primary-color;
    svg {
      transform: translateY(3px);
      margin-right: 10px;
    }
  }
  .exchange-product-wrap {
    position: relative;
    .product-search {
      width: 500px;
      max-height: 400px;
      position: absolute;
      right: 0;
      bottom: -40px;
    }
  }
}
</style>