<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="pubAppName || `${appName}`+$t('helpCenter.docManage.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content-wrap flex">
        <section class="catalog-wrap">
          <h3 class="title">{{$t('helpCenter.docManage.catalog')}}</h3>
          <catalog :type="type" :docId="docId" :langList="docLangList" @menuChange="menuChange" @getTreeData="getTreeData"/>
        </section>
        <section class="table-wrap">
          <!-- 筛选栏 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="10">
                <a-col :md="4" :sm="24">
                  <a-form-item>
                    <a-select
                      v-model="queryParam.lang"
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
                      v-model="queryParam.title"
                      :placeholder="$t('helpCenter.docManage.placeholder.title')"
                      :allowClear="true"
                      @keyup.enter.native="queryList"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="4" :sm="24">
                  <a-form-item>
                    <a-select
                      v-model="queryParam.isNormal"
                      :placeholder="$t('helpCenter.docManage.placeholder.isNormal')"
                      :options="$DictList('yes_no')"
                      :allowClear="true"
                      @keyup.enter.native="queryList"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="4" :sm="24">
                  <a-form-item>
                    <a-select
                      v-model="queryParam.isEnable"
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
                      <a-button type="primary" @click="queryList">{{$t("public.query")}}</a-button>
                      <a-button class="regular-button" @click="reset">{{$t("public.reset")}}</a-button>
                    </a-space>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <!-- 表格操作栏 -->
          <div class="table-operator">
            <a-button v-if="type=='edit' && activeMenuId" type="primary" class="grean-button" @click="toggleAdd">
              <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
              {{$t('public.add')}}
            </a-button>
          </div>
          <!-- /表格操作栏 -->
          <!-- 表格 -->
          <a-table
            size="small"
            rowKey="setingId"
            :data-source="dataSource"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            @change="onChangePagination"
          >
            <template v-slot:title="record" >
              <span class="title tap-pointer" @click="checkDetails(record)">{{record.title}}</span>
            </template>
            <template slot="isEnable" slot-scope="text, record">
              {{$DictName('is_doc_enable',record.isEnable)}}
            </template>
            <template slot="updatedAt" slot-scope="text, record">
              {{ record.updatedAt | momentFilter }}
            </template>
            <template slot="isNormal" slot-scope="text, record">
              {{$DictName('yes_no',record.isNormal)}}
            </template>
            <template v-slot:action="item">
              <a-button type="link" size="small" @click="configDoc(item)">
                {{$t('public.set')}}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click="editDoc(item)">
                {{$t('helpCenter.docManage.edit.doc')}}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click="deleteDoc(item)">
                {{$t('public.delete')}}
              </a-button>
            </template>
          </a-table>
        </section>
      </section>
    </a-page-header>
    <set-doc :visible="setDocVisible" :setingId="setingIdEdit" :menuTree="menuTree" :parentId="activeParentId" @handleCancel="cancelSet" @handleOk="sumitSet"/>
    <edit-doc :visible="editDocVisible" :isPublic="type == 'public'" :readOnly ="isReadOnly" :title="editTitle" :setingId="setingIdEdit" :dirId="activeMenuId" :langList="langList" @cancel="cancelEdit" @sumit="sumitEdit"/>
  </section>

</template>
<script>
import Catalog from '../components/Catalog.vue'
import SetDoc from '../components/SetDoc.vue'
import EditDoc from '../components/EditDoc.vue'
import { appDocDetail, getEntryList, deleteEntry,getSupportLangs,getPublishEntryList,getPubLangs } from '@/api/helpCenter'

export default {
  components:{
    Catalog,
    SetDoc,
    EditDoc
  },
  
  data(){
    return {
      queryParam: {lang:'zh'},
      dataSource:[],
      columns:[
         {
          title: this.$t('public.sort'),
          dataIndex:'sort',
          width:'50px'
        },
        {
          title: this.$t('helpCenter.docManage.columns.title'),
          key:'title',
          scopedSlots: { customRender: "title" },
          
        },
        {
          dataIndex: "dirName",
          title: this.$t('helpCenter.docManage.columns.dirName'),
        },
         {
          dataIndex: "isEnable",
          title: this.$t('helpCenter.docManage.columns.isEnable'),
          scopedSlots: { customRender: "isEnable" },
          width:'50px'
        },
        {
          dataIndex: "updatedAt",
          title: this.$t('helpCenter.docManage.columns.updatedAt'),
          scopedSlots: { customRender: "updatedAt" },
        },
        {
          dataIndex: "isNormal",
          title: this.$t('helpCenter.docManage.columns.isNormal'),
          scopedSlots: { customRender: "isNormal" },
          width:'80px'
        },
      ],
      actionColumn:{
        title: this.$t("public.action"),
        key: "action",
        align: "center",
        width: "220px",
        scopedSlots: { customRender: "action" },
      },
      loading:false,
      setDocVisible: false,
      editDocVisible:false,
      isReadOnly: false,
      editTitle:'',
      docId:'',
      appName:'',
      pubAppName:'',
      type:'',
      setingIdEdit: '0',
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total')+`:${total}` + this.$t('public.pagination.current') +`:${range[0]}-${range[1]}`,
      },
      langList:[],
      docLangList:[],
      menuTree:[],
      activeMenuId: '',
      activeParentId:'',
    }
  },
  created(){},
  mounted(){
    this.docId = this.$route.query.id || ''
    this.type = this.$route.query.type
    
    if(this.type == 'edit'){
      this.columns.push(this.actionColumn)
      this.appDocDetail()
      this.getSupportLangs()
    }  else {
      this.pubAppName = this.$route.query.name || ''
      this.getPubLangs()
    }
    
  },
  methods:{

    // 获取文档详情
    async appDocDetail(){
      const res = await appDocDetail({docId: this.docId})
      if(res.code !== 0 ) return
      this.appName = res.data?.apps?.map(item=>item.appName).join(',') || ''
    },

    // 切换菜单
    menuChange(data){
      this.activeMenuId = data.dirId
      this.activeParentId = data.parentId
      this.pagination.current = 1
      this.queryList()
    },

    // 获取菜单数据
    getTreeData(data){
      this.menuTree = data
    },

    // 重置筛选参数
    reset() {
      this.queryParam = {lang:this.queryParam.lang}
      this.pagination.current = 1
      this.queryList()
    },
    
    // 获取列表
    async queryList() {
      if(!this.activeParentId) return
      this.loading = true;
      const param = {
        ...this.queryParam, 
        docId:this.docId, 
        dirId:this.activeMenuId || this.activeParentId, 
        pageNum:this.pagination.current, 
        pageSize:this.pagination.pageSize
      }
      const res =this.type == 'edit' ?  await getEntryList(param) : await getPublishEntryList(param)
      this.loading = false;
      if (res.code !==0) return
      this.dataSource = res.data.list
      this.pagination.total = res.data.total
    },

    // 添加文档
    toggleAdd(){
      this.isReadOnly = false
      this.editTitle = this.$t('public.add')
      this.setingIdEdit = '0'
      this.editDocVisible = true
      
    },

    // 查看文档
    checkDetails(item){
      this.isReadOnly = true
      this.editTitle = this.$t('helpCenter.docManage.problem.detail')
      this.setingIdEdit = item.setingId
      this.editDocVisible = true
    },

    // 编辑文档
    editDoc(item){
      this.isReadOnly = false
      this.editTitle = this.$t('public.edit')
      this.setingIdEdit = item.setingId
      this.editDocVisible = true
    },

    // 设置文档
    configDoc(item){
      this.setingIdEdit = item.setingId
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
      this.$ConfirmModal(this, this.$t('helpCenter.docManage.delete.content'), this.$t('helpCenter.docManage.delete.title'),this.$t('public.sumit')).then(async() => {
        const res = await deleteEntry({setingId: item.setingId})
        if(res.code !== 0) return
        this.$message.success(this.$t('public.action.succeed'))
        this.queryList()
      })

    },

    // 获取支持语种
    async getSupportLangs(){
      const res = await getSupportLangs({docId:this.docId})
      if(res.code !== 0)return
      this.docLangList = res.data
      this.langList = res.data?.map((lang)=>{
        return {
          label: lang.langName,
          value: lang.lang,
        }
      })
    },

    // 获取公版语种
    async getPubLangs(){
      const res = await getPubLangs()
      if(res.code !== 0)return
      this.docLangList = res.data
      this.langList = res.data?.map(item => {
        return {
          value: item.lang,
          label: item.langName
        }
      });
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
@import "../../../../../global.less";
.page-wrap, /deep/.ant-page-header{
  height: 100%;
}
/deep/.ant-page-header-heading{
  border-bottom: 1px solid @aithings-border-color;
}
/deep/.ant-page-header-content{
  padding: 0;
  height: calc(100% - 65px);
}
.content-wrap,.catalog-wrap,.table-wrap{
  height: 100%;
}
.catalog-wrap{
  padding: 17px 0 17px 15px;
  width: 268px;
  overflow-y: auto;
  border-right: 1px solid @aithings-border-color;
  .title{
    text-indent: 5px;
  }
}
.table-wrap{
  flex: 1;
  overflow-y: auto;
  padding: 32px 20px;
  .title{
    color: @primary-color;
  }
}
</style>