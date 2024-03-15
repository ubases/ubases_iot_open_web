<template>
  <section class="page-wrap">
    <a-page-header :title="$t('appSplashScreen.push.title')" >
    
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input 
                  v-model="queryParam.query.name" 
                  :placeholder="$t('appSplashScreen.push.search.placeholder.pushName')" 
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.appKey"
                  :placeholder="$t('appSplashScreen.push.search.placeholder.pushApp')"
                  :options="appOptions"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.status"
                  :placeholder="$t('appSplashScreen.push.placeholder.pushStatus')"
                  :options="$DictList('app_splash_screen_launch_state')"
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
      <!-- 表格操作栏 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleDetails('','add')" class="grean-button">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t('public.add')}}
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
        <span class="push-name tap-pointer"  slot="name" slot-scope="text, record" @click="handleDetails(record.id,'check')">
          {{ record.name }}
        </span>
        <span slot="putinUser" slot-scope="text, record">
          {{$DictName('push_crowd_type', record.putinUser)}}
        </span>
        <template  slot="showTime" slot-scope="text, record">
          {{record.startTime | momentFilter}}{{$t('public.to')}}{{record.endTime | momentFilter}}
        </template>
        <template slot="status" slot-scope="text, record">
          <span :class="['status tap-pointer',{finish:record.status==5}]">{{$DictName('app_splash_screen_launch_state',record.status)}}</span>
        </template>
        <template v-slot:action="item">
          <a-button v-if="item.status == 1" type="link" size="small" @click="handleDetails(item.id,'edit')">
            {{$t('public.edit')}}
          </a-button>
          <a-divider v-if="item.status == 1" type="vertical" />
          <a-button v-if="item.status == 3" type="link" size="small" @click="handleStatus(item.id, 4)">
            {{$t('public.stoped')}}
          </a-button>
          <a-button v-if="item.status == 2" type="link" size="small" @click="handleStatus(item.id, 4)">
            {{$t('public.cancel')}}
          </a-button>
          <a-button v-if="item.status == 1" type="link" size="small" @click="handleStatus(item.id,2)">
            {{$t('appSplashScreen.push.button.launch')}}
          </a-button>
          <a-button v-if="item.status == 4 || item.status == 5" type="link" size="small" @click="handleDetails(item.id,'reLaunch')">
            {{$t('appSplashScreen.push.button.reLaunch')}}
          </a-button>
        </template>
      </a-table>
     
    </a-page-header>
  </section>
</template>
<script>
import { getFlashscreenList, setFlashscreen } from '@/api/splashScreenPush'
import { getAppList } from "@/api/appExploit"

export default {
  name: "AppSplashScreenPush",
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
          dataIndex: "id",
          title: this.$t('appSplashScreen.push.columns.id'),
        },
        {
          dataIndex: "name",
          title: this.$t('appSplashScreen.push.columns.pushName'),
          scopedSlots: { customRender: "name" },
        },
         {
          dataIndex: "appName",
          title: this.$t('appSplashScreen.push.columns.pushApp'),
        },
        {
          dataIndex: "putinUser",
          title: this.$t('appSplashScreen.push.columns.pushCrowd'),
          scopedSlots: { customRender: "putinUser" },
        },
        {
          dataIndex: "showTime",
          title: this.$t('appSplashScreen.push.columns.pushTime'),
          scopedSlots: { customRender: "showTime" },
        },
        {
          dataIndex: "status",
          title: this.$t('appSplashScreen.push.columns.pushStatus'),
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
      appOptions:[],
    };
  },
  created() {
    if (!this.$route.meta.isBack) {
      // 初始化data的值
      Object.assign(this.$data, this.$options.data.call(this))
      this.queryList()
      this.getAppList()
    }
  },
  beforeRouteEnter (to, from, next) {
    // 上次路由，设置isBack为 true 还是 false
    to.meta.isBack = from.path === '/marketing/appSplashScreenPush/details/index' || from.path === '/dashboard/index'
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
      this.queryParam = {page:1, limit: this.queryParam.limit,query:{}}
      this.queryList()
    },
    
    // 获取列表
    async queryList() {
      this.loading = true;
      const res = await getFlashscreenList(this.queryParam)
      this.loading = false;
      if (res.code !==0) return
      this.dataSource = res.data.list
      this.pagination.total = res.data.total
    },

    // 取消/停止/投放状态变更
    async handleStatus(id,status){
      const res = await setFlashscreen({id:id, status})
      if(res.code !== 0) return
      this.$message.info(this.$t('public.action.succeed'))
      this.queryList()
    },

    // 查看详情
    handleDetails(id, type){
      this.$router.push({path:"/marketing/appSplashScreenPush/details/index",query:{id,type}})
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

  },
};
</script>
<style lang="less" scoped>
  @import "../../../global.less";
  .ant-table-wrapper{
    margin-top: 20px;
  }
  .status{
    color: @aithings-text-color-gray;
  }
  .finish{
    color: @aithings-green-color;
  }
  .push-name{
    color: @primary-color;
  }
</style>
