<template>
  <section class="page-wrap">
    <a-page-header :title="$t('after.sales.service.title')" >
    
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.appKey"
                  :placeholder="$t('after.sales.service.placeholder.appKey')"
                  :options="appOptions"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.typeId"
                  :placeholder="$t('after.sales.service.placeholder.typeId')"
                  :options="$DictList('feedback_question_type')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.productKey"
                  :placeholder="$t('after.sales.service.placeholder.productKey')"
                  :options="productOptions"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.status"
                  :placeholder="$t('after.sales.service.placeholder.status')"
                  :options="$DictList('feedback_status')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.timeQueryMode"
                  :placeholder="$t('after.sales.service.placeholder.timeQueryMode')"
                  :options="$DictList('time_query_mode')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space :size="10">
                  <a-button type="primary" @click="query">{{$t("public.query")}}</a-button>
                  <a-button class="regular-button" @click="reset">{{$t("public.reset")}}</a-button>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

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
        <template  slot="createdAt" slot-scope="text, record">
          {{ record.createdAt | momentFilter }}
        </template>
        <template slot="status" slot-scope="text, record">
          <span :class="['status tap-pointer',{finish:record.status==2}]">{{$DictName('feedback_status',record.status)}}</span>
        </template>
        <template v-slot:action="item">
          <a-button type="link" size="small" @click="checkDetails(item)">
            {{item.status == 1 ? $t('after.sales.service.reply') : $t('public.view')}}
          </a-button>
        </template>
      </a-table>
     
    </a-page-header>
  </section>
</template>
<script>
import { getAppList } from '@/api/appExploit'
import { getProductList} from "@/api/product"
import { getFeedbackList} from "@/api/userFeedback"

export default {
  name: "UserFeedback",
  components: {
  },
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
      queryParam: {page:1,limit:10,query:{}},
      columns: [
        {
          dataIndex: "appName",
          title: this.$t('after.sales.service.columns.appName'),
        },
        {
          dataIndex: "typeName",
          title: this.$t('after.sales.service.columns.typeName'),
        },
         {
          dataIndex: "content",
          title: this.$t('after.sales.service.columns.content'),
          width: "40%",
        },
        {
          dataIndex: "productName",
          title: this.$t('after.sales.service.columns.productName'),
        },
        {
          dataIndex: "createdAt",
          title: this.$t('after.sales.service.columns.createdAt'),
          scopedSlots: { customRender: "createdAt" },
        },
        {
          dataIndex: "status",
          title: this.$t('after.sales.service.columns.status'),
          scopedSlots: { customRender: "status" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "180px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      addVisiable:false,
      appOptions:[],
      productOptions:[]
    };
  },
  created() {
    if (!this.$route.meta.isBack) {
      // 初始化data的值
      Object.assign(this.$data, this.$options.data.call(this))
      this.queryList()
      this.getAppList()
      this.getProductList()
    }
  },
  beforeRouteEnter (to, from, next) {
    // 上次路由，设置isBack为 true 还是 false
    to.meta.isBack = from.path === '/marketing/afterSalesService/userFeedback/details/index' || from.path === '/dashboard/index'
    next()
  },

  activated () {
    if (this.$route.meta.isBack) {
      this.$route.meta.isBack = false // 重置isBack
      this.queryList()
    }
  },
  methods: {
    onChangePagination(e) {
      this.pagination.current = e.current
      this.queryParam.page = e.current
      this.queryParam.limit = e.pageSize
      this.queryList()
    },

    query() {
      this.queryParam.page = 1
      this.pagination.current = 1
      this.queryList()
    },

    // 重置筛选参数
    reset() {
      this.queryParam = {page:1, limit: this.queryParam.limit, query:{}}
      this.queryList()
    },
    
    // 获取列表
    async queryList() {
      this.loading = true;
      const res = await getFeedbackList(this.queryParam)
      this.loading = false;
      if (res.code !==0) return
      this.dataSource = res.data.list
      this.pagination.total = res.data.total
    },
    // 查看详情
    checkDetails(item){
      this.$router.push({path:"/marketing/afterSalesService/userFeedback/details/index",query:{id : item.id}})
    },

    // 获取全部应用
    async getAppList(){
      const res = await getAppList()
      if (res.code !==0) return
      this.appOptions = res.data?.list?.map(item=>{
        return{
          label: item.name,
          value: item.appKey
        }
      })
    },

    // 获取产品列表
    async getProductList() {
      const res = await getProductList({page:0})
      if(res.code !== 0)return
      this.productOptions = res.data?.list?.map(item=>{
        return{
          label: item.name,
          value: item.productKey
        }
      })
    },
  },
};
</script>
<style lang="less" scoped>
  @import "../../../../global.less";
  .ant-table-wrapper{
    margin-top: 20px;
  }
  .status{
    color: @aithings-text-color-gray;
  }
  .finish{
    color: @aithings-green-color;
  }
</style>
