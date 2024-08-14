<template>
    <section class="page-wrap">
    <a-page-header :title="$t('offlinePanelList.title')">
      <div class="topbar">
        <p class="details">{{ $t('offlinePanelList.tips') }}<a target="_blank" href="https://doc.iot-aithings.com/APP%E5%BC%80%E5%8F%91/%E4%BA%A7%E5%93%81%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%E5%BC%80%E5%8F%91%E5%BA%94%E7%94%A8" class="help-doc">{{ $t('public.check.doc') }}</a></p>
        <a-button type="primary" @click="handleEdit('add', {})" class="grean-button">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t("embed.panel.add")}}
        </a-button>
      </div>

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input v-model="queryParam.query.panelName" :placeholder="$t('offlinePanelList.name')" :allowClear="true"
                  @keyup.enter.native="query" />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-cascader 
                  :options="productTypeOptions" 
                  v-model="productTypeCascader"
                  :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                  :placeholder="$t('offlinePanelList.product.type')"
                  @change ="cascaderChange"
                  />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.productId"
                  :placeholder="$t('offlinePanelList.product')"
                  :options="productOptions"
                  @keyup.enter.native="queryList"
                  :allowClear="true"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space :size="10">
                  <a-button type="primary" @click="queryList">{{$t("public.query")}}</a-button>
                  <a-button class="regular-button" @click="reset">{{$t("public.reset")}}</a-button>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 表格 -->
      <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
        <span slot="panelName" slot-scope="text, record" class="name tap-pointer" @click="handleEdit('check', record)">{{ record.panelName }}</span>
        <div class="preview" slot="previewUrl" slot-scope="text, record">
          <img :src="record.previewUrl"  @click=" $PreviewModal({ url: record.previewUrl })"/>
        </div>
        <div slot="panelType" >{{$t('panel.type.offline')}}</div>
        <div slot="status" slot-scope="text, record">{{ $DictName('panel_status', record.status) }}</div>
        <template slot="createdAt" slot-scope="createdAt"> {{ createdAt | momentFilter }} </template>
        <template slot="updatedAt" slot-scope="updatedAt"> {{ updatedAt | momentFilter }} </template>
        <template v-slot:action="record">
          <a-button type="link" size="small" @click="handleEdit('edit', record)">{{ $t('public.edit') }}</a-button>
          <a-divider type="vertical" />
          <a-button type="link" v-if="record.status == 1 || record.status == 4" size="small" @click="handleEnable(record, 3)">{{ $t('public.enable') }}</a-button>
          <a-button type="link" v-if="record.status == 3" size="small" @click="handleEnable(record, 4)">{{ $t('public.disabled') }}</a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" @click="handleDelete(record.id,record.useCount)">{{ $t('public.delete') }}</a-button>
        </template>
      </a-table>
    </a-page-header>
  </section>
</template>
<script>
import { getProductClassifyList,getProductList } from "@/api/product"
import { getPanelList,deletePanel,setPanelStatus } from "@/api/offlinePanel"

export default {
  name: "OfflinePanelList",
  components: {
  },
  data() {
    return {
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total') + `:${total}` + this.$t('public.pagination.current') + `:${range[0]}-${range[1]}`,
      },
      queryParam: {
        page: 1,
        limit: 10,
        query: {}
      },
      // 查询参数
      columns: [
        {
          dataIndex: "panelName",
          title: this.$t('offlinePanelList.column.name'),
          scopedSlots: { customRender: "panelName" },
        },
        {
          dataIndex: "previewUrl",
          title: this.$t('offlinePanelList.column.img'),
          scopedSlots: { customRender: "previewUrl" },
        },
        {
          dataIndex: "panelType",
          title: this.$t('offlinePanelList.column.panelType'),
          scopedSlots: { customRender: "panelType" },
        },
        {
          dataIndex: "productTypeName",
          title: this.$t('offlinePanelList.column.productType'),
        },
        {
          dataIndex: "productName",
          title: this.$t('offlinePanelList.column.product'),
        },
        {
          dataIndex: "status",
          title: this.$t('offlinePanelList.column.status'),
          scopedSlots: { customRender: "status" },
        },
        {
          dataIndex: "createdAt",
          title: this.$t('public.createdTime'),
          scopedSlots: { customRender: "createdAt" },
        },
        {
          dataIndex: "updatedAt",
          title: this.$t('public.updateTime'),
          scopedSlots: { customRender: "updatedAt" },
        },
        {
          title: this.$t('public.action'),
          key: "action",
          align: "center",
          width: "210px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      productTypeOptions: [],
      productOptions: [],
      productTypeCascader:[null],
      productTypeList:[]
    };
  },
  async created() {
    if (this.$route.meta.isBack) {
      const query = getPageQuery(this.$route)
      if(query){
        this.$set(this,'queryParam', query.queryParam )
        this.$set(this,'productTypeCascader', query.productTypeCascader )
      }
    }
    await this.getProductClassifyList()
    await this.getProductList()
    this.queryList()
    
  },
  methods: {
    // 获取产品分类列表
    async getProductClassifyList() {
      const res = await getProductClassifyList()
      if(res.code !== 0) return
      // 将返回字段处理成统一的名称
      this.productTypeList = []
      const productTypeOptions= res.data?.list?.map(item =>{
        this.productTypeList.push(item)
        if(item.children && item.children.length>0){
          this.productTypeList= [...this.productTypeList,...item.children]
        }
        return {
          ...item,
          children: item.children?.map(p=>{
            p.children = p.products
            this.productTypeList= [...this.productTypeList,...p.products]
            return p
          }) ||[]
        } 
      })
      this.productTypeOptions = productTypeOptions.filter(item=>item.children.length > 0)
      this.productTypeOptions.unshift( { name:this.$t('panel.productType.all'), id:null, children:[] },)
    },

    // 获取产品列表
    async getProductList() {
      const res = await getProductList({page:0})
      if(res.code !== 0)return
      this.productOptions = res.data?.list?.map(item=>{
        return{
          label: item.name,
          value: item.id,
          productTypeId:item.productTypeId
        }
      })
      this.productOptions.unshift({ label:this.$t('panel.product.all'), value:null })
    },

    // 产品类型切换
    cascaderChange(value){
      this.queryParam.query['baseProductId'] = value[value.length - 1] ?? null
    },

    onChangePagination(e) {
      this.queryParam.page = e.current
      this.queryParam.limit = e.pageSize
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryList()
    },

    query() {
      this.queryParam.page = 1
      this.pagination.current = 1
      this.queryList()
    },
    reset() {
      this.productTypeCascader = [null]
      this.queryParam = {
        page: 1,
        limit: this.queryParam.limit,
        query: {}
      }
      
      this.queryList()
    },

    // 获取列表
    async queryList() {
      this.loading = true;
      const res = await getPanelList({...this.queryParam, query: {...this.queryParam.query,panelType:3}})
      this.loading = false;
      if (res.code !== 0) return
      this.dataSource = res.data.list?.map(item=>{
        return {
          ...item,
          productTypeName:this.productTypeList.filter(t=>t.id == item.baseProductId)?.pop()?.name || '',
          productName:this.productOptions.filter(t=>t.value == item.productId)?.pop()?.label || '所有产品'
        }
      })
      this.pagination.total = res.data.total
    },

    handleEdit(type, data) {
      this.$router.push({ path: '/panel/offlinePanel/detail/index', query:{ type, id:data.id }})
    }, 

    async handleEnable(data,status) {
      const res = await setPanelStatus({id:data.id, status})
      if (res.code !== 0) return
      this.queryList()
    },

    handleDelete(id,count) {
      // 已应用于产品
      if(count>0){
        this.$WarningModal(this, this.$t('offlinePanelList.delete.disabled'))
      } else {
        // 产品未使用
        this.$WarningModal(this, this.$t('offlinePanelList.delete.confirm')).then(async () => {
          const res = await deletePanel(id)
          this.$message.success(this.$t('public.delete_success'))
          if (res.code !== 0) return
          if (this.dataSource.length == 1 && this.queryParam.page != 1) {
            this.queryParam.page--
            this.pagination.current--
          }
          this.queryList()
        });
      }
    },

  },
  beforeRouteEnter (to, from, next) {
    to.meta.isBack = from.path === '/panel/offlinePanel/detail/index'
    next()
  },
  
  beforeRouteLeave(to, from, next) {
    Storage.set("pageQuery", {[from.name]:{queryParam:this.queryParam, productTypeCascader:this.productTypeCascader}})
    next();
  }
};
</script>
<style lang="less" scoped>
@import "../../../global.less";
  .name,.help-doc{
    color: @primary-color;
  }
  .preview{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 80px;
    box-sizing: border-box;
    background: #F5F6FA;
    border-radius: 4px 4px 0px 0px;
    
    img{
      padding: 5px;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .details{
    padding-bottom: 10px;
  }
  .grean-button{
    position: absolute;
    right: 22px;
    top:33px;
  }
  .table-page-search-wrapper{
    margin: 10px 0 20px;
  }

</style>