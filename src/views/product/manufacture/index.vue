<template>
  <section class="page-wrap">
    <a-page-header :title="$t('manufacture.title')" >
      <!-- 筛选栏 -->
      <section class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input 
                  v-model="queryParam.searchKey" 
                  :placeholder="$t('manufacture.placeholder.searchKey')" 
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input 
                  v-model="queryParam.query.batch" 
                  :placeholder="$t('manufacture.placeholder.batchId')" 
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            
            <a-col :md="3" :sm="24">
              <a-form-item>
                <a-select  
                  v-model="queryParam.query.exportCount"  
                  :placeholder="$t('manufacture.placeholder.exportTimes')"  
                  :options="$DictList('device_export_count')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="24">
              <a-form-item>
                <a-select  
                  v-model="queryParam.query.isActive"  
                  :placeholder="$t('manufacture.placeholder.isActive')"  
                  :options="$DictList('active_status')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                 />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="$t('manufacture.placeholder.createTime')" :colon="false">
                <a-range-picker v-model="queryParam.aliveTime" separator="—" @change="handleChangeDate" @keyup.enter.native="query">
                  <icon-font slot="suffixIcon" type="icon-date" :style="{ fontSize: '23px' }" />
                </a-range-picker>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space :size="10">
                  <a-button type="primary" @click="query"> {{$t('public.search')}} </a-button>
                  <a-button class="regular-button" @click="resetParam"> {{$t('public.reset')}} </a-button>
                  
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </section>

      <!-- 表格操作栏 -->
      <section class="table-operator flex y-axis-center x-space-between">
        <section class="flex">
          <a-button class="grean-button" @click="handleTriplesVisiable"> <icon-font type="icon-add" :style="{ fontSize: '18px' }" />{{$t('manufacture.button.addTriple')}}</a-button>
          <a-button class="green-border-button " @click="exportTriple"><export-green-icon />{{$t('manufacture.button.exportTriple')}}</a-button>
        </section>
        
        <section class="device-count">
          <span>{{$t('manufacture.count.deviceTotal')}}：{{countData.deviceTotal || 0}}</span>
          <span>{{$t('manufacture.count.activeTotal')}}：{{countData.activeTotal || 0}}</span>
        </section>
        
      </section>

      <!-- 表格 -->
      <a-table
        size="small"
        rowKey="did"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @change="onChangePagination"
      >
        <template v-slot:did="record">
          <p v-text="record.deviceName"></p>
          <p v-text="record.did"></p>
        </template>
        <template  slot="activeStatus" slot-scope="text, record">
          {{$DictName('active_status',record.activeStatus)}}
        </template>
        <template  slot="productName" slot-scope="text, record">
          <p v-text="record.productName"></p>
          <p v-text="record.productKey"></p>
        </template>
        <template slot="createdAt" slot-scope="text, record">
          <span> {{record.createdAt | momentFilter}}</span>
        </template>
        <template v-slot:action="record">
          <a-button
            type="link"
            size="small"
            @click="handleDetail(record)"
          >
            {{$t('public.detail.text')}}
          </a-button>
        </template>
      </a-table>

      <!-- 生成三元组 -->
      <generat-triple :visible="visible" @handleCancel ="handleTriplesVisiable" @handleOk="handleOk" />

      <!-- 导出三元组 -->
      <export-triple :visible="exportTripleVisible" @handleClose ="exportTriple" />

      <!-- 详情 -->
      <manufacture-detail :visible="detailVisible" :data="detailData" @handleClose ="detailVisible = false" />
    </a-page-header>
  </section>
</template>
<script>
import { getManufactureList, getDeviceCount } from "@/api/device";
import { DateIcon, ExportGreenIcon} from '@/core/icons'
import GeneratTriple from "./component/GeneratTriple.vue"
import ExportTriple from "./component/ExportTriple.vue"
import ManufactureDetail from "./component/detail.vue"

export default {
  name: "Manufacture",
  data() {
    return {
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total')+`:${total}` + this.$t('public.pagination.current') +`:${range[0]}-${range[1]}`,
      },
      // 查询参数
      queryParam: {
        page: 1,
        limit: 10,
        query:{}
      },
      columns: [
        {
          title: this.$t('manufacture.columns.did'),
          key: "did",
          scopedSlots: { customRender: "did" },
        },
        {
          dataIndex: "userName",
          title: this.$t('manufacture.columns.username'),
        },
        {
          dataIndex: "passward",
          title: this.$t('manufacture.columns.password'),
        },
        {
          dataIndex: "sn",
          title: this.$t('manufacture.columns.sn'),
        },
        {
          dataIndex: "batchId",
          title: this.$t('manufacture.columns.batchId'),
        },
        {
          dataIndex: "productName",
          title: this.$t('manufacture.columns.productName'),
          scopedSlots: { customRender: "productName" },
        },
        {
          dataIndex: "activeStatus",  // 0:未激活 1：已激活
          title: this.$t('manufacture.columns.isActived'),
          scopedSlots: { customRender: "activeStatus" },
        },
        {
          dataIndex: "exportCount",
          title: this.$t('manufacture.columns.exportTimes'),
        },
        {
          dataIndex: "createdAt",
          title: this.$t('manufacture.columns.createTime'),
          scopedSlots: { customRender: "createdAt" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "left",
          width: "220px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      visible: false,
      loading: false,
      exportTripleVisible:false,
      detailVisible: false,
      countData:{},
      detailData:{}
    };
  },
  components:{
    DateIcon,
    GeneratTriple,
    ExportGreenIcon,
    ExportTriple,
    ManufactureDetail
  },
  created() {
      this.queryList()
  },

  methods: {
    // 设备数据列表
    async queryList() {
      this.loading = true;
      const { page, limit, query, searchKey=''} = {...this.queryParam}
      const res = await getManufactureList({ page, limit, query, searchKey})
      this.loading = false;
      if (res.code !== 0) return
      this.dataSource = res.data.list;
      this.pagination.total = res.data.total
      this.getDeviceCount()
    },

    async getDeviceCount(){
      const {query, searchKey=''} = {...this.queryParam}
      const res = await getDeviceCount({query,searchKey})
      if (res.code !== 0) return
      this.countData = res.data
    },

    query(){
      this.queryParam.page = 1
      this.pagination.current = 1
      this.queryList()
    },

    // 重置
    resetParam(){
      this.pagination.current = 1
      this.queryParam = {page:1, limit:this.queryParam.limit,query:{}}
      this.queryList()
    },

    // 翻页
    onChangePagination(e){
      this.queryParam.page = e.current
      this.queryParam.limit = e.pageSize
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryList()
    },

    // 激活时间筛选项更新
    handleChangeDate(val){
      if(val && val.length>0){
        this.queryParam.query['startTime'] = this.$TransformTimestamp(val[0])
        this.queryParam.query['endTime'] = this.$TransformTimestamp(val[1])
      } else{
         this.queryParam.query['startTime'] = ''
        this.queryParam.query['endTime'] = ''
      }
    },

    // 生成三元组弹窗开启/关闭
    handleTriplesVisiable() {
      this.visible = !this.visible
    },

    // 导出三元组弹窗开启/关闭
    exportTriple(){
      this.exportTripleVisible = !this.exportTripleVisible
    },

    // 三元组确认提交
    handleOk() {
      this.visible = false;
      this.queryList()
    },
  
    // 查看详情
    handleDetail(data){
      this.detailData =data
      this.detailVisible = true
    }
  },
};
</script>
<style lang="less" scoped>
  @import "../../../global.less";
  /deep/ .table-page-search-wrapper{
    .ant-form-inline .ant-form-item > .ant-form-item-label{
      padding-right: 0;
      border-radius: 4px 0 0 4px;
      border: 1px solid @aithings-text-tips-color;
      border-right: 0;
    }
    .ant-form-item-label > label{
      color: @aithings-text-color-black;
    }
  } 
  .device-count{
    span + span {
      padding-left: 50px;
    }
  }
  .warning-text{
    padding-bottom: 20px;
    color: @aithings-warning-color;
  }

</style>
