<template>
  <section class="page-wrap">
    <a-page-header :title="$t('device.title')" >
      <!-- 筛选栏 -->
      <section class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="5" :sm="24">
              <a-form-item>
                <a-input 
                  v-model="queryParam.searchKey" 
                  :placeholder="$t('device.placeholder.searchKey')" 
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="24">
              <a-form-item>
                <a-select  
                  v-model="queryParam.query.isActive"  
                  :placeholder="$t('device.placeholder.isActive')"  
                  :options="$DictList('active_status')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                 />
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="24">
              <a-form-item>
                <a-select  
                  v-model="queryParam.query.isOnline"  
                  :placeholder="$t('device.placeholder.isOnline')"  
                  :options="$DictList('online_status')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="24">
              <a-form-item>
                <a-select  
                  v-model="queryParam.query.deviceNature"  
                  :placeholder="$t('device.placeholder.deviceNature')"  
                  :options="$DictList('device_nature')" 
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="11" :sm="24">
              <a-form-item :label="$t('device.placeholder.aliveTime')" :colon="false">
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
          <a-button class="green-border-button " @click="handleExportVisible"><export-green-icon />{{$t('device.button.exportData')}}</a-button>
          
        </section>
        
        <section class="device-count">
          <span>{{$t('device.count.deviceTotal')}}：{{countData.deviceTotal || 0}}</span>
          <span>{{$t('device.count.activeTotal')}}：{{countData.activeTotal || 0}}</span>
          <span>{{$t('device.count.onlineTotal')}}：{{countData.onlineTotal || 0}}</span>
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
        <template  slot="onlineStatus" slot-scope="text, record">
          {{$DictName('online_status',record.onlineStatus)}}
        </template>
        <template  slot="productName" slot-scope="text, record">
          <p v-text="record.productName"></p>
          <p v-text="record.productKey"></p>
        </template>
        <template slot="activatedTime" slot-scope="text, record">
          <span v-if="!record.activatedTime || record.activatedTime== 0">{{$t('public.not.available')}}</span>
          <span v-else> {{record.activatedTime | momentFilter}}</span>
        </template>
        <template v-slot:action="record">
          <a-button
            type="link"
            size="small"
            @click="goDetail(record,1)"
          >
            {{$t('public.detail.text')}}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="link"
            size="small"
            @click="goDetail(record,2)"
          >
            {{$t('device.button.log')}}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="link"
            size="small"
            @click="goDetail(record,3)"
          >
            {{$t('device.btn.malfunction')}}
          </a-button>
        </template>
      </a-table>

      <!-- 设备数据导出弹窗 -->
      <export-data :visible="exportVisible" @handleClose ="handleExportVisible" />
    </a-page-header>
  </section>
</template>
<script>
import { getDeviceList, getDeviceCount } from "@/api/device";
import { DateIcon, ExportGreenIcon} from '@/core/icons'
import ExportData from "./component/ExportData.vue"

export default {
  name: "Device",
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
          title: this.$t('device.columns.did'),
          key: "did",
          scopedSlots: { customRender: "did" },
        },
        {
          dataIndex: "activeStatus",  // 0:未激活 1：已激活
          title: this.$t('device.columns.activeStatus'),
          scopedSlots: { customRender: "activeStatus" },
        },
        {
          dataIndex: "onlineStatus",  // 1:在线  0:离线
          title: this.$t('device.columns.onlineStatus'),
          scopedSlots: { customRender: "onlineStatus" },
        },
        {
          dataIndex: "productName",
          title: this.$t('device.columns.productName'),
          scopedSlots: { customRender: "productName" },
        },
        {
          dataIndex: "deviceNature",
          title: this.$t('device.columns.deviceNature'),
        },
        {
          dataIndex: "sn",
          title: this.$t('device.columns.sn'),
        },
        {
          dataIndex: "activatedTime",
          title: this.$t('device.columns.activatedTime'),
          scopedSlots: { customRender: "activatedTime" },
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
      loading: false,
      exportVisible:false,
      countData:{}
    };
  },
  components:{
    DateIcon,
    ExportData,
    ExportGreenIcon,
  },
  created() {
    if (this.$route.meta.isBack) {
      const query = getPageQuery(this.$route)
      if(query){
        this.$set(this,'queryParam', query.queryParam )
      }
    }
    this.queryList()
  },

  methods: {
    // 设备数据列表
    async queryList() {
      this.loading = true;
      const { page, limit, query, searchKey=''} = {...this.queryParam}
      const res = await getDeviceList({ page, limit, query, searchKey})
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
  
    // 导出数据弹窗开启/关闭
    handleExportVisible(){
      this.exportVisible = !this.exportVisible
    },

    goDetail(record,tab){
      this.$router.push({ path:'/product/device/details/index', query:{did:record.did, name:record.deviceName, productId: record.productId,tab} })
    }

  },

  beforeRouteEnter (to, from, next) {
    to.meta.isBack = from.path === '/product/device/details/index'
    next()
  },
  
  beforeRouteLeave(to, from, next) {
    Storage.set("pageQuery", {[from.name]:{queryParam:this.queryParam}})
    next();
  }
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
