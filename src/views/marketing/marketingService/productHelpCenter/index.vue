<template>
  <section class="page-wrap">
    <a-page-header :title="$t('productHelpcenter.title')" >
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input 
                  v-model="queryParam.query.productName" 
                  :placeholder="$t('productHelpcenter.placeholder.productName')" 
                  :allowClear="true"
                  @keyup.enter.native="queryList"
                />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item>
                <a-cascader 
                :options="productTypeOptions" 
                v-model="productTypeCascader"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                :placeholder="$t('product.placeholder.productTypeCascader')"
                @change ="cascaderChange"
                :allowClear="true"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.status"
                  :placeholder="$t('productHelpcenter.placeholder.status')"
                  default-value=""
                  :options="$DictList('is_doc_enable')"
                  :allowClear="true"
                  @keyup.enter.native="queryList"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space :size="10">
                  <a-button type="primary" @click="queryList">
                    {{$t('public.search.button')}}
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
        <template slot="productTypeId" slot-scope="text, record">
          {{getProductTypeName(record.productTypeId)}}
        </template>
        <template slot="status" slot-scope="text, record">
          {{$DictName('is_doc_enable',record.status)}}
        </template>
        <template slot="updatedAt" slot-scope="text, record">
          {{record.updatedAt | momentFilter}}
        </template>
        <template v-slot:action="item">
          <a-button type="link" size="small" @click="handleManage(item)">
            {{$t('helpCenter.manage.doc')}}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" @click="handleSet(item.id)">
            {{$t('public.set')}}
          </a-button>
          <a-divider type="vertical" />
          <a-button v-if="item.status === 2" type="link" size="small" @click="handleEnable(item)">
            {{$t('public.enable')}}
          </a-button>
          <a-button v-if="item.status === 1" type="link" size="small" @click="handleEnable(item)">
            {{$t('public.disabled')}}
          </a-button>
        </template>
      </a-table>
      <!-- /表格 -->
    </a-page-header>
    <set :visible="setVisible" :id="setId" @handleOk="handleOkSet" @handleCancel="handleCancelSet"/>
  </section>
</template>
<script>

import { getHelpList, enableHelpConfig } from '@/api/productHelpCenter'
import { getProductClassifyList } from "@/api/product"
import { flatArr } from "@/utils/util"
import Set from "./components/set.vue"

export default {
  name: "ProductHelpCenter",
  components: {
    Set
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('public.sort'),
          customRender: (item,value,index) => index + 1
        },
        {
          dataIndex: "productName",
          title: this.$t('productHelpcenter.columns.name'),
          width: '30%',
        },
        {
          dataIndex: "productTypeId",
          title: this.$t('product.columns.productTypeName'),
          scopedSlots: { customRender: "productTypeId" },
        },
        {
          dataIndex: "status",
          title: this.$t('productHelpcenter.columns.status'),
          scopedSlots: { customRender: "status" },
        },
         {
          dataIndex: "updatedAt",
          title: this.$t('productHelpcenter.columns.updatedAt'),
          scopedSlots: { customRender: "updatedAt" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "250px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      queryParam:{
        query:{}
      },
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total')+`:${total}` + this.$t('public.pagination.current') +`:${range[0]}-${range[1]}`,
      },
      productTypeOptions: [],
      productTypeCascader:[],
      setVisible: false,
      setId: '',
      productTypeList: [],
    };
  },
  created() {
    if (this.$route.meta.isBack) {
      const query = getPageQuery(this.$route)
      if(query){
        this.$set(this,'queryParam', query.queryParam)
        this.$set(this,'productTypeCascader', query.productTypeCascader)
      }
    }
    this.getProductClassifyList()
    this.queryList()
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
            }
          }) || []
        } 
      }) || []
      this.productTypeList = flatArr(this.productTypeOptions, 'children')
    },

    // 产品类型切换
    cascaderChange(value){
        this.queryParam.query.productTypeId = value[value.length - 1] ?? ''
    },
    
    // 获取列表
    async queryList() {
      const res = await getHelpList({page: this.pagination.current, limit: this.pagination.pageSize, ...this.queryParam})
      if(res.code !== 0) return
      this.dataSource =  res.data.list
      this.pagination.total = res.data.total
    },

    // 设置
    handleSet(id){
      this.setId = id
      this.setVisible = true
    },

    // 确认设置
    handleOkSet(){
      this.setVisible = false
      this.queryList()
    },

    // 取消设置
    handleCancelSet(){
      this.setVisible = false
    },

    // 启用/禁用
    async handleEnable(item){
      const res = await enableHelpConfig({id: item.id, status:item.status === 1 ? 2: 1})
      if(res.code !== 0 ) return
      this.$message.success(this.$t('public.action.succeed'))
      this.queryList()
    },

    // 重置
    reset() {
      this.pagination.current = 1
      this.queryParam = {query:{}}
      this.productTypeCascader = []
      this.queryList()
    },

    //翻页
    onChangePagination(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryList()
    },

    // 管理文档
    handleManage(item){
      this.$router.push({path:"/marketing/marketingService/productHelpCenter/docManage/index", query: {id: item.id, productKey: item.productKey}})
    },

    // 获取产品类型名称
    getProductTypeName(id){
      return this.productTypeList.filter(item => item.id === id)?.pop()?.name || ''
    }
  },

  beforeRouteEnter (to, from, next) {
    to.meta.isBack = from.path === '/marketing/marketingService/productHelpCenter/docManage/index'
    next()
  },
  beforeRouteLeave(to, from, next) {
    Storage.set("pageQuery", {[from.name]:{queryParam:this.queryParam, productTypeCascader:this.productTypeCascader}})
    next();
  }
};
</script>
<style lang="less" scoped>
@import "../../../../global.less";

.table-page-search-wrapper{
  margin-bottom: 20px;
}
.table-msg{
  font-size: 14px;
  color: @aithings-text-color-gray;
  line-height: 20px;
  margin-bottom: 10px;
}
</style>
