<template>
  <a-modal
    :title="getTitle"
    :width="800"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="formData" class="regular-form" :model="formData" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item :label="$t('setting.ruleConfig.columns.ruleName')" prop="ruleName" >
          <a-input :disabled="type=='check'" v-model="formData.ruleName" class="rule-name" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.ruleConfig.columns.conditionType')" prop="conditionType" >
          <a-radio-group :disabled="type=='check'" v-model="formData.conditionType" :options="$DictList('rule_condition_type')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.ruleConfig.columns.if')" prop="ifSpecs" >
          <a-row :gutter="20" type="flex" align="middle" v-for="(item,index) in formData.ifSpecs" :key="index">
            <a-col :xs="24" :md="7">
              <a-select :disabled="type=='check'" v-model="item.dpId" :options="funcOptions" :placeholder="$t('setting.ruleConfig.placeholder')" @change="funcIfChange(item.dpId,index)"/>
            </a-col>
            <a-col :xs="24" :md="5" v-if="item.dpId">
              <a-select 
              :disabled="type=='check'"
              v-model="item.operate" 
              :options="ifOperateOptions[dataSource[item.dpId].dataType]" 
              :placeholder="$t('setting.ruleConfig.placeholder')" 
              @change="e=>dataChange('ifSpecs',index,'operate',e)"
              />
            </a-col>
            <a-col :xs="24" :md="7" v-if="item.operate && item.operate != 5">
              <a-select 
                :disabled="type=='check'"
                v-if="dataSource[item.dpId].dataType == 'BOOL' || dataSource[item.dpId].dataType == 'ENUM'" 
                v-model="item.value" 
                :options="dataSource[item.dpId].dataSpecsList" 
                :placeholder="$t('setting.ruleConfig.placeholder')" 
                @change="e=>dataChange('ifSpecs',index,'value',e)"
                />
              <a-input :disabled="type=='check'" v-if="dataSource[item.dpId].dataType == 'TEXT'" v-model="item.value" @input="dataChange('ifSpecs',index,'value',item.value)"/>
              <a-input-number 
              :disabled="type=='check'"
                v-if="dataSource[item.dpId].dataType == 'INT' || dataSource[item.dpId].dataType == 'FLOAT' || dataSource[item.dpId].dataType == 'DOUBLE'" 
                v-model="item.value" 
                :min="Number(dataSource[item.dpId].dataSpecs.min)" 
                :max="Number(dataSource[item.dpId].dataSpecs.max)" 
                :step="Number(dataSource[item.dpId].dataSpecs.step)" 
                :precision="dataSource[item.dpId].dataSpecs.dataType == 'INT'? 0 : 3"
                @change="e=>dataChange('ifSpecs',index,'value',e)"
                />
            </a-col>
            <a-col :xs="6" :md="3" v-if="type!=='check'">
              <div class="flex y-axis-center x-space-between">
                <span class="flex xy-axis-center" @click="handleAddIf"><icon-font type="icon-zengjia" style="color: #3b7cff; font-size: 24px;"/></span>
                <span class="flex xy-axis-center" v-if="formData.ifSpecs.length > 1" @click="handleDeleteIf(index)">
                  <icon-font type="icon-jianshao" style="color: #70757D; font-size: 24px;"/>
                </span>
              </div>
            </a-col>

          </a-row>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.ruleConfig.columns.then')" prop="thenSpecs" >
          <a-row :gutter="20" type="flex" align="middle" v-for="(item,index) in formData.thenSpecs" :key="index">
            <a-col :xs="24" :md="7">
              <a-select :disabled="type=='check'" v-model="item.dpId" :options="funcOptions" :placeholder="$t('setting.ruleConfig.placeholder')" @change="funcThenChange(item.dpId,index)"/>
            </a-col>
            <a-col :xs="24" :md="5" v-if="item.dpId">
              <a-select 
              :disabled="type=='check'"
              v-model="item.operate" 
              :options="$DictList('rule_then_operation')" 
              :placeholder="$t('setting.ruleConfig.placeholder')"
              @change="e=>dataChange('thenSpecs',index,'operate',e)"
               />
            </a-col>
            <a-col :xs="24" :md="7" v-if="item.operate && item.operate == 1">
              <!-- 禁用、可用不需要设置值 -->
              <a-select 
              :disabled="type=='check'"
                v-if="dataSource[item.dpId].dataType == 'BOOL' || dataSource[item.dpId].dataType == 'ENUM'"
                v-model="item.value" 
                :options="dataSource[item.dpId].dataSpecsList" 
                :placeholder="$t('setting.ruleConfig.placeholder')" 
                @change="e=>dataChange('thenSpecs',index,'value',e)"
                />
              <a-input :disabled="type=='check'" v-if="dataSource[item.dpId].dataType == 'TEXT'" v-model="item.value" @change="dataChange('thenSpecs',index,'value',item.value)"/>
              <a-input-number 
              :disabled="type=='check'"
                v-if="dataSource[item.dpId].dataType == 'INT' || dataSource[item.dpId].dataType == 'FLOAT' || dataSource[item.dpId].dataType == 'DOUBLE'" 
                v-model="item.value" 
                :min="Number(dataSource[item.dpId].dataSpecs.min)" 
                :max="Number(dataSource[item.dpId].dataSpecs.max)" 
                :step="Number(dataSource[item.dpId].dataSpecs.step)" 
                :precision="dataSource[item.dpId].dataSpecs.dataType == 'INT'? 0 : 3"
                @change="e=>dataChange('thenSpecs',index,'value',e)"
                />
            </a-col>
            <a-col :xs="6" :md="3" v-if="type!=='check'">
              <div class="flex y-axis-center x-space-between">
                <span class="flex xy-axis-center" @click="handleAddThen"><icon-font type="icon-zengjia" style="color: #3b7cff; font-size: 24px;"/></span>
                <span class="flex xy-axis-center" v-if="formData.thenSpecs.length > 1" @click="handleDeleteThen(index)">
                  <icon-font type="icon-jianshao" style="color: #70757D; font-size: 24px;"/>
                </span>
              </div>
            </a-col>
          </a-row>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">{{type=='check'? $t('public.close.text'):$t('public.cancel')}}</a-button>
      <a-button v-if="type!=='check'" key="submit" type="primary" @click="handleOk">{{$t('public.sumit')}}</a-button>
    </template>
  </a-modal>
</template>
<script>
import { isNull } from "@/utils/util"
import { addRuleSet, editRuleSet } from '@/api/ruleConfig'
export default ({
  name:"EditRule",
  props:{
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'add' }, //  add 新增， edit 编辑, check 查看
    productId: { type: String, default: '' },
    productKey: { type: String, default: '' },
    detail: { type: Object, default: ()=>{}},
    funcOptions: { type: Array, default: ()=>[]},
    dataSource: { type: Object, default: ()=>{}},
    dataOrigin: { type: Number, default:1}
  },

  data () {
    return {
      confirmLoading:false,
      formData:{
        ifSpecs:[{}],
        thenSpecs:[{}]
      },
      rules: {
        ruleName: [{required: true,message: this.$t('setting.ruleConfig.columns.ruleName.rule'),trigger: 'change'}],
        conditionType:[{required: true,message: this.$t('setting.ruleConfig.columns.ruleName.conditionType'),trigger: 'change'}],
        ifSpecs:[
          {required: true,message: this.$t('setting.ruleConfig.columns.if.rule'),trigger: 'change'},
          {validator:this.ifValidator, trigger: 'change'}
        ],
        thenSpecs:[
          {required: true,message: this.$t('setting.ruleConfig.columns.then.rule'),trigger: 'change'},
          {validator:this.thenValidator, trigger: 'change'}
        ]
      },
      ifOperateOptions:{
        'BOOL':[{label:this.$t('public.equal'), value:1},{label:this.$t('public.arbitrary.value'), value:5}],
        'INT':[{label:this.$t('public.greater.than'), value:3},{label:this.$t('public.equal'), value:1},{label:this.$t('public.less.than'), value:4},{label:this.$t('public.arbitrary.value'), value:5}],
        'FLOAT':[{label:this.$t('public.greater.than'), value:3},{label:this.$t('public.equal'), value:1},{label:this.$t('public.less.than'), value:4},{label:this.$t('public.arbitrary.value'), value:5}],
        'DOUBLE':[{label:this.$t('public.greater.than'), value:3},{label:this.$t('public.equal'), value:1},{label:this.$t('public.less.than'), value:4},{label:this.$t('public.arbitrary.value'), value:5}],
        'ENUM':[{label:this.$t('public.equal'), value:1},{label:this.$t('public.unequal'), value:2},{label:this.$t('public.arbitrary.value'), value:5}],
        'TEXT':[{label:this.$t('public.equal'), value:1}],
      },
    }
  },
  computed:{
    getTitle(){
      if(this.type == "add"){
        return this.$t('setting.ruleConfig.addRule.btn')
      } else if(this.type == "edit"){
        return this.$t('setting.ruleConfig.editRule.btn')
      } else if(this.type == "check"){
        return this.$t('setting.ruleConfig.checkRule.btn')
      }
    },
  },
  watch: {
    async visible(val){
      if(!val) return
      this.$refs.formData?.resetFields()
      if(this.type !=='add'){
        const data = this.$deepClone(this.detail)
        this.formData = { ...data, conditionType: `${data.conditionType}`}
      } else {
        this.formData = {
          ifSpecs:[{dpId:null, operate:null, value:null}],
          thenSpecs:[{dpId:null, operate:null, value:null}],
          dataOrigin:this.dataOrigin
        }
      }
    },
  },
  mounted(){

  },
  methods:{
   

    handleOk() {
      this.$refs.formData.validate(async(valid) => {
        if (!valid) return
        
        this.confirmLoading = true
        let res = this.type=='edit' 
        ? await editRuleSet({...this.formData,conditionType:Number(this.formData.conditionType), ifSpecs:JSON.stringify(this.formData.ifSpecs), thenSpecs:JSON.stringify(this.formData.thenSpecs)}) 
        : await addRuleSet({...this.formData,conditionType:Number(this.formData.conditionType), ifSpecs:JSON.stringify(this.formData.ifSpecs), thenSpecs:JSON.stringify(this.formData.thenSpecs), productId:this.productId, productKey:this.productKey, status:2})  // status 1 启动 2停用
        this.confirmLoading = false
        if(res.code !==0 ) return
        this.$emit("handleOk")
        
      });
    },
    handleCancel() {
      this.$emit("handleCancel")
    },

    // 新增条件
    handleAddIf(){
      this.formData.ifSpecs.push({})
    },

    // 删除条件
    handleDeleteIf(index){
      this.formData.ifSpecs.splice(index,1)
      this.handleValidate('ifSpecs')
      this.handleValidate('thenSpecs')
    },

    // 条件的功能变化
    funcIfChange(dpId,index){
      const data = this.dataSource[dpId]
      if(!this.formData.ifSpecs[index].operate){
        this.formData.ifSpecs[index].operate = 1
      }
      if(data.dataType == 'ENUM' || data.dataType == 'BOOL'){
        this.formData.ifSpecs[index].value = data.dataSpecsList[0]?.value || 0
      } else if(data.dataType == 'INT' || data.dataType == 'FLOAT' || data.dataType == 'DOUBLE'){
        this.formData.ifSpecs[index].value = data.dataSpecs.min
      }
      this.handleValidate('ifSpecs')
      this.handleValidate('thenSpecs')
    },

    // 新增执行项
    handleAddThen(){
      this.formData.thenSpecs.push({dpId:null, operate:null, value:null})
    },

    // 删除执行项
    handleDeleteThen(index){
      this.formData.thenSpecs.splice(index,1)
      this.handleValidate('thenSpecs')
    },

    // 执行的功能变化
    funcThenChange(dpId,index){
      const data = this.dataSource[dpId]
      if(!this.formData.thenSpecs[index].operate){
        this.formData.thenSpecs[index].operate = 1
      }
      if(data.dataType == 'ENUM' || data.dataType == 'BOOL'){
        this.formData.thenSpecs[index].value = data.dataSpecsList[0]?.value || 0
      } else if(data.dataType == 'INT' || data.dataType == 'FLOAT' || data.dataType == 'DOUBLE'){
        this.formData.thenSpecs[index].value = data.dataSpecs.min
      }
      this.handleValidate('thenSpecs')
    },

    // 校验该项
    handleValidate(type){
      this.$refs.formData?.validateField([type])
    },

    ifValidator(rule, value, callback){ 
      if(this.formData.ifSpecs.some(item=> isNull(item.dpId))){
        callback(this.$t('setting.ruleConfig.columns.if.rule1'))
      }else{
        // 判断是否重复
        let hash = {};
        let isRepeat = false
        for(const i in this.formData.ifSpecs){
          const item = this.formData.ifSpecs[i]
          if(hash[item.dpId] && hash[item.dpId] == `${item.operate}_${item.value}`){
            isRepeat = true
            break;
          } else {
            if(item.operate == 5){
              hash[item.dpId] = 5
            } else {
              hash[item.dpId] = `${item.operate}_${item.value}`
            }
          }
        }
        if(isRepeat){
          callback(this.$t('setting.ruleConfig.if.noRepeat'))  
        } else{
          callback()  
        }
        
      }
    },

    thenValidator(rule, value, callback){ 
      if(this.formData.thenSpecs.some(item=> isNull(item.dpId))){
        callback(this.$t('setting.ruleConfig.columns.then.rule1'))
      } else{
        // 判断是否重复
        let hash = {};
        let isRepeat = false
        let isSameFunc = false
        for(const i in this.formData.thenSpecs){
          const item = this.formData.thenSpecs[i]
          if(hash[item.dpId]){
            isRepeat = true
          } else {
            hash[item.dpId] = true
          }
          if(this.formData.ifSpecs.some(t=> t.dpId== item.dpId)){
            isSameFunc = true
          }
        }
        if(isRepeat){
          callback(this.$t('setting.ruleConfig.then.noRepeat'))  
        } 
        if(isSameFunc){
          callback(this.$t('setting.ruleConfig.if.then.noRepeat'))  
        }

        callback() 
      }
    },

    // 数据变化
    dataChange(key,index,subKey,subValue){
      console.log(subValue)
      let list = this.$deepClone(this.formData[key]) 
      list[index][subKey] = subValue
      this.$set(this.formData,key,list)
      this.handleValidate('ifSpecs')
      this.handleValidate('thenSpecs')
    } 
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../../../global.less";
.rule-name{
  width: 496px;
}
</style>