<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="$t('setting.voiceControl.configScheme.title')" @back="back">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <h3>{{$t('setting.voiceControl.configScheme.subtitle.basicInfo')}}</h3>
        <p class="prompt">{{$t('setting.voiceControl.configScheme.prompt')}}</p>
        <section>
          <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <template v-if="voiceNo!=='google'">
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.voiceName')" prop="voiceName" >
                {{voiceName}}
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.voiceBrand')" prop="voiceBrand" >
                <a-input v-model="form.voiceBrand" :maxLength="50" :placeholder="$t('setting.voiceControl.configScheme.placeholder.voiceBrand')"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.voiceType')" prop="voiceType" >
                <a-input v-model="form.voiceType" :maxLength="100" :placeholder="$t('setting.voiceControl.configScheme.placeholder.voiceType')"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.voiceModel')" prop="voiceModel" >
                <a-input v-model="form.voiceModel" :maxLength="50" :placeholder="$t('setting.voiceControl.configScheme.placeholder.voiceModel')"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.voiceSkill')" prop="voiceSkill" >
                <a-input v-model="form.voiceSkill" :maxLength="50" :placeholder="$t('setting.voiceControl.configScheme.placeholder.voiceSkill')"/>
              </a-form-model-item>
            </template>
            <template v-if="voiceNo ==='google'">
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.voiceName')" prop="voiceName" >
                {{voiceName}}
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.voiceBrand')" prop="voiceBrand" >
                <a-input v-model="form.voiceBrand" :maxLength="50" :placeholder="$t('setting.voiceControl.configScheme.placeholder.voiceBrand')"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.voiceType')" prop="voiceType" >
                <a-select v-model="form.voiceType" :options="$DictList('google_voiceControl_deviceType')" :placeholder="$t('setting.voiceControl.configScheme.placeholder.voiceType')"></a-select>
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.voiceModel')" prop="voiceModel" >
                <a-input v-model="form.voiceModel" :maxLength="50" :placeholder="$t('setting.voiceControl.configScheme.placeholder.voiceModel')"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.projectName')" prop="projectName" >
                <a-input v-model="form.projectName" :maxLength="50" :placeholder="$t('setting.voiceControl.configScheme.placeholder.projectName')"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.projectId')" prop="projectId" >
                <a-input v-model="form.projectId" :maxLength="50" :placeholder="$t('setting.voiceControl.configScheme.placeholder.projectId')"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.secretUrl')" prop="secretUrl" >
                {{ form.secretName }}
                <upload-button 
                  accept="application/json"
                  :buttonText="$t('public.upload')"
                  :acceptList="['application/json']"
                  :limitSize="5"
                  :suffixValid="true"
                  warningFileType="json"
                  :showFile="false"
                  catalogName="google"
                  @uploaded="uploaded"
                />
              </a-form-model-item>
              <a-form-model-item :label="$t('setting.voiceControl.configScheme.label.invocation')" prop="invocation" >
                <a-input v-model="form.invocation" :maxLength="50" :placeholder="$t('setting.voiceControl.configScheme.placeholder.invocation')"/>
              </a-form-model-item>
            </template>
            
          </a-form-model>
        </section>
        <div class="flex y-axis-center x-space-between title-wrap">
          <h3>{{$t('setting.voiceControl.configScheme.subtitle.functions')}}</h3>
          <a-button class="add-function" @click="handleAdd">{{$t('setting.voiceControl.configScheme.addFunction.button')}}</a-button>
        </div>
        
      <!-- 表格 -->
      <a-table
        size="small"
        rowKey="attrCode"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="false"
      >
        <template slot="attrCode" slot-scope="text, record" >
          <p>{{$t('setting.voiceControl.configScheme.text.props')}}{{record.attrCode}}</p>
          <template v-if="record.valueMap && record.valueType === 2">
            <template v-for="(item,index) in record.valueMap">
              <p v-if="!isNull(item.val)" :key="index">{{$t('setting.voiceControl.configScheme.text.propsValue')}}{{item.val}}</p>
              <template v-if="record.dataType=='INT' || record.dataType=='DOUBLE' || record.dataType=='FLOAT'">
                <p :key="index">
                  {{$t('setting.voiceControl.editFunction.min')}}：{{item.min}}
                  {{$t('setting.voiceControl.editFunction.max')}}：{{item.max}}
                  <template v-if="item.step">
                    {{$t('setting.voiceControl.editFunction.step')}}：{{item.step}}
                  </template>
                  <template v-if="item.unit">
                    {{$t('setting.voiceControl.editFunction.unit')}}{{$DictName('properties_unit', item.unit) || item.unit}}
                  </template>
                </p>
              </template>
            </template>
          </template>
          <template v-if="record.valueMap && record.valueType === 1">
            <p>{{$t('setting.voiceControl.editFunction.min')}}：{{record.valueMap.min}}</p>
            <p>{{$t('setting.voiceControl.editFunction.max')}}：{{record.valueMap.max}}</p>
            <p v-if="!isNull(record.valueMap.step)">{{$t('setting.voiceControl.editFunction.step')}}：{{record.valueMap.step}}</p>
            <p v-if="record.valueMap.unit">{{$t('setting.voiceControl.editFunction.unit')}}{{$DictName('properties_unit', record.valueMap.unit) || record.valueMap.unit}}</p>
          </template>
        </template>
        <template slot="voiceCode" slot-scope="text, record">
          <p>{{$t('setting.voiceControl.configScheme.text.props')}}{{record.voiceCode}}</p>
          <template v-if="record.valueMap && record.valueType === 2">
            <template v-for="(item,index) in record.valueMap">
              <p  v-if="!isNull(item.voiceVal) || !isNull(item.voiceValSynonym)" :key="index">
                <template  v-if="!isNull(item.voiceVal)">
                  {{$t('setting.voiceControl.configScheme.text.propsValue')}}{{item.voiceVal}}
                </template>
                <template  v-if="!isNull(item.voiceValSynonym)">
                  {{$t('setting.voiceControl.configScheme.text.voiceValSynonym')}}{{item.voiceValSynonym}}
                </template>
              </p>
              <template v-if="record.vDataType=='INT' || record.vDataType=='DOUBLE' || record.vDataType=='FLOAT'">
                <p :key="index">
                  {{$t('setting.voiceControl.editFunction.min')}}：{{item.vMin}}  
                  {{$t('setting.voiceControl.editFunction.max')}}：{{item.vMax}}  
                  <template v-if="!isNull(item.vStep)">
                    {{$t('setting.voiceControl.editFunction.step')}}：{{item.vStep}}
                  </template>
                  <template v-if="item.vUnit">
                    {{$t('setting.voiceControl.editFunction.unit')}}{{$DictName('properties_unit', item.vUnit) || item.vUnit}}
                  </template>
                </p>
              </template>
            </template>
            
          </template>
          <template v-if="record.valueMap && record.valueType === 1">
            <p>{{$t('setting.voiceControl.editFunction.min')}}：{{record.valueMap.vMin}}</p>
            <p>{{$t('setting.voiceControl.editFunction.max')}}：{{record.valueMap.vMax}}</p>
            <p v-if="record.valueMap.vStep">{{$t('setting.voiceControl.editFunction.step')}}：{{record.valueMap.vStep}}</p>
            <p v-if="record.valueMap.vUnit">{{$t('setting.voiceControl.editFunction.unit')}}{{$DictName('properties_unit', record.valueMap.vUnit) || record.valueMap.vUnit}}</p>
          </template>
        </template>

        <template slot="voiceDemo" slot-scope="text, record">
          <template v-if="record.voiceDemo">
            <p v-for="(item,index) in record.voiceDemo.split('\n')" :key="index">{{item}}</p>
          </template>
          
        </template>
        <template slot="action" slot-scope="text, record, index">
          <a-button type="link" size="small" @click="handleEdit(record,index)">{{$t('public.Modify')}}</a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" @click="handleDelete(index)">{{$t('public.delete')}}</a-button>
        </template>
      </a-table>
      </section>
      <footer>
        <a-button class="back-btn" @click="back">{{$t('public.back')}}</a-button>
        <a-button class="verify-guide-btn" @click="toVerifyGuide">{{$t('setting.voiceControl.configScheme.verifyGuide')}}</a-button>
        <a-button type="primary" @click="handleSave">{{$t('public.save')}}</a-button>
      </footer>
    </a-page-header>
    <edit-function 
      :visible="editVisible" 
      :data="editData" 
      :type="editType" 
      :functionList="functionList"
      @cancel="cancelEdit" 
      @sumit="sumitEdit"
      />
    <edit-function-google 
      :visible="editGoogleVisible" 
      :data="editData" 
      :type="editType" 
      :functionList="functionList"
      @cancel="cancelEdit" 
      @sumit="sumitEdit"
    />
 </section>
</template>

<script>
import EditFunction from "../EditFunction.vue"
import EditFunctionGoogle from "../EditFunctionGoogle.vue";
import { getVoiceConfigDetail, saveVoiceConfig, getFuncList } from "@/api/product"
import UploadButton from "@/components/uploadButton"
import { isNull } from '@/utils/util'

export default {
  name: "ConfigScheme",
  components:{
    EditFunction,
    EditFunctionGoogle,
    UploadButton
  },

  data() {
    return {
      form: {},
      rules: {
        voiceBrand: [{ required: true, message: this.$t('setting.voiceControl.configScheme.message.voiceBrand'), trigger: '' }],
        voiceModel: [{ required: true, message: this.$t('setting.voiceControl.configScheme.message.voiceModel'), trigger: '' }],
        voiceSkill: [{ required: true, message: this.$t('setting.voiceControl.configScheme.message.voiceSkill'), trigger: '' }],
        projectName:[{ required: true, message: this.$t('setting.voiceControl.configScheme.message.projectName'), trigger: '' }],
        projectId:[{ required: true, message: this.$t('setting.voiceControl.configScheme.message.projectId'), trigger: '' }],
        secretUrl:[{ required: true, message: this.$t('setting.voiceControl.configScheme.message.secretUrl'), trigger: '' }],
        invocation:[{ required: true, message: this.$t('setting.voiceControl.configScheme.message.invocation'), trigger: '' }],
      },
      dataSource:[],
      columns: [
        {
          dataIndex: "funName",
          title: this.$t('setting.voiceControl.configScheme.columns.funName'),
          width: '10%',
        },
        {
          dataIndex: "attrCode",
          title: this.$t('setting.voiceControl.configScheme.columns.props'),
          scopedSlots: { customRender: "attrCode" },
          width: '30%',
        },
        {
          dataIndex: "voiceCode",
          title: this.$t('setting.voiceControl.configScheme.columns.voiceProps'),
          scopedSlots: { customRender: "voiceCode" },
          width: '30%',
        },
        {
          dataIndex: "voiceDemo",
          title: this.$t('setting.voiceControl.configScheme.columns.voiceDemo'),
          width: '40%',
          scopedSlots: { customRender: "voiceDemo" },
        },
        {
          title: this.$t("public.action"),
          dataIndex: 'action',
          align: "left",
          width: "180px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loading: false,
      productId:'',
      productName:'',
      productKey:'',
      id:'',
      voiceNo:'',
      voiceName: '',
      editVisible: false,
      editData:{},
      editType:'add',
      editIndex: 0,
      editGoogleVisible:false,
      configedFunc:[],
      functionList:[],
      isNull:isNull
    };
  },

  async created() {
    this.productId = this.$route.query.productId
    this.productKey = this.$route.query.productKey
    this.id = this.$route.query.id
    this.voiceNo = this.$route.query.voiceNo
    this.voiceName = this.$route.query.voiceName
    this.productName = this.$route.query.productName
    if(this.voiceNo == 'google'){
      this.rules['voiceType'] = [{ required: true, message: this.$t('setting.voiceControl.configScheme.message.google.voiceType'), trigger: 'change' }]
    } else {
      this.rules['voiceType'] = [{ required: true, message: this.$t('setting.voiceControl.configScheme.message.voiceType'), trigger: 'change' }]
    }
    if(this.id){
      await this.getDetails()
    }
    this.getFuncList()
  },

  methods: {
    // 获取详情
    async getDetails(){
      const res = await getVoiceConfigDetail({ ProductVoiceId: this.id })
      if(res.code !== 0) return
      this.form = res.data
      this.dataSource = res.data?.attrList?.map(item => {
        return {
          ...item,
          valueMap: item.valueMap ? JSON.parse(item.valueMap) : null,
        }
      }) || []
    },

    // 获取功能指令列表
    async getFuncList(){
      const res = await getFuncList({productId:this.productId, custom: -1})
      if(res.code !==0) return
      this.functionList = res.data?.list?.map(item=>{
        return {
          label: `${item.name}（${item.identifier}）`,
          name:item.name,
          value: item.identifier,
          dataType:item.dataType,
          dataSpecsList: item.dataSpecsList,
          dataSpecs: item.dataSpecs,
          attrDpid: item.dpid,
        }
      }) || []
    },

    // 设置功能是否配置
    changeFuncList(){
      this.functionList = this.functionList.map(item=>{
        const isConfig = this.configedFunc.some(dpid=> dpid === item.attrDpid)
        return {...item,disabled:isConfig}
      })
    },

    // 添加
    handleAdd(){
      this.editType = 'add'
      this.editData = {}
      this.configedFunc = this.dataSource.map(item => item.attrDpid) || []
      this.changeFuncList()
      if(this.voiceNo ==='google'){
        this.editGoogleVisible = true
      } else {
        this.editVisible = true
      }
    },

    // 修改
    handleEdit(data, index){
      this.editType = 'edit'
      this.editIndex = index
      this.editData = {...data}
      this.configedFunc = this.dataSource.map(item => item.attrDpid) || []
      this.configedFunc.splice(index, 1)
      this.changeFuncList()
      if(this.voiceNo ==='google'){
        this.editGoogleVisible = true
      } else {
        this.editVisible = true
      }
      
    },

    // 删除
    handleDelete(index){
      this.dataSource.splice(index, 1)
    },

    // 跳转验证引导
    toVerifyGuide(){
      this.$router.push({ path: '/product/product/setting/voiceControl/verifyGuide/index', query: { voiceNo: this.voiceNo } })
    },

    // 保存
    handleSave(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        if(this.dataSource.length === 0){
          // 语音功能至少需要配置一条
          this.$message.error(this.$t('setting.voiceControl.configScheme.save.validate'))
          return
        }
        const params = {
          productVoiceId: this.id,
          voiceNo: this.voiceNo,
          voiceName: this.voiceName,
          productKey: this.productKey,
          productName: this.productName,
          ...this.form,
          attrList: this.dataSource.map(item =>{
            return {
              ...item,
              valueMap: JSON.stringify(item.valueMap)
            }
          })
        }
        const res = await saveVoiceConfig(params)
        if( res.code !== 0 ) return
        this.$message.success(this.$t('public.save.ok'))
        this.$router.push({ 
            path: '/product/product/setting/voiceControl/configScheme/index', 
            query: { 
              productId: this.productId, 
              productKey: this.productKey, 
              id: res.data, 
              voiceNo: this.voiceNo, 
              voiceName: this.voiceName, 
              productName: this.productName
            } 
          })
      })
    },

    // 取消编辑
    cancelEdit(){
      this.editVisible = false
      this.editGoogleVisible = false
    },

    // 确认编辑
    sumitEdit(data){
      this.editVisible = false
      this.editGoogleVisible = false
      if(data.type == 'add'){
        this.dataSource.push(data.data)
      } else {
        this.dataSource.splice(this.editIndex, 1, data.data)
      }
    },

    // 上传
    uploaded(data){
      this.$set(this.form,'secretUrl',data.fullPath)
      this.$set(this.form,'secretName',data.name)
      this.$refs["form"].clearValidate(['secretUrl']);
    },

    // 返回
    back(){
      this.$router.push({ path: '/product/product/setting/index', name:'Setting', query: { productId: this.productId }, params:{ tab: 4 } })
    }
    
  },
};
</script>
<style lang="less" scoped>
  @import "../../../../../../global.less";
  @import "../../../../../../utils/utils.less";

  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 20px;
  }
  .prompt{
    padding-top: 10px;
    color: @aithings-warning-color-FF8E35;
  }
  .ant-form{
    padding: 30px 0 20px;
    width: 100%;
    max-width: 500px;
    .ant-form()
  }
  .add-function{
    color: @primary-color;
    border: 1px solid @primary-color;
  }
  .page-wrap,.ant-page-header{
    height: 100%;
  }
  /deep/.ant-page-header-content{
    height: calc(100% - 65px);
    position: relative;
  }
  .content{
    height: calc(100% - 80px);
    overflow-y: auto;
  }
  .title-wrap{
    padding-bottom: 14px;
  }
  footer{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: #FFFFFF;
    box-shadow: 0px -1px 14px 0px rgba(131,146,167,0.16);
    border-radius: 0px 0px 4px 4px;
    /deep/.ant-btn{
      width: 120px;
    }
    .ant-btn+.ant-btn{
      margin-left: 20px;
    }
    .back-btn{
      color: @aithings-text-color-gray;
      border-color: @aithings-text-tips-color;
    }
    .verify-guide-btn{
      color: @primary-color;
      border-color: @primary-color;
    }
  }
</style>
