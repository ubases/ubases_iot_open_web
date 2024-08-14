<template>
  <section class="page-wrap">
    <a-page-header :title="$t('oemAppDebug.title')" >
      <div class="table-msg">{{$t('oemAppDebug.list.details')}}</div>
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.appKey"
                  :placeholder="$t('oemAppDebug.placeholder.allApp')"
                  default-value=""
                  :options="appOptions"
                  :allowClear="true"
                  @keyup.enter.native="query"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.regionId"
                  optionFilterProp="label"
                  :placeholder="$t('oemAppDebug.placeholder.allRegion')"
                >
                  <a-select-option v-for="item in areaOptions" :value="item.value" :key="item.key" :label="item.key">
                    {{item.label}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input 
                  v-model="queryParam.query.userName" 
                  :placeholder="$t('oemAppDebug.placeholder.userName')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                 />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space :size="10">
                  <a-button type="primary" @click="query">
                    {{$t('public.search')}}
                  </a-button>
                  <a-button class="regular-button" @click="reset">
                    {{$t('public.reset')}}
                  </a-button>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- /筛选栏 -->

      <!-- 表格操作栏 -->
      <div class="table-operator">
        <a-button type="primary" class="grean-button" @click="addAppDebugger">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t('oemAppDebug.create.title')}}
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
        <template slot="appName" slot-scope="appName, record" >
           <section class="flex y-axis-center">
            <section  class="product-img-wrap flex xy-axis-center">
              <img :src="record.appImg" class="product-img"/>
            </section>
            <section>
              <a-space :size="5" direction="vertical">
                <p>{{record.appName}}</p>
              </a-space>
            </section>
           </section>
        </template>
        <template slot="status" slot-scope="status">
          {{$DictName('app_debugger_status',status)}}
        </template>
        <template  slot="createdAt" slot-scope="createdAt">
          {{ createdAt | momentFilter }}
        </template>
        <template v-slot:action="record">
          <a-button type="link" size="small" @click="deleteAppDebugger(record.id)">{{$t("public.delete")}}</a-button>
        </template>
      </a-table>
      <!-- /表格 -->

      <!-- 创建App弹窗 -->
      <creat-app-debug :visible="creatAppDebugVisible" :appOptions="appOptions" :areaOptions="areaOptions" @handleCancel="cancelAppDebug" @handleOk="okAppDebug"></creat-app-debug>
    </a-page-header>
  </section>
</template>
<script>
import { getAppDebuggerList, deleteAppDebugger, getAppRegionList} from "@/api/oemAppDebug"
import { getAppList } from "@/api/appExploit";
import CreatAppDebug from "./components/creatAppDebug.vue";
export default {
  name: "ProductList",
  components:{
    CreatAppDebug
  },
  data() {
    return {
      appOptions: [],
      areaOptions:[],
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total')+`:${total}` + this.$t('public.pagination.current') +`:${range[0]}-${range[1]}`,
      },
      // 查询参数
      queryParam: {
        query:{}
      },
      columns: [
        {
          dataIndex: "appName",
          title: this.$t('oemAppDebug.columns.appName'),
          scopedSlots: { customRender: "appName" },
        },
        {
          dataIndex: "appKey",
          title: this.$t('oemAppDebug.columns.appKey'),
        },
        {
          dataIndex: "userName",
          title: this.$t('oemAppDebug.columns.userName'),
        },
        {
          dataIndex: "userId",
          title: this.$t('oemAppDebug.columns.userId'),
          scopedSlots: { customRender: "userId" },
        },
        {
          dataIndex: "regionName",
          title: this.$t('oemAppDebug.columns.region'),
        },
        {
          dataIndex: "createdAt",
          title: this.$t('oemAppDebug.columns.createdAt'),
          scopedSlots: { customRender: "createdAt" },
        },
        {
          dataIndex: "status",
          title: this.$t('oemAppDebug.columns.status'),
          scopedSlots: { customRender: "status" },
        },
        {
          title: this.$t('public.action'),
          key: "action",
          align: "left",
          width: "160px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      creatAppDebugVisible:false,
    };
  },
  mounted() {
      this.getAppDebuggerList()
      this.getAppList()
      this.getAreaList()
  },
  methods: {
    // 获取区域列表
    async getAreaList(){
      const res = await getAppRegionList()
      if( res.code !== 0 ) return
      this.areaOptions = res.data.map(item=>{ return { value: `${item.id}`, label: item.describe } }) || []
    },
    // 获取产品分类列表
    async getAppList() {
      const res = await getAppList()
      if(res.code !== 0) return
      // 将返回字段处理成统一的名称
      this.appOptions = res.data?.list?.map(item=>{
        return { label: item.name, value: item.appKey } 
      })
    },
    // 获取App调试列表
    async getAppDebuggerList() {
      const res = await getAppDebuggerList({...this.queryParam,page:this.pagination.current,limit:this.pagination.pageSize})
      if(res.code !== 0)return
      this.dataSource = res.data?.list ?? []
      console.info(this.dataSource);
      this.pagination.total = res.data.total
    },

    // 查询
    query(){
      this.pagination.current = 1
      this.getAppDebuggerList()
    },

    // 重置
    reset() {
      this.pagination.current = 1
      this.queryParam = {query:{}}
      this.getAppDebuggerList()
    },

    // 新增产品
    addAppDebugger() {
      this.creatAppDebugVisible = true
    },

    // 删除产品
    deleteAppDebugger(id){
      this.$WarningModal(this, this.$t('oemAppDebug.delete')).then(async() => {
        const res = await deleteAppDebugger(id)
        if(res.code !== 0) return
        this.getAppDebuggerList()
      })
    },

    //关闭弹窗
    cancelAppDebug(){
      this.creatAppDebugVisible = false
    },
    okAppDebug(){
      this.getAppDebuggerList()
      this.creatAppDebugVisible = false
    },

    //翻页
    onChangePagination(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.getAppDebuggerList()
    },

  },
  
}
</script>
<style lang="less" scoped>
  @import "../../../global.less";
  .table-msg{
    padding-bottom: 12px;
    font-size: 16px;
    font-weight: 400;
    color: @aithings-text-color-gray;
    line-height: 17px;
  }

  .product-name{
    color: @primary-color;
    cursor: pointer;
  }
  .finished-status{
    color: @aithings-green-color;
  }
  .product-img-wrap{
    width: 64px;
    height: 64px;
    margin-right: 8px;
    .product-img{
      max-width: 64px;
      max-height: 64px;
      border-radius: 4px;
    }
  }
  .ant-btn-link,.ant-btn-link:active,.ant-btn-link:focus{
    border: 0;
  }

</style>
