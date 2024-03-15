<template>
  <section class="page-wrap">
    <a-page-header :title="$t('helpCenter.title')" >
      <div class="table-msg">{{$t('helpCenter.detail1')}}</div>
      <div class="table-msg">{{$t('helpCenter.detail2')}}</div>
      <!-- 表格操作栏 -->
      <div class="table-operator">
        <a-button type="primary" @click="toggleAdd" class="grean-button">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t('helpCenter.create.doc')}}
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
        :pagination="false"
      >
        <template slot="apps" slot-scope="text, record">
          {{getName(record.apps,'appName')}}
        </template>
        <template slot="langs" slot-scope="text, record">
          {{getName(record.langs,'langName')}}
        </template>
        <template v-slot:action="item">
          <a-button v-if="item.isPub === 2" type="link" size="small" @click="handleEdit(item.id)">
            {{$t('helpCenter.edit.info')}}
          </a-button>
          <a-divider v-if="item.isPub === 2" type="vertical" />
          <a-button v-if="item.isPub === 1" type="link" size="small" @click="handleCheck(item.id, item.name)">
            {{$t('helpCenter.check.doc')}}
          </a-button>
          <a-button v-if="item.isPub === 2" type="link" size="small" @click="handleManage(item.id)">
            {{$t('helpCenter.manage.doc')}}
          </a-button>
        </template>
      </a-table>
      <!-- /表格 -->
    </a-page-header>
    <create-help-doc :docId="docEditId" :visible="createVisible" @handleCancel="toggleAdd" @handleOk="sumitCreate"/>
  </section>
</template>
<script>
import CreateHelpDoc from './components/CreateHelpDoc.vue'
import { getAppDocList } from '@/api/helpCenter'

export default {
  name: "HelpCenter",
  components: {
    CreateHelpDoc
  },
  data() {
    return {
      columns: [
        {
          dataIndex: "name",
          title: this.$t('helpCenter.columns.name'),
        },
        {
          dataIndex: "apps",
          title: this.$t('helpCenter.columns.apps'),
          scopedSlots: { customRender: "apps" },
          width: "35%",
        },
        {
          dataIndex: "langs",
          title: this.$t('helpCenter.columns.langs'),
          scopedSlots: { customRender: "langs" },
        },
         {
          dataIndex: "answerCount",
          title: this.$t('helpCenter.columns.answerCount'),
          width: "80px",
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "190px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      createVisible:false,
      docEditId:''
    };
  },
  created() {
    this.queryList()
  },
  methods: {
    
    // 获取列表
    async queryList() {
      const res = await getAppDocList()
      if(res.code !== 0) return
      this.dataSource =  res.data
      // isPub是否公版 1 是公版, 2 不是公版
    },

    // 处理app名称/语言显示
    getName(list,key){
      if(!list) return ''
      return list.map(item=>item[key]).join(',')
    },

    // 新建文档
    toggleAdd(){
      this.createVisible = !this.createVisible
      this.docEditId = ''
    },

    // 确认新增
    sumitCreate(){
      this.createVisible = false
      this.queryList()
    },

    // 编辑信息
    handleEdit(id){
      this.docEditId = id
      this.createVisible = true
    },

    // 管理文档
    handleManage(id){
      this.$router.push({path:"/marketing/marketingService/helpCenter/docManage/index",query:{id, type:'edit'}})
    },

    // 查看文档
    handleCheck(id,name){
      this.$router.push({path:"/marketing/marketingService/helpCenter/docManage/index",query:{type:'public',id, name}})
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../../../global.less";

.table-msg{
  font-size: 14px;
  color: @aithings-text-color-gray;
  line-height: 20px;
  margin-bottom: 10px;
}
</style>
