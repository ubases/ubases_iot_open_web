<template>
  <section class="page-wrap">
    <a-page-header :title="$t('user.manage.title')" >
    
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.appType"
                  :placeholder="$t('user.manage.placeholder.appType')"
                  :options="appOptions"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input
                  v-model="queryParam.userAccount"
                  :placeholder="$t('user.manage.placeholder.userAccount')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input
                  v-model="queryParam.userMobile"
                  :placeholder="$t('user.manage.placeholder.userMobile')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input
                  v-model="queryParam.userEmail"
                  :placeholder="$t('user.manage.placeholder.userEmail')"
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
        <template  slot="registerTime" slot-scope="text, record">
          {{ record.registerTime | momentFilter }}
        </template>
        <template v-slot:action="item">
          <a-button type="link" size="small" @click="handleDetails(item)">
            {{ $t("public.check.details") }}
          </a-button>
        </template>
      </a-table>
      <!-- 新增固件弹窗 -->
     
    </a-page-header>
  </section>
</template>
<script>
import { getUserList } from '@/api/dataManage'
import { getAppList } from '@/api/appExploit'
export default {
  name: "AppUsers",
  components: {
  },
  data() {
    return {
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total') + `:${total} `+ this.$t('public.pagination.current') + `:${range[0]}-${range[1]}`,
      },
      // 查询参数
      queryParam: { page:1, limit:10, query:{}},
      columns: [
        {
          dataIndex: "appName",
          title: this.$t('user.manage.columns.appName'),
        },
        {
          dataIndex: "userAccount",
          title: this.$t('user.manage.columns.userAccount'),
        },
        {
          dataIndex: "userMobile",
          title: this.$t('user.manage.columns.userMobile'),
        },
         {
          dataIndex: "userEmail",
          title: this.$t('user.manage.columns.userEmail'),
        },
        {
          dataIndex: "nickname",
          title: this.$t('user.manage.columns.nickname'),
        },
         {
          dataIndex: "registerTime",
          title: this.$t('user.manage.columns.registerTime'),
          scopedSlots: { customRender: "registerTime" },
        },
        {
          title: this.$t('user.manage.columns.action'),
          key: "action",
          align: "center",
          width: "180px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      addVisiable: false,
      appOptions: []
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
    to.meta.isBack = from.path === '/dataManage/appUsers/userDetails/index' || from.path === '/dashboard/index'
    next()
  },

  activated () {
    // keep-alive activated钩子
    if (this.$route.meta.isBack) {
      this.$route.meta.isBack = false // 重置isBack
      this.queryList()
    }
  },
  methods: {
    onChangePagination(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
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
      this.queryParam = {page:this.queryParam.page, limit: this.queryParam.limit, query:{}}
      this.queryList()
    },

    // 获取全部应用
    async getAppList(){
      const res = await getAppList()
      if (res.code !==0) return
      this.appOptions = res.data?.list?.map(item=>{
        return{
          label: item.name,
          value: item.id
        }
      })
    },
    
    // 获取列表
    async queryList() {
      this.loading = true;
      const res = await getUserList(this.queryParam)
      this.loading = false;
      if (res.code !==0) return
      this.dataSource = res.data.list
      this.pagination.total = res.data.total
    },
    // 查看详情
    handleDetails(item){
      const {appName, userAccount, userId} = {...item}
      this.$router.push({path:"/dataManage/appUsers/userDetails/index",query:{userInfo : JSON.stringify({appName, userAccount, userId})}})
    }
  },
};
</script>
<style lang="less" scoped>
  .ant-table-wrapper{
    margin-top: 20px;
  }
</style>
