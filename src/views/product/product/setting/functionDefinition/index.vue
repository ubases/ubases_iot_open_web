<template>
  <section>
    <div class="flex y-axis-center x-space-between count-wrap">
      <div class="flex y-axis-center count">
        <div>{{$t('setting.function.definition.title')}}</div>
        <div class="num">{{ regularData.length + $t('public.unit.pieces') }}</div>
        <a-divider type="vertical" />
        <div>{{$t('setting.function.definition.custom.title')}}</div>
        <div class="num">{{ customizeData.length + $t('public.unit.pieces') }}</div>
      </div>
      <a-button :disabled="regularData.length==0 && customizeData.length == 0" @click="handleExport">{{$t('setting.function.definition.export.btn')}}</a-button>
    </div>
    <!-- 标准功能点 -->
    <section class="flex y-axis-center x-space-between card-header">
      <span class="title">{{$t('setting.function.definition.title')}}</span>
      <div>
        <a-button v-if="status == 2" class="reset-btn" @click="resetRequiredFunc">{{ $t('setting.function.definition.reset.required') }}</a-button>
        <a-button v-if="status == 2" @click="addStandard">{{$t('setting.function.definition.addStandard')}}</a-button>
      </div>
    </section>
    <a-table
      rowKey="id"
      size="small"
      :data-source="regularData"
      :columns="columns"
      :loading="regularLoading"
      :pagination="false"
    >
      <template slot="required" slot-scope="required">
        {{$DictName('yes_no',required)}}
      </template>
      <template v-slot:action="record">
        <a-button type="link" size="small" @click="editFunction(record)">{{$t("public.edit")}}</a-button>
        <a-divider type="vertical"  v-if="record.required != 1"/>
        <a-button v-if="record.required != 1" type="link" size="small" @click="handleDelete(record,0)">{{$t("public.delete")}}</a-button>
      </template>
    </a-table>
    <!-- /标准功能点 -->

    <!-- 自定义功能点 -->
    <section class="flex y-axis-center x-space-between card-header">
      <span class="title">{{$t('setting.function.definition.custom.title')}}</span>
      <a-button v-if="status == 2" @click="addCustom">{{$t('setting.function.definition.addCustom')}}</a-button>
    </section>
    <a-table
      rowKey="id"
      size="small"
      :data-source="customizeData"
      :columns="columns"
      :loading="customLoading"
      :pagination="false"
    >
      <template slot="required" slot-scope="required">
        {{$DictName('yes_no',required)}}
      </template>
      <template v-slot:action="record" v-if="status == 2">
        <a-button type="link" size="small" @click="editFunction(record)">{{$t("public.edit")}}</a-button>
        <a-divider v-if="record.required != 1" type="vertical" />
        <a-button v-if="record.required != 1" type="link" size="small" @click="handleDelete(record,1)">{{$t("public.delete")}}</a-button>
      </template>
    </a-table>
    <!-- /自定义功能点 -->

    <!-- 新建/编辑标准功能弹窗 -->
    <add-standard-function 
      :productId="productId" 
      :baseProductId="baseProductId"
      :list="addStandardFunction" 
      :visible="standardModalVisible" 
      @confirmEdit="confirmStandardAdd" 
      @cancelEdit="cancelStandardAdd" />
    <!-- 新建/编辑自定义功能弹窗 -->
    <edit-function :productId="productId" :data="editFunctionData" :visible="customModalVisible" @confirmEdit="confirmEdit" @cancelEdit="cancelEdit" />
  </section>
</template>

<script>
import EditFunction from "./EditFunction.vue"
import AddStandardFunction from "./AddStandardFunction.vue"
import { getFuncList,deleteFunc,resetStandardFunc } from '@/api/product'
import { isNull } from "@/utils/util"

export default ({
  name: "FunctionDefinition",
  props:{
    status: { type: Number, default: 0 },
    productId: { type: String, default: '' },
    baseProductId: { type: String, default: '' },
    activeTab: { type: Number, default: 0 },
    details: { type: Object, default: {}}
  },
  components:{
    EditFunction,
    AddStandardFunction
  },
  data() {
    return {
      columns: [
        {
          dataIndex: "dpid",
          title: this.$t('setting.function.definition.columns.dpid'),
          width: '60px'
        },
        {
          dataIndex: "name",
          title: this.$t('setting.function.definition.columns.name'),
          width: '80px'
        },
        {
          dataIndex: "required",
          title: this.$t('setting.function.definition.columns.required'),
          scopedSlots: { customRender: "required" },
          width: '50px'
        },
        {
          dataIndex: "identifier",
          title: this.$t('setting.function.definition.columns.identifier'),
        },
        {
          dataIndex: "rwFlagDesc",
          title: this.$t('setting.function.definition.columns.rwFlagDesc'),
          width: '130px'
        },
        {
          dataIndex: "dataTypeDesc",
          title: this.$t('setting.function.definition.columns.dataTypeDesc'),
        },
        {
          dataIndex: "dataSpecsDesc",
          title: this.$t('setting.function.definition.columns.dataSpecsDesc'),
          width:'30%'
        },
        {
          dataIndex: "defaultValText",
          title: this.$t('setting.function.definition.columns.defaultVal'),
          width: '60px'
        },
       
      ],
      regularData: [],
      customizeData:[],
      regularLoading: false,
      customLoading: false,
      customModalVisible:false,
      editFunctionData: {},
      standardModalVisible:false,
      addStandardFunction:[],
    }
  },
  mounted(){
    // 是否显示操作项
    this.actionShow(this.status)
  },
  watch:{
    status (val){
      // 是否显示操作项
      this.actionShow(val)
    },
    productId(val){
      if(!val) return
      this.getFuncList(0)
      this.getFuncList(1)
      
    },
    activeTab(val){
      if(val !== 0) return
      this.getFuncList(0)
      this.getFuncList(1)
    }
  },
  methods:{

    // 导出功能
    handleExport(){
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/open/product/thingModels/export`,
          productId: this.productId
        },
        this.details.name + this.$t('setting.thingModels') + ".xlsx",
        "get"
      );

    },
    // 获取功能列表
    async getFuncList(custom){
      // 0 标准功能 =1 自定义功能
      const res = await getFuncList({productId:this.productId, custom})
      if(res.code !==0) return
      if(custom == 1) {
        this.customizeData = this.dealList(res.data?.list || [])
      } else{
        this.regularData = this.dealList(res.data?.list || [])
      }
    },

    // 处理列表数据
    dealList(list){
      return list.map(item=>{
          if(item.dataType == 'ENUM' && !isNull(item.defaultVal) ){
            const dataSpecsList = JSON.parse(item.dataSpecsList)
            const defaultValText = dataSpecsList.filter(t=>t.value == item.defaultVal)?.pop()?.name || ''
            return {
              ...item,
              defaultValText
            }
          }
          return {
            ...item,
            defaultValText:item.defaultVal
          }
        })
       
    },

    // 添加自定义功能点
    addCustom() {
      this.customModalVisible = true
      this.editFunctionData = {custom:1}
    },

    // 编辑自定义功能点
    editFunction(item) {
      if(item.notAllowEdit){
        this.$InfoModal(this, this.$t('setting.function.definition.notAllowEdit'),this.$t('public.prompt'))
        return
      }
      this.editFunctionData = {...item}
      this.customModalVisible = true
    },

    // 确认自定义编辑
    confirmEdit(type) {
      this.getFuncList(type)
      this.customModalVisible = false
    },

    // 取消自定义编辑
    cancelEdit() {
      this.customModalVisible = false
    },

    // 添加标准功能点
    addStandard() {
      this.addStandardFunction = [...this.regularData]
      this.standardModalVisible = true
    },

    // 确认标准新增
    confirmStandardAdd() {
      this.getFuncList(0)
      this.standardModalVisible = false
    },

    // 取消标准新增
    cancelStandardAdd() {
      this.standardModalVisible = false
    },

    //删除
    handleDelete(data,type) {
      this.$WarningModal(this, this.$t('setting.function.definition.isDelete.function')).then(async() => {
        const res = await deleteFunc({id:data.id, funcType:data.funcType, productId:this.productId})
          if(res.code !== 0) return
          if(res.data.showDeleteMsg){
            let platform = []
            const voiceData = res.data.voice
            const list = this.$DictList('oem_app_voice')
            Object.keys(voiceData).forEach(item=>{
              if(voiceData[item]){
                platform.push(list.filter(t=>t.value == item)?.pop()?.label)
              }
            })
            const text = this.$t('setting.function.definition.notAllowEdit')
            const text1 = this.$t('setting.function.definition.platform.relation',{platform:platform.join('、')})
            this.$ConfirmCustomModal(this, h=><div style="text-align:center;">{text}<br/>{text1}</div>,this.$t('public.prompt'),this.$t('setting.function.definition.tovoice.edit'),this.$t('public.close.text')).then(async() => {
              this.$emit('changeTab',4)
            },()=>{
              
            })
          } else {
            this.$message.info(this.$t('public.delete_success'))
            this.getFuncList(type)
          }
          
          
       })
    },
    // 表格是否需要操作项
    actionShow(val){
      const flag = this.columns.find(item=>item.key === 'action')
        if(val == 2 && !flag){
          this.columns.push({
            title: this.$t('public.action'),
            key: "action",
            align: "left",
            width: "130px",
            scopedSlots: { customRender: "action" },
          })
        } 
        if (val == 1 && flag) {
          this.columns.splice(-1,1)
        }
    },

    // 重置必选功能
    resetRequiredFunc(){
      this.$ConfirmModal(this, this.$t('setting.function.definition.reset.confirm.msg'), this.$t('setting.function.definition.reset.confirm.title')).then(async() => {
        const res = await resetStandardFunc({productId:this.productId})
          if(res.code !== 0) return
          this.$message.info(this.$t('public.action.succeed'))
          this.getFuncList(0)
       })
    }

  }
})
</script>

<style lang="less" scoped>
@import "../../../../../global.less";

.count-wrap{
  padding: 15px 20px;
  border: 1px solid @aithings-border-color;
  .count{
    flex: 1;
  }
  .num{
    padding: 0 0 0 50px;
  }
  .ant-divider-vertical{
    margin: 0 30px;
    height: 30px;
  }
  .ant-btn{
    border: 1px solid @primary-color;
    color: @primary-color;
  }
  .ant-btn[disabled]{
    background: @aithings-table-thread-color;
    border: 1px solid @aithings-border-color;
    color: @aithings-text-tips-color;
  }
}
  .card-header{
    padding: 30px 0 14px;
    .title{
      font-weight: 600;
      color: @aithings-text-color-black;
    }
    /deep/.ant-btn{
      border: 1px solid @primary-color;
      color: @primary-color;
    }
  }
  .reset-btn{
    margin-right: 20px;
  }
  table{
    max-width: 100%;
  }
</style>