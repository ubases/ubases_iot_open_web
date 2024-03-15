<template>
  <section class="page-wrap">
    <a-page-header :title="`${productName}`+$t('helpCenter.docManage.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
        <!-- 筛选栏 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="10">
              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-select
                    v-model="queryParam.query.lang"
                    :placeholder="$t('helpCenter.docManage.placeholder.lang')"
                    :options="langList"
                    :allowClear="true"
                    @keyup.enter.native="queryList"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-input
                    v-model="queryParam.query.title"
                    :placeholder="$t('helpCenter.docManage.placeholder.title')"
                    :allowClear="true"
                    @keyup.enter.native="queryList"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-select
                    v-model="queryParam.query.status"
                    :placeholder="$t('helpCenter.docManage.placeholder.isEnable')"
                    :options="$DictList('is_doc_enable')"
                    :allowClear="true"
                    @keyup.enter.native="queryList"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-space :size="10">
                    <a-button type="primary" @click="queryList">{{$t("public.search.button")}}</a-button>
                    <a-button class="regular-button" @click="reset">{{$t("public.reset")}}</a-button>
                  </a-space>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- 表格操作栏 -->
        <div class="table-operator">
          <a-button type="primary" class="grean-button" @click="toggleAdd">
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
          <template v-slot:title="record">
            <span class="title tap-pointer" @click="checkDetails(record)">{{record.title}}</span>
          </template>
          <template slot="status" slot-scope="text, record">
            {{$DictName('is_doc_enable',record.status)}}
          </template>
          <template slot="updatedAt" slot-scope="text, record">
            {{record.updatedAt | momentFilter}}
          </template>
          
          <template v-slot:action="item">
            <a-button type="link" size="small" @click="editDoc(item)">
              {{$t('helpCenter.docManage.edit.doc')}}
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" size="small" @click="configDoc(item)">
              {{$t('public.set')}}
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" size="small" @click="deleteDoc(item)">
              {{$t('public.delete')}}
            </a-button>
          </template>
        </a-table>
    </a-page-header>
    <set-doc :visible="setDocVisible" :form="setData" @handleCancel="cancelSet" @handleOk="sumitSet"/>
    <edit-doc 
      :visible="editDocVisible" 
      :readOnly ="isReadOnly" 
      :title="editTitle" 
      :relationId="editRelationId" 
      :productKey="productKey" 
      :langList="langList" 
      @cancel="cancelEdit" 
      @sumit="sumitEdit"
    />
  </section>

</template>
<script>

import SetDoc from '../components/SetDoc.vue'
import EditDoc from '../components/EditDoc.vue'
import { getHelpDocList, deleteHelpDoc, getHelpDetail } from '@/api/productHelpCenter'

export default {
  components:{
    SetDoc,
    EditDoc
  },
  
  data(){
    return {
      queryParam: { query: { lang: 'zh' } },
      dataSource: [],
      columns: [
        {
          title: this.$t('public.sort'),
          dataIndex:'sortId',
          width:'50px'
        },
        {
          title: this.$t('helpCenter.docManage.columns.title'),
          key:'title',
          scopedSlots: { customRender: "title" },
        },
        {
          dataIndex: "status",
          title: this.$t('helpCenter.docManage.columns.isEnable'),
          scopedSlots: { customRender: "status" },
          width:'50px'
        },
        {
          dataIndex: "updatedAt",
          title: this.$t('helpCenter.docManage.columns.updatedAt'),
          scopedSlots: { customRender: "updatedAt" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "220px",
          scopedSlots: { customRender: "action" },
        }
      ],
      loading: false,
      setDocVisible: false,
      editDocVisible: false,
      isReadOnly: false,
      editTitle: '',
      docId: '',
      productName: '',
      type: '',
      setIdEdit: '',
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total') + `:${total}` + this.$t('public.pagination.current') + `:${range[0]}-${range[1]}`,
      },
      langList: [],
      setData: {},
      productKey: '',
      editRelationId: '',
    }
  },
  created(){},
  mounted(){
    this.productKey = this.$route.query.productKey || ''
    this.docId = this.$route.query.id || ''
    this.getSupportLangs()
    this.queryList()
  },
  methods:{

    // 重置筛选参数
    reset() {
      this.queryParam = { query: { lang: this.queryParam.query.lang } }
      this.pagination.current = 1
      this.queryList()
    },
    
    // 获取列表
    async queryList() {
      this.loading = true;
      this.queryParam.query['productKey'] = this.productKey
      const param = {
        ...this.queryParam, 
        pageNum: this.pagination.current, 
        pageSize: this.pagination.pageSize
      }
      const res = await getHelpDocList(param)
      this.loading = false;
      if ( res.code !== 0 ) return
      this.dataSource = res.data.list
      this.pagination.total = res.data.total
    },

    // 添加文档
    toggleAdd(){
      this.isReadOnly = false
      this.editTitle = this.$t('public.add')
      this.editRelationId = ''
      this.editDocVisible = true
      
    },

    // 查看文档
    checkDetails(item){
      this.isReadOnly = true
      this.editTitle = this.$t('helpCenter.docManage.problem.detail')
      this.setIdEdit = item.id
      this.editDocVisible = true
    },

    // 编辑文档
    editDoc(item){
      this.isReadOnly = false
      this.editTitle = this.$t('public.edit')
      this.editRelationId = item.relationId
      this.editDocVisible = true
    },

    // 设置文档
    configDoc(item){
      this.setData = {...item}
      this.setDocVisible = true
    },

    // 取消设置文档
    cancelSet(){
      this.setDocVisible = false
    },

    // 确认设置文档
    sumitSet(){
      this.setDocVisible = false
      this.queryList()
    },

    // 取消添加/编辑文档
    cancelEdit(){
      this.editDocVisible = false
    },

    // 确认添加/编辑文档
    sumitEdit(){
      this.editDocVisible = false
      this.queryList()
    },

    // 删除文档
    deleteDoc(item){
      this.$ConfirmModal(this, this.$t('helpCenter.docManage.delete.content'), this.$t('helpCenter.docManage.delete.title'), this.$t('public.sumit')).then(async() => {
        const res = await deleteHelpDoc({ relationId: item.relationId })
        if(res.code !== 0) return
        this.$message.success(this.$t('public.action.succeed'))
        this.queryList()
      })
    },

    // 获取支持语种
    async getSupportLangs(){
      const res = await getHelpDetail({ id: this.docId })
      if(res.code !== 0)return
      this.langList = res.data?.langs?.map((lang)=>{
        return {
          label: lang.langName,
          value: lang.lang,
        }
      })
    },

    // 翻页
    onChangePagination(e){
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryList()
    }
  }
}
</script>
<style scoped lang="less">


</style>