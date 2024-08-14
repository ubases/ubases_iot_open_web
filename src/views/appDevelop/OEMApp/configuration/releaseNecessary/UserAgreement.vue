<template>
  <section class="page-content">
    <h4 class="title" v-text="type[contentType].tips"></h4>
    <section class="flex y-axis-center">
      <p>{{$t('UserAgreement.reference.template')}}：</p>
      <template v-if="templateLink.length > 0">
        <a class="template-link" target="_blank" v-for="item in templateLink" :href="item.url" :key="item.lang">{{$FilterLabel(langTypeOptions,item.lang,'code','name')}}</a>
      </template>
      <template v-else>{{$t('public.not.available')}}</template>
    </section>
    <div class="table-operator flex y-axis-center x-space-between">
      <a-button :disabled="editDisabled" type="primary" @click="handleAdd" class="grean-button">
        <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
        {{$t('UserAgreement.add.version')}}
      </a-button>
      <a-button type="link" @click="getLink">{{$t('UserAgreement.getLink')}}</a-button>
    </div>
    <!-- 表格 -->
    <a-table
      size="small"
      rowKey="version"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="false"
    >
      <span slot="remindMode" slot-scope="remindMode">
        {{ $DictName("protocol_remind_type",remindMode) }}
      </span>
      <span slot="createdAt" slot-scope="createdAt">
        {{ createdAt | momentFilter }}
      </span>
      <span slot="updatedAt" slot-scope="updatedAt">
        {{ updatedAt | momentFilter }}
      </span>
      <span slot="status" slot-scope="text, record" :style="{color:statusTextColor[record.status]}">
        {{$DictName('user_agreement_status',record.status)}}
      </span>
      <template v-slot:action="record">
        <a-button v-if="record.status == 2" :disabled="editDisabled" type="link" size="small" @click="handleEnable(record)">
          {{$t('public.enable')}}
        </a-button>
        <a-divider v-if="record.status == 2" type="vertical" />
        <a-button v-if="record.status == 2" :disabled="editDisabled" type="link" size="small" @click="handleEdit(record)">
          {{$t("public.edit")}}
        </a-button>
        <a-button v-if="record.status != 2" type="link" size="small"  @click="handleCheck(record)">
          {{$t('public.view')}}
        </a-button>
        <a-divider type="vertical" />
        <a-button :disabled="editDisabled" type="link" size="small" @click="handleCopy(record)">
          {{$t("public.copy")}}
        </a-button>
      </template>
    </a-table>
    <!-- 添加版本 -->
    <a-modal
      :title="$t('UserAgreement.add.version')"
      :visible="visible"
      :width="520"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="versionForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{span: 18}">
          <a-form-model-item prop="version" :label="$t('UserAgreement.label.version')">
            <section class="flex y-axis-center">
              <a-input v-model="form.version" :placeholder="$t('UserAgreement.placeholder.version')" :maxLength="12" class="item-input"/>
              <p class="item-tips">{{$t('UserAgreement.version.tips')}}</p>
            </section>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
    <!-- 编辑文档 -->
    <editor 
    :visible="editorVisible" 
    :title="type[contentType].title" 
    :data="editorData" 
    :readOnly="readOnly"
    :editType ="editType"
    :contentType="contentType"
    @cancel="editorCancel"
    @sumit="editorSumit" 
    />

    <!-- 获取协议链接 -->
    <a-modal
      :title="$t('UserAgreement.link')"
      :visible="linkVisible"
      :width="520"
      @cancel="handleLinkCancel"
    >
      <a-form-model ref="form" :label-col="{ span: 5 }" :wrapper-col="{span: 18}">
        <a-form-model-item :label="$DictName('language_type',item.lang)" v-for="(item,index) in linkList" :key="index"> 
          {{item.url}}
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button key="back" @click="handleLinkCancel">{{$t('public.close.text')}}</a-button>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { VersionRules} from "@/utils/validate"
import Editor from "../component/Editor.vue"
import { getAppDocumentList, enableAppDocument, checkAppDocumentVersion,getAppDocumentLink,getAppDocumentTemplate,copyAppDocumentVersion } from "@/api/appExploit"
import { langTypeList } from '@/api/common'

export default {
  props:{
    contentType:{ type:Number, default :1 }, // 1 用户协议,2隐私政策,3关于我们
    appId:{ type:String, default:'' },
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false}, 
  },
  components:{
    Editor
  },
  data (){
    return {
      type:{
        1:{ tips: this.$t('UserAgreement.tips.1'), title: this.$t('UserAgreement.title.1')},
        2:{ tips: this.$t('UserAgreement.tips.2'), title: this.$t('UserAgreement.title.2')},
        3:{ tips: this.$t('UserAgreement.tips.3'), title: this.$t('UserAgreement.title.3')},
      },
      statusTextColor:{
        1: '#38CB52',
        2: '#70757D',
        3: '#FF3333',
      },
      dataSource:[],
      columns:[
        {
          dataIndex: "version",
          title: this.$t('UserAgreement.columns.version'),
        },
        {
          dataIndex: "createdAt",
          title: this.$t('UserAgreement.columns.createdAt'),
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          dataIndex: "updatedAt",
          title: this.$t('UserAgreement.columns.updatedAt'),
          scopedSlots: { customRender: 'updatedAt' }
        },
        {
          dataIndex: "langCount",
          title: this.$t('UserAgreement.columns.langCount'),
        },
        this.contentType != 3 ?{
          dataIndex: "remindMode",
          title: this.$t('UserAgreement.columns.remindType'),
          scopedSlots: { customRender: 'remindMode' }
        } : {width:0},
        {
          dataIndex: "status",
          title: this.$t('UserAgreement.columns.status'),
          key: "status",
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t("public.action"),
          key: "action",
          width: "260px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loading:false,
      visible:false,
      confirmLoading:false,
      form:{},
      rules:{
        version: VersionRules(),
      },
      editorTitle:'',
      editorVisible: false,
      editorData:{},
      readOnly:false,
      editType:'',
      linkVisible:false,
      linkList:[],
      templateLink:[
        {
          link:'',
          langName:'zh'
        },{
          link:'',
          langName:'en'
        },
      ],
      langTypeOptions:[]
    }
  },
  mounted(){
    this.getAppDocumentList()
    this.getAppDocumentTemplate()
  },
  methods:{
    // 获取文档列表
    async getAppDocumentList(){
      const res = await getAppDocumentList({contentType: this.contentType, appId:this.appId})
      if (res.code !== 0) return
      this.dataSource = res.data
    },

    
    async getAppDocumentTemplate(){
      // 获取语言列表
      const res = await langTypeList()
      if(res.code !== 0)return
      this.langTypeOptions = res.data || []
      // 获取文档模板
      const res1 = await getAppDocumentTemplate({contentType: this.contentType})
      if (res1.code !== 0) return
      this.templateLink = res1.data
    },

    // 新增版本
    handleAdd(){
      this.editType = 'add'
      this.form = {}
      this.visible = true
    },

    handleCancel(){
      this.$refs.versionForm?.resetFields()
      this.visible = false
    },

    // 新增确定
    handleOk(){
      this.$refs.versionForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const params = {appId:this.appId, version:this.form.version ,contentType:this.contentType}
        const res = await checkAppDocumentVersion(params)
        this.confirmLoading = false
        if(res.code !==0) return
        if(!res.data) {
          this.$message.info(this.$t('UserAgreement.existed.version'))
           return false
        }
        // 显示编辑弹窗
        
        if(this.editType == 'add'){
          this.editorData = {...params,appId:this.appId}
        } else {
          const res1 = await copyAppDocumentVersion({appId:this.appId, newVersion:this.form.version, oldVersion:this.editorData.oldVersion })
          if(res1.code !==0) return
          this.editorData = {...this.editorData, version:this.form.version}
        }
        this.$refs.versionForm?.resetFields()
        this.visible = false
        this.readOnly = false
        this.editorVisible = true
      });
    },

    // 启用
    async handleEnable(data){
      const {appId, version, contentType} = data
      const res = await enableAppDocument({appId, version, contentType})
      if(res.code !==0) return
      this.$message.info(this.$t('UserAgreement.enabled.succeed'))
      this.getAppDocumentList()
    },

    // 编辑
    handleEdit(data){
      //赋值
      this.editorData = {...data}
      this.editType = 'edit'
      this.readOnly = false
      this.editorVisible = true
    },

    // 取消编辑
    editorCancel(){
      this.editorVisible = false
    },

    // 确认编辑
    editorSumit(){
      this.getAppDocumentList()
      this.editorVisible = false
    },

    // 查看
    handleCheck(data){
      this.editorData = {...data}
      this.editType = 'check'
      this.readOnly = true
      this.editorVisible = true
    },

    // 复制
    handleCopy(data){
      this.form = {}
      this.editorData = {...data, oldVersion: data.version}
      this.editType = 'copy'
      this.readOnly = false
      this.visible = true
    },
    
    // 获取链接地址
    async getLink(){
      const res = await getAppDocumentLink({appId:this.appId,contentType:this.contentType})
      if(res.code !== 0) return
      this.linkList = res.data
      this.linkVisible = true
    },

    // 关闭连接弹窗
    handleLinkCancel(){
      this.linkVisible = false
    }
  }

}
</script>

<style scoped lang="less">
@import "../../../../../global.less";
.page-content{
  padding: 20px;
}
.template-link{
  padding: 0 10px;
  color: @primary-color;
}
.title{
  padding: 0 0 2px;
  font-size: 15px;
  line-height: 21px;
}
.tips{
  padding-bottom: 10px;
  color: @aithings-warning-color-FF8E35;
}
.item-input{
  width:50%
}
.item-tips{
  padding-left: 20px;
  font-size: 12px;
  color: @aithings-text-tips-color;
}
.grean-button:disabled{
  opacity: 0.4;
  color: #fff;
}
</style>