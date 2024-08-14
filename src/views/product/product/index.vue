<template>
  <section class="page-wrap">
    <a-page-header :title="$t('product.title')" >
    
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input 
                  v-model="queryParam.searchKey" 
                  :placeholder="$t('product.placeholder.searchKey')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                 />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-cascader 
                  :options="productTypeOptions" 
                  v-model="productTypeCascader"
                  :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                  :placeholder="$t('product.placeholder.productTypeCascader')"
                  @change ="cascaderChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.networkType"
                  :placeholder="$t('product.placeholder.networkType')"
                  default-value=""
                  :options="$DictList('network_type')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.status"
                  :placeholder="$t('product.placeholder.status')"
                  default-value=""
                  :options="$DictList('develop_status')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                >
                </a-select>
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
        <a-button type="primary" class="grean-button" @click="addProduct">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t('product.create.product.button')}}
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
        <template slot="name" slot-scope="name, record" >
           <section class="flex y-axis-center">
            <section  class="product-img-wrap flex xy-axis-center">
              <img :src="record.imageUrl" class="product-img"/>
            </section>
            <section>
              <a-space :size="5" direction="vertical">
                <p class="product-name" @click="productDetails(record.id)">{{record.name}}</p>
                <p>{{$t('product.record.productKey')}}: {{record.productKey}}</p>
              </a-space>
            </section>
           </section>
        </template>
        <template slot="networkType" slot-scope="networkType">
          {{$DictName('network_type',networkType)}}
        </template>
        <template slot="deviceNature" slot-scope="deviceNature">
          {{deviceNature}}
        </template>
        <template slot="status" slot-scope="status">
          <p :class="{'finished-status': status === 2}">{{$DictName('develop_status',status)}}</p>
        </template>
        <template  slot="updatedAt" slot-scope="updatedAt">
          {{ updatedAt | momentFilter }}
        </template>
        <template v-slot:action="record">
          <a-button v-if="record.status == 2" type="link" size="small" @click="continueDevelop(record.id)">{{$t('product.continue.develop')}}</a-button>
          <a-divider v-if="record.status == 2" type="vertical" />
          <a-button v-if="record.status == 1" type="link" size="small" @click="productDetails(record.id)">{{$t('public.detail.text')}}</a-button>
          <a-divider v-if="record.status == 1" type="vertical" />
          <a-button type="link" size="small" @click="handleLinkApp(record)">{{$t('product.link.app')}}</a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" @click="deleteProduct(record.id)">{{$t("public.delete")}}</a-button>
        </template>
      </a-table>
      <!-- /表格 -->
      <link-app :visible="linkAppVisible" :productId="linkProductData.id" :produtKey="linkProductData.productKey" :allAppList="allAppList" @handleCancel="cancelLink" @handleOk="updateLink"></link-app>
    </a-page-header>
  </section>
</template>
<script>
import { getProductList,getProductClassifyList, deleteProduct} from "@/api/product"
import { getAppList } from "@/api/appExploit"
import linkApp from "./components/linkApp.vue"

export default {
  name: "ProductList",
  components:{
    linkApp,
  },
  data() {
    return {
      productTypeOptions: [],
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
          dataIndex: "name",
          title: this.$t('product.columns.name'),
          scopedSlots: { customRender: "name" },
        },
        {
          dataIndex: "productTypeName",
          title: this.$t('product.columns.productTypeName'),
          
        },
        {
          dataIndex: "model",
          title: this.$t('product.columns.model'),
          width: "100px",
        },
        {
          dataIndex: "networkType",
          title: this.$t('product.columns.networkType'),
          scopedSlots: { customRender: "networkType" },
        },
        {
          dataIndex: "status",
          title: this.$t('product.columns.status'),
          scopedSlots: { customRender: "status" },
          width: "100px",
        },
        {
          title: this.$t('product.link.app'),
          dataIndex: "appListStr",
          width: "20%",
        },
        {
          dataIndex: "updatedAt",
          title: this.$t('product.columns.updatedAt'),
          scopedSlots: { customRender: "updatedAt" },
          
          },
        {
          title: this.$t('public.action'),
          key: "action",
          align: "left",
          width: "260px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      productTypeCascader:[],
      allAppList:[],
      linkAppVisible:false,
      linkProductData:{}
    };
  },
  async mounted() {
    if (this.$route.meta.isBack) {
      const query = getPageQuery(this.$route)
      if(query){
        this.$set(this,'queryParam', query.queryParam )
        this.$set(this,'productTypeCascader', query.productTypeCascader )
      }
    }
    await this.getProductList()
    this.getProductClassifyList()
    this.queryAppList()
  },

  methods: {
    // 获取产品分类列表
    async getProductClassifyList() {
      const res = await getProductClassifyList()
      if(res.code !== 0) return
      // 将返回字段处理成统一的名称
      this.productTypeOptions = res.data?.list?.map(item =>{
        return {
          ...item,
          children: item.children?.map( products=>{
            return {
              ...products,
              children: products?.products || []
            }
          }) || []
        } 
      })
    },

    // 获取产品列表
    async getProductList() {
      const res = await getProductList({...this.queryParam,page:this.pagination.current,limit:this.pagination.pageSize})
      if(res.code !== 0)return
      this.dataSource = res.data.list?.map(item => {
        return {
          ...item,
          appListStr: item.appList?.join('、') || ''
        }
      }) || []
      this.pagination.total = res.data.total
    },

      //获取APP列表
      async queryAppList() {
        const res = await getAppList({})
        if (res.code !== 0) return
        this.allAppList = res.data?.list?.map(item=>{
          return {
            key:item.appKey,
            name:item.name
          }
        }) || []
      },

    // 查询
    query(){
      this.pagination.current = 1
      this.getProductList()
    },

    // 重置
    reset() {
      this.pagination.current = 1
      this.queryParam = {query:{}}
      this.productTypeCascader = []
      this.getProductList()
    },

    // 产品类型切换
    cascaderChange(value){
      if(value[value.length - 1]){
        this.queryParam.query.productTypeId = value[value.length - 1]
      } else {
        delete this.queryParam.query.productTypeId
      }
    },

    // 新增产品
    addProduct() {
       this.$router.push({path:"/product/product/createProduct/index"})
    },

    // 继续开发
    continueDevelop(productId){
      this.$router.push({path:"/product/product/setting/index",query:{productId}})
    },

    // 详情
    productDetails(productId){
      this.$router.push({path:"/product/product/setting/index",query:{productId,type:"details"}})
    },

    // 删除产品
    deleteProduct(productId){
      this.$WarningModal(this, this.$t('product.delete')).then(async() => {
        const res = await deleteProduct({'id':productId})
        if(res.code !== 0) return
        this.getProductList()
      })
    },

    //翻页
    onChangePagination(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.getProductList()
    },

    // 点击关联应用
    handleLinkApp(data){
      this.linkProductData = data
      this.linkAppVisible = true
    },

    cancelLink(){
      this.linkAppVisible = false
    },
    updateLink(){
      this.linkAppVisible = false
      this.getProductList()
    }
  },

  beforeRouteEnter (to, from, next) {
    to.meta.isBack = from.path === '/product/product/setting/index' || from.path === '/product/product/createProduct/index'
    next()
  },

  beforeRouteEnter (to, from, next) {
    to.meta.isBack = from.path === '/product/product/setting/index' || from.path === '/product/product/createProduct/index'
    next()
  },
  
  beforeRouteLeave(to, from, next) {
    Storage.set("pageQuery", {[from.name]:{queryParam:this.queryParam, productTypeCascader:this.productTypeCascader}})
    next();
  }
}
</script>
<style lang="less" scoped>
  @import "../../../global.less";
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
