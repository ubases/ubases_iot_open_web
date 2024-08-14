<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('user.detail.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <div class="user-info">
          {{userInfo.appName}}  App  
          <a-divider type="vertical" />
          {{$t('user.detail.user.account')}} {{userInfo.userAccount}} {{$t('user.detail.user.now')}}{{userInfo.total}}{{$t('user.detail.device.number')}}
        </div>
        <a-table
          size="small"
          rowKey="deviceId"
          :data-source="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @change="onChangePagination"
        >
          <template slot="deviceName" slot-scope="text, record">
            <span class="device-name" @click="handleDetail(record)">{{record.deviceName}}</span>
          </template>
          <template slot="addMethod" slot-scope="text, record">
            {{$DictName('user_device_add_method',record.addMethod)}}
          </template>
        </a-table>
      </section>
    </a-page-header>
  </section>
</template>

<script>
import {getUserDeviceList } from '@/api/dataManage'

export default ({
  name:"UserDetails",
  data(){
    return {
      userInfo:{
        appName:'',
        userAccount:'',
        total: 0,
      },
      dataSource:[],
      loading:false,
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total') + `:${total} `+ this.$t('public.pagination.current') +`:${range[0]}-${range[1]}`,
      },
      columns: [
        {
          dataIndex: "deviceName",
          title: this.$t('user.detail.colunm.deviceName'),
          scopedSlots: { customRender: "deviceName" },
        },
        {
          dataIndex: "deviceId",
          title: this.$t('user.detail.colunm.devicePid'),
        },
        {
          dataIndex: "productName",
          title: this.$t('user.detail.colunm.productName'),
        },
         {
          dataIndex: "productTypeName",
          title: this.$t('user.detail.colunm.productTypeName'),
        },
        {
          dataIndex: "addMethod",
          title: this.$t('user.detail.colunm.addMethod'),
          scopedSlots: { customRender: "addMethod" },
        }
      ],
      queryParam:{
        page:1,
        limit:10
      }
    }
  },
  mounted(){
    this.userInfo = JSON.parse(this.$route.query.userInfo) || {}
    this.queryParam['customerUserId'] = this.userInfo.userId
    this.getUserInfo()
  },
  methods:{
    onChangePagination(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryParam.page = e.current
      this.queryParam.limit = e.pageSize
      this.getUserInfo()
    },

    async getUserInfo(){
      this.loading = true
      const res = await getUserDeviceList(this.queryParam)
      this.loading = false
      if( res.code !== 0) return
      this.dataSource = res.data.list
      this.pagination.total = res.data.total
      this.userInfo.total = res.data.total
    },
    handleDetail(data){
      this.$router.push({ path:'/product/device/details/index', query:{ did:data.deviceId, name:data.deviceName, productId:data.productId } })
    }

  }

})
</script>

<style lang="less" scoped>
  @import "../../../../global.less";
  /deep/.ant-page-header-heading{
    padding: 16px 20px !important;
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 10px 20px 20px;
  }
  .user-info{
    padding-bottom: 20px;
  }
  .device-name{
    color: @primary-color;
    text-decoration: underline;
    cursor: pointer;
  }
</style>