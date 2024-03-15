<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('device.log.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <h3>{{$t('device.log.basic.msg')}}</h3>
        <div>
          <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item :label="$t('device.log.deviceName')"> {{deviceName}} </a-form-item>
            <a-form-item :label="$t('device.log.deviceId')"> {{did}} </a-form-item>
          </a-form>
        </div>
        <h3>{{$t('device.log.title')}}</h3>
        <p class="wraning-text">{{$t('device.log.wraning.text')}}</p>
        <!-- 筛选栏 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="[10,10]">
              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-select
                    v-model="queryParam.query.eventType"
                    :placeholder="$t('device.log.query.event')"
                    default-value=""
                    :allowClear="true"
                    :options="$DictList('event_type')"
                    @keyup.enter.native="query"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-select
                    v-model="queryParam.query.eventKey"
                    :placeholder="$t('device.log.query.eventName')"
                    default-value=""
                    :allowClear="true"
                    @keyup.enter.native="query"
                  >
                    <a-select-option
                      v-for="v in eventList"
                      :key="v.identifier"
                      :value="v.identifier"
                    >
                      {{ v.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-select
                    v-model="queryParam.query.origin"
                    :placeholder="$t('device.log.query.source')"
                    default-value=""
                    :allowClear="true"
                    :options="$DictList('device_mode_type')"
                    @keyup.enter.native="query"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <div class="table-page-search-submitButtons">
                  <a-space :size="10">
                    <a-button type="primary" @click="query">
                      {{$t('public.search')}}
                    </a-button>
                    <a-button class="regular-button" @click="reset">
                      {{$t('public.reset')}}
                    </a-button>
                  </a-space>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- /筛选栏 -->
        <!-- 表格 -->
        <a-table
          size="small"
          :data-source="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @change="onChangePagination"
        >
          <template slot="createdAt" slot-scope="createdAt">
            {{ createdAt | momentFilter }}
          </template>
        </a-table>
      </section>
    </a-page-header>
  </section>
</template>
<script>
import { getLogList } from "@/api/device"
import { getDeviceLogEventList  } from "@/api/product"

export default {
  name: "DeviceLog",
  data() {
    return {
      did:0,
      deviceName:'',
      queryParam: {
        query:{}
      },
      dataSource: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      columns: [
        {
          title: this.$t('device.log.columns.sort'),
          customRender: (item,value,index) => index + 1
        },
        {
          dataIndex: "createdAt",
          title: this.$t('device.log.columns.createdAt'),
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          dataIndex: "eventTypeName",
          title: this.$t('device.log.columns.eventTypeName'),
        },
        {
          dataIndex: "funcKey",
          title: this.$t('device.log.columns.funcKey'),
          width: "25%",
        },
        {
          dataIndex: "funcName",
          title: this.$t('device.log.columns.funcName'),
          width: "25%",
        },
        {
          dataIndex: "originChannel",
          title: this.$t('device.log.columns.originChannel'),
        },
      ],
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total')+`:${total}` + this.$t('public.pagination.current') +`:${range[0]}-${range[1]}`,
      },
      loading: false,
      eventList:[], //设备事件列表
    };
  },
  async created() {
    this.did = this.$route.query.did
    this.deviceName =  this.$route.query.name
    await this.queryList()

    getDeviceLogEventList({
      productId: this.$route.query.productId,
      isCustom: -1,
    }).then((res) => {
      if (res.code === 0) {
        this.eventList = res.data.list;
      }
    });
  },

  methods: {

    async queryList() {
      this.loading = true;
      const param = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
        query:{
          did:this.did,
          ...this.queryParam.query
        }
      }
      const res = await getLogList(param)
      this.loading = false;
      if(res.code !== 0) return
      this.dataSource = res.data.list
      this.pagination.total = res.data.total
    },

    // 翻页
    onChangePagination(e){
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList()
    },

    // 查询
    query(){
      this.pagination.current = 1
      this.queryList()
    },

    // 重置
    reset() {
      this.pagination.current = 1
      this.queryParam = {query:{}}
      this.queryList()
    },
  },
};
</script>
<style lang="less" scoped>
 @import "../../../../global.less";
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 20px;
  }
  h3{
    color: @aithings-text-color-black;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }
  /deep/ .ant-form-item label{
    color: @aithings-text-color-gray;
  }
  /deep/ .ant-form-item-children{
    color: @aithings-text-color-black;
  }
  .wraning-text{
    padding: 15px 0;
    color:@aithings-warning-color;
  }
  .table-page-search-wrapper{
    margin-bottom: 20px;
  }
</style>
