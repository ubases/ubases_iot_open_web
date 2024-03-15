<template>
  <section class="page-wrap">
    <a-page-header :title="$t('intelligentScene.title')" >
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input
                  v-model="queryParam.query.title"
                  :placeholder="$t('intelligentScene.search.placeholder.name')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.appKey"
                  :placeholder="$t('intelligentScene.search.placeholder.appId')"
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
                  :placeholder="$t('intelligentScene.search.placeholder.status')"
                  :options="$DictList('web_status')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space :size="10">
                  <a-button type="primary" @click="query">{{$t("public.query")}}</a-button>
                  <a-button  class="regular-button" @click="reset">{{$t("public.reset")}}</a-button>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 表格操作栏 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleDetails('add')" class="grean-button">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t("intelligentScene.add.button")}}
          </a-button>
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
        <span slot="titleText" slot-scope="text, record" class="name tap-pointer"  @click="handleDetails('check',record.id)">
          {{record.title}}
        </span>
        <span slot="type" slot-scope="text, record">
          {{$DictName('scene_type',record.type)}}
        </span>
        <span slot="status" slot-scope="text, record">
          {{$DictName('web_status',record.status)}}
        </span>
        <span slot="updatedAt" slot-scope="text, record">
          {{record.updatedAt | momentFilter}}
        </span>
        <template v-slot:action="record">
          <a-button v-if="record.status == 1" type="link" size="small" @click="handleEnable(2,record.id)">
            {{ $t("public.stop") }}
          </a-button>
          <a-button v-if="record.status == 2" type="link" size="small" @click="handleEnable(1,record.id)">
            {{ $t("public.enable") }}
          </a-button>
          <a-divider type="vertical" v-if="record.status == 1 || record.status == 2"/>
          <a-button type="link" size="small" @click="handleDetails('edit',record.id)">
            {{ $t("public.edit") }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small"  @click="handleDelete(record.id)">
            {{$t("public.delete")}}
          </a-button>
        </template>
      </a-table>
     
    </a-page-header>
  </section>
</template>
<script>
import { getSceneList, deleteScene, setSceneStatus } from "@/api/intelligentScene";
import { getAppList } from "@/api/appExploit";
import { getProductList } from "@/api/product"

export default {
  name: "RecommendScene",

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
          dataIndex: "title",
          title: this.$t("intelligentScene.column.name"),
          scopedSlots: { customRender: 'titleText' }
        },
        {
          dataIndex: "products",
          title: this.$t("intelligentScene.column.products"),
        },
        {
          dataIndex: "fitApp",
          title: this.$t("intelligentScene.column.fitApp"),
        },
        {
          dataIndex: "type",
          title: this.$t("intelligentScene.column.type"),
          scopedSlots: { customRender: 'type' }
        },
         {
          dataIndex: "status",
          title: this.$t("intelligentScene.column.isEnable"),
          scopedSlots: { customRender: 'status' }
        },
        {
          dataIndex: "updatedAt",
          title: this.$t("intelligentScene.column.updateAt"),
          scopedSlots: { customRender: 'updatedAt' }
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "240px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      appOptions:[],
      productList:[]
    };
  },
  async created() {
    if (!this.$route.meta.isBack) {
      // 初始化data的值
      Object.assign(this.$data, this.$options.data.call(this))
      await this.getProductList()
      this.queryList()
      this.getFitAppList()
    }
    
  },
  beforeRouteEnter (to, from, next) {
    // 上次路由，设置isBack为 true 还是 false
    to.meta.isBack = from.path === '/appDevelop/intelligentScene/details/index' || from.path === '/dashboard/index'
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
      this.queryParam.page = e.current
      this.queryParam.limit  = e.pageSize
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryList()
    },

    query() {
      this.queryParam.page = 1
      this.pagination.current = 1
      this.queryList()
    },

    // 重置筛选参数
    reset() {
      this.queryParam = {page:1, limit:this.queryParam.limit,query:{}}
      this.queryList()
    },
    
    // 获取列表
    async queryList() {
      this.loading = true;
      const res = await getSceneList(this.queryParam)
      this.loading = false;
      if (res.code !== 0) return
      this.dataSource = res.data.list?.map(item=>{
        const productNames = item.tasks?.map(t=>this.productList.filter(pro=>pro.productKey === t.productKey)?.pop()?.name || '')
        return {
          ...item,
          products: productNames?.toString() || '',
          fitApp: item.isSpecifyApp === 1 ?'所有App' : item.appList?.map(a=>a.appName)?.toString() || ''
        }
      })
      this.pagination.total = res.data.total
    },

    // 适用app列表
    async getFitAppList(){
      const res = await getAppList({page:0})
      if(res.code !== 0) return
      this.appOptions = res.data?.list?.map(item=>{
        return{
          value:item.appKey,
          label:item.name
        }
      })
    },

    // 获取产品列表
    async getProductList(){
      const res = await getProductList({page:0})
      if(res.code !==0) return
      this.productList = res.data?.list || []
    },

    // 跳转详情
    async handleDetails(type, id){
      this.$router.push({path:"/appDevelop/intelligentScene/details/index",query:{id,type}})
    },

    // 设置状态
    async handleEnable(status,id){
      const res = await setSceneStatus({status,id})
      if(res.code !== 0)return
      this.queryList()
    },

    // 删除
    handleDelete(id){
      this.$WarningModal(this, this.$t('public.confirm.delete')+`?`).then(async () => {
        const res = await deleteScene(id)
        this.$message.success(this.$t('public.delete_success'))
        if(res.code!==0)return
        if(this.dataSource.length==1 && this.queryParam.page != 1){
          this.queryParam.page --
          this.pagination.current --
        }
        this.queryList()
      });
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../../global.less";
.name{
  color: @primary-color;
}
</style>
