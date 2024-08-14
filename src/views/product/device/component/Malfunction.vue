<template>
  <section class="content">
    <h3>{{$t('device.log.basic.msg')}}</h3>
    <div>
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item :label="$t('device.log.deviceName')"> {{deviceName}} </a-form-item>
        <a-form-item :label="$t('device.log.deviceId')"> {{did}} </a-form-item>
      </a-form>
    </div>
    <h3>{{$t('device.malfunction.title')}}</h3>
    <p class="wraning-text">{{$t('device.malfunction.wraning.text')}}</p>
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="4" :sm="24" >
            <a-form-item>
              <a-input 
                v-model="queryParam.searchKey" 
                :placeholder="$t('device.malfunction.query.desc')" 
                :allowClear="true"
                @keyup.enter.native="query"
              />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select
                v-model="queryParam.query.faultCode"
                :placeholder="$t('device.malfunction.query.errorCode')"
                default-value=""
                :options="codeList"
                :allowClear="true"
                @keyup.enter.native="query"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select
                v-model="queryParam.query.uploadFrom"
                :placeholder="$t('device.malfunction.query.reportFrom')"
                default-value=""
                :options="$DictList('device_fault_from')"
                :allowClear="true"
                @keyup.enter.native="query"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select
                v-model="queryParam.query.uploadMethod"
                :placeholder="$t('device.malfunction.query.reportType')"
                default-value=""
                :options="$DictList('device_fault_from_type')"
                :allowClear="true"
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
      <template slot="failTime" slot-scope="failTime">
        {{ failTime | momentFilter }}
      </template>
    </a-table>
  </section>
</template>
<script>
import { getFailLogList } from "@/api/device"

export default {
  name: "Malfunction",
  props:{
    did:{ type:String, default:''},
    deviceName:{ type:String, default:''},
    activeTab:{ type:String, default:''},
   },
  data() {
    return {
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
          dataIndex: "failTime",
          title: this.$t('device.malfunction.columns.createdAt'),
          scopedSlots: { customRender: 'failTime' }
        },
        {
          dataIndex: "code",
          title: this.$t('device.malfunction.columns.code'),
        },
        {
          dataIndex: "desc",
          title: this.$t('device.malfunction.columns.desc'),
          width: '20%'
        },
        {
          dataIndex: "uploadFrom",
          title: this.$t('device.malfunction.columns.from'),
        },
        {
          dataIndex: "uploadMethod",
          title: this.$t('device.malfunction.columns.type'),
        },
        {
          dataIndex: "content",
          title: this.$t('device.malfunction.columns.parameter'),
          width: '20%'
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
      codeList:[]
    };
  },
  async created() {
    await this.queryList()
    this.codeList = this.$DictList('error_code').map(item=>{
      return {
        label: `${item.value} - ${item.label}`,
        value: item.value
      }
    })
  },
  watch:{
    activeTab(val){
      if(val == '3'){
        this.queryList()
      }
    }
  },

  methods: {
    async queryList() {
      this.loading = true;
      const param = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
        searchKey: this.queryParam.searchKey,
        query:{
          did:this.did,
          ...this.queryParam.query
        }
      }
      const res = await getFailLogList(param)
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

  .content{
    padding: 0 20px 20px;
  }
  h3{
    color: @aithings-text-color-black;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }
  /deep/.ant-form-item{
    margin-bottom: 0;
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
