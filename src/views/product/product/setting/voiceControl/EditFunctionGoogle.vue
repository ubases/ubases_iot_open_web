<template>
  <a-modal
    :title="type ==='edit' ? $t('public.edit') : $t('public.add') + $t('setting.voiceControl.editFunction.title')"
    :width="930"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p class="prompt">{{$t('setting.voiceControl.editFunction.prompt')}}</p>
      <a-form-model ref="form" class="form" :model="form" :rules="rules" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-form-model-item :label="$t('setting.voiceControl.editFunction.label.props')" prop="attrCode" >
          <section class="flex y-axis-center">
            <a-select v-model="form.attrCode" :options="functionList" class="function-select" @change="handleChangeFun"/>
            <span v-if="form.attrCode" class="copy-icon" v-clipboard:copy="copyText" v-clipboard:success="onCopy">
              <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />
            </span>
            <span class="map-text">{{$t('setting.voiceControl.editFunction.label.map')}}</span>
            <a-select 
              v-if="form.vDataType=='INT' || form.vDataType=='DOUBLE' || form.vDataType=='FLOAT'"  
              v-model="form.voiceCode" 
              :options="GoogleFunctionList" 
              class="google_function-select" 
              placeholder="请选择谷歌平台属性" 
              @change="handleChangeVoiceFun"
            />
            <a-input 
              v-else 
              class="voice-prop-input" 
              v-model="form.voiceCode" 
              :maxLength="100" 
              :disabled="form.attrCode == 'powerstate'"
              :placeholder="$t('setting.voiceControl.editFunction.placeholder.props')"
            />
            
            <a-textarea v-if="form.vDataType=='ENUM' || form.vDataType=='BOOL'" class="voice-prop-textarea" v-model="form.voiceSynonym" :maxLength="500" placeholder="设置别名，多个以半角;隔开" />
            
          </section>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.voiceControl.editFunction.label.funName')" prop="funName" >
          <a-input v-model="form.funName" class="fun-name-input" :maxLength="50" :placeholder="$t('setting.voiceControl.editFunction.placeholder.funName')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.voiceControl.editFunction.label.dataType')" prop="vDataType" >
          <section class="flex y-axis-center">
            <a-input class="voice-prop-input" :value="$DictName('voice_data_type',form.dataType)" disabled/>
            <span class="map-text">{{$t('setting.voiceControl.editFunction.label.map')}}</span>
            <a-select v-model="form.vDataType" :options="vDataTypeOriginOptions[form.dataType]" class="function-select" @change="handleVDataType"/>
          </section>
        </a-form-model-item>
        <a-form-model-item v-if="form.valueMap && form.valueMap.unit" :label="$t('setting.voiceControl.editFunction.unit')" prop="vUnit" >
          <a-input class="voice-prop-input" :value="$DictName('properties_unit', form.valueMap.unit) || form.valueMap.unit" disabled/>
          <template v-if="form.valueMap.vUnit">
            <span class="map-text">{{$t('setting.voiceControl.editFunction.label.map')}}</span>
            <a-select v-model="form.valueMap.vUnit" :options="voiceUnitList" class="function-select" disabled/>
          </template>
        </a-form-model-item>
        <a-form-model-item v-if="form.valueType == 1 || form.valueType == 2" :label="$t('setting.voiceControl.editFunction.label.value')" prop="valueMap" >
          <a-radio-group v-model="form.valueType" disabled>
            <a-radio :value="1"> {{$t('setting.voiceControl.editFunction.numerical.range')}}</a-radio>
            <a-radio :value="2"> {{$t('setting.voiceControl.editFunction.numerical.list')}}</a-radio>
          </a-radio-group>
          <section v-if="form.valueType == 1" class="numerical-range-map">
            <a-input-number class="range-input" v-model="form.valueMap.min" :max="9999999999" :precision="form.dataType === 'INT'?0:3" :placeholder="$t('setting.voiceControl.editFunction.min')"/>
            <a-input-number class="range-input" v-model="form.valueMap.max" :max="9999999999" :precision="form.dataType === 'INT'?0:3" :placeholder="$t('setting.voiceControl.editFunction.max')"/>
            <a-input-number class="range-input" v-model="form.valueMap.step" :min="0" :max="9999999999" :precision="form.dataType === 'INT'?0:3" :placeholder="$t('setting.voiceControl.editFunction.step')"/>
            <span class="map-text">{{$t('setting.voiceControl.editFunction.label.map')}}</span>
            <a-input-number class="range-input1" v-model="form.valueMap.vMin" :max="9999999999" :precision="form.vDataType === 'INT'?0:3" :placeholder="$t('setting.voiceControl.editFunction.voice.min')"/>
            <a-input-number class="range-input1" v-model="form.valueMap.vMax" :max="9999999999" :precision="form.vDataType === 'INT'?0:3" :placeholder="$t('setting.voiceControl.editFunction.voice.max')"/>
            <a-input-number class="range-input1" v-model="form.valueMap.vStep" :min="0" :max="9999999999" :precision="form.vDataType === 'INT'?0:3" :placeholder="$t('setting.voiceControl.editFunction.step')"/>
          </section>
          <section v-if="form.valueType == 2" class="numerical-list-map">
            <div class="flex y-axis-center value-wrap" v-for="(item,index) in form.valueMap" :key="index">
              <a-select v-if="form.dataType=='ENUM' || form.dataType=='BOOL'" v-model="item.val" :options="funcValueOptions" class="value-select" @change="funValueChange"/>
              <template v-if="form.dataType=='INT' || form.dataType=='DOUBLE' || form.dataType=='FLOAT'">
                <a-input-number class="range-input" v-model="item.min" :max="9999999999" :precision="form.dataType === 'INT'?0:3" :placeholder="$t('setting.voiceControl.editFunction.min')"/>
                <a-input-number class="range-input" v-model="item.max" :max="9999999999" :precision="form.dataType === 'INT'?0:3" :placeholder="$t('setting.voiceControl.editFunction.max')"/>
                <a-input-number class="range-input" v-model="item.step" :min="0" :max="9999999999" :precision="form.dataType === 'INT'?0:3" :placeholder="$t('setting.voiceControl.editFunction.step')"/>
              </template>
              <span class="map-text">{{$t('setting.voiceControl.editFunction.label.map')}}</span>
              <a-input v-model="item.voiceVal" class="value-input" :maxLength="50" :placeholder="form.vDataType=='ENUM' ? `输入枚举值`:`输入布尔值`"/>
              <a-textarea class="voice-prop-textarea" :maxLength="500" v-model="item.voiceValSynonym" placeholder="设置别名，多个以半角;隔开" />
              <a-button v-if="index !== 0" type="link" @click="handleDeleteMap(index)">{{$t('public.delete')}}</a-button>
            </div>
            <a-button class="add-numerical-button" :disabled="addValueDisabled" @click="addMap"><plus-blue-icon />{{$t('setting.voiceControl.editFunction.addNumerical')}}</a-button>
          </section>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.voiceControl.editFunction.label.voiceDemo')" prop="voiceDemo" >
          <a-textarea v-model="form.voiceDemo" :auto-size="{ minRows: 7}" :maxLength="500" :placeholder="$t('setting.voiceControl.editFunction.placeholder.voiceDemo')"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { PlusBlueIcon } from '@/core/icons'
import { isNull,checkIfArrayIntervalOverLap } from '@/utils/util'
import { WORLD_MULTI_REG } from '@/utils/validate'

export default ({
  name:"EditFunction",
  props:{
    visible: { type: Boolean, default: false },
    data: { type: Object, default: ()=>{} },
    type: { type: String, default: 'add' },
    functionList: { type: Array, default: ()=>[]},
  },

  components:{
    PlusBlueIcon
  },

  data(){
    return {
      confirmLoading: false,
      form: {
        valueType: 3,
        valueMap:[],
        funName:''
      },
      rules: {
        funName: [{ required: true, message: this.$t('setting.voiceControl.editFunction.rules.funName'), trigger: '' }],
        attrCode: [
          { required: true, message: this.$t('setting.voiceControl.editFunction.rules.props'), trigger: '' },
          { validator: this.attrCodeValidator,  trigger: 'change' }
        ],
        vDataType:[
          { required: true, message: this.$t('setting.voiceControl.editFunction.rules.dataType'), trigger: 'change' },
        ],
        valueMap: [
          { required: true, message: this.$t('setting.voiceControl.editFunction.rules.valueType'), trigger: '' },
          { required: true, validator: this.valueTypeValidator, trigger: '' }
        ],
      },
      selectedFun:{},
      funcValueOptions: [],
      intValue: ['min','max','step','unit','vMin','vMax','vStep'],
      voiceUnitList: [{label:'秒',value:'s'}],
      vDataTypeOriginOptions:{
        'INT':[{"label":"整型（Int）","value":"INT"},{"label":"浮点型（Float）","value":"FLOAT"},{"label":"浮点型（Double）","value":"DOUBLE"},{"label":"枚举值（Enum）","value":"ENUM"}],
        'DOUBLE':[{"label":"整型（Int）","value":"INT"},{"label":"浮点型（Float）","value":"FLOAT"},{"label":"浮点型（Double）","value":"DOUBLE"},{"label":"枚举值（Enum）","value":"ENUM"}],
        'FLOAT':[{"label":"整型（Int）","value":"INT"},{"label":"浮点型（Float）","value":"FLOAT"},{"label":"浮点型（Double）","value":"DOUBLE"},{"label":"枚举值（Enum）","value":"ENUM"}],
        'ENUM':[{"label":"枚举值（Enum）","value":"ENUM"}],
        'BOOL':[{"label":"布尔值（Bool）","value":"BOOL"}]
      },
      GoogleFunctionList:[
        {label:'humidity', value:'humidity', command:'action.devices.commands.SetHumidity'},
        {label:'timerTimeSec', value:'timerTimeSec',unit:'s', command:'action.devices.commands.TimerStart'},
      ],
      
    }
  },
  computed:{
    copyText(){
      if(this.form.attrCode){
        return this.functionList.filter(item=>item.value == this.form.attrCode).pop()?.label || ''
      }
      return ''
    },
    vDataTypeOptions(){
      if(this.form.dataType){
        return this.vDataTypeOriginOptions[this.form.dataType]
      }
      return []
    },
    addValueDisabled(){
      if(this.form.dataType === 'INT' || this.form.dataType === 'DOUBLE' || this.form.dataType === 'FLOAT'){
        return false
      } else {
        return this.form.valueMap.length >= this.funcValueOptions.length
      }
      
    },
  },

  watch:{
    async visible(val){
      if(!val) return
      if(this.type == 'edit'){
        this.form = this.$deepClone(this.data)
        this.selectedFun = this.functionList.filter(item=>item.value === this.form.attrCode)?.pop()
        this.updateFuncValueOptions()
      } 
    },

    'form.valueMap'(list){
      if(!Array.isArray(list) || !list || list.length === 0) return
      // 数值列表属性值只能映射一次
      this.funcValueOptions = this.funcValueOptions.map(option =>{
        const isExist = list.some(item => item.val === option.value)
        return {...option, disabled: isExist}
      })
    },

  },

  mounted(){},

  methods:{

    // 确认
    handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.$emit('sumit',{data: {...this.form}, type:this.type })
        this.$refs.form?.resetFields()
        this.form = { valueType: 3, valueMap:[]}
      })
    },

    // 取消
    handleCancel(){
      this.$refs.form?.resetFields()
      this.form = { valueType: 3,valueMap:[]}
      this.$emit('cancel')
    },

    // 属性切换
    handleChangeFun(val){
      this.selectedFun = this.functionList.filter(item=>item.value === val)?.pop()
      this.$set(this.form,'funName',this.selectedFun.name)
      this.$set(this.form,'attrDpid',this.selectedFun.attrDpid)
      this.$set(this.form,'dataType',this.selectedFun.dataType)
      if(this.selectedFun.dataType === 'TEXT'){
        this.funcValueOptions = []
        this.form.vDataType = ''
      } else if (this.selectedFun.dataType === 'INT' || this.selectedFun.dataType === 'DOUBLE' || this.selectedFun.dataType === 'FLOAT'){
        this.selectedFun.vDataType = this.selectedFun.dataType
        this.form.vDataType = ''
      } else if (this.selectedFun.dataType === 'ENUM' || this.selectedFun.dataType === 'BOOL'){
        this.updateFuncValueOptions()
        this.form.vDataType = this.selectedFun.dataType
        if(this.selectedFun.value == 'powerstate'){
          this.form.voiceCode = 'on'
          this.form.command = 'action.devices.commands.OnOff'
        }
      }
      this.clearValidate('funName')
      if(this.form.attrCode && this.form.voiceCode){
        this.clearValidate('attrCode')
      }
      this.setValueType()
    },

    // 谷歌属性值切换
    handleChangeVoiceFun(){
      const func = this.GoogleFunctionList.filter(item=>item.value == this.form.voiceCode)?.pop()
      this.form.command = func?.command || ''
      this.form.valueMap.vUnit = func?.unit || ''
    },

    // 映射数据类型变化
    handleVDataType(){
      this.clearValidate('vDataType')
      this.$set(this.form, 'voiceCode', '')
      this.$set(this.form, 'command', '')
      this.$set(this.form, 'voiceSynonym', '')
      this.setValueType()
    },

    setValueType(){
      if((this.form.dataType === 'INT' || this.form.dataType === 'DOUBLE' || this.form.dataType === 'FLOAT')&&(this.form.vDataType === 'INT' || this.form.vDataType === 'DOUBLE' || this.form.vDataType === 'FLOAT')){
        this.$set(this.form,'valueType',1)
        this.attrCodeFunc = this.functionList.filter(item=>item.value === this.form.attrCode)?.pop()
        const data = this.attrCodeFunc?.dataSpecs ? JSON.parse(this.attrCodeFunc.dataSpecs) : {}
        this.form.valueMap = {
          min: Number(data.min),
          max: Number(data.max),
          step: Number(data.step),
          unit: data.unit,
          multiple: Number(data.multiple),
        }
      } else if (this.form.dataType === 'TEXT' || isNull(this.form.dataType)  || isNull(this.form.vDataType)){
        this.$set(this.form,'valueType',0)
        this.form.valueMap = []
      } else {
        this.$set(this.form,'valueType',2)
        this.form.valueMap = [{ val:'', voiceVal:'', voiceValSynonym:'' }]
      }
    },

    // 更新属性值选项
    updateFuncValueOptions(){
      this.funcValueOptions = this.selectedFun?.dataSpecsList ? JSON.parse(this.selectedFun.dataSpecsList).map(item =>{
        return {
          value:this.selectedFun.dataType ==='ENUM'? item.value : item.name,
          label: item.name,
          disabled: false
        }
      }) : [{value: 'true', label: 'true', disabled: false},{value: 'false', label: 'false', disabled: false},]
    },

    // 属性值切换
    funValueChange(){
      this.$set(this.form,'valueMap', [...this.form.valueMap])
    },

    // 新增数值
    addMap(){
      this.form.valueMap.push({val:'',voiceVal:'', voiceValSynonym:''})
    },

    // 删除属性值
    handleDeleteMap(index){
      this.form.valueMap.splice(index, 1)
    },

    // 属性映射校验
    attrCodeValidator(rule, value, callback){
      if(!this.form.attrCode || !this.form.voiceCode){
        callback(this.$t('setting.voiceControl.editFunction.rules.props'))
      }
      if( this.form.vDataType=='ENUM' || this.form.vDataType=='BOOL'){
        if(isNull(this.form.voiceSynonym)){
          callback('请设置映射别名')
        } 
        const aliasList = this.form.voiceSynonym.split(';').filter(item=>!isNull(item))
        if(aliasList.length == 0 || aliasList.length > 10){
          callback('别名个数限制为1-10个')
        }
        this.form.voiceSynonym = aliasList.join(';')
        if(!WORLD_MULTI_REG.test(this.form.voiceSynonym)){
          callback('别名值由数字、英文、汉字组成，多个由半角;分隔')
        }
        
      } 
      callback()

    },

    // 值映射校验
    valueTypeValidator(rule, value, callback){
      if(this.form.valueType === 1){
        // 值不为空
        let list = []
        if(this.selectedFun.dataType === 'INT' || this.selectedFun.dataType === 'DOUBLE' || this.selectedFun.dataType === 'FLOAT'){
          list = [...this.intValue].filter(item=>item!=='unit')
        }
        const isEmptyValue = list.some(key=> isNull(this.form.valueMap[key]))
        isEmptyValue ? callback(this.$t('setting.voiceControl.editFunction.rules.valueType')) : callback()
      } else if(this.form.valueType === 2){
        // 值不为空
        let errorTips = ''
        for(let i=0;i<this.form.valueMap.length;i++){
          const item = this.form.valueMap[i]
          if((this.form.dataType=='ENUM' || this.form.dataType=='BOOL') && isNull(item.val) ){
            errorTips = this.$t('setting.voiceControl.editFunction.rules.valueType')
            break
          }

          if( this.form.dataType=='INT' || this.form.dataType=='DOUBLE' || this.form.dataType=='FLOAT'){
            if(isNull(item.min) || isNull(item.max) ||isNull(item.step)){
              errorTips = this.$t('setting.voiceControl.editFunction.rules.valueType')
              break
            }
          }
          if(isNull(item.voiceVal)){
            errorTips = this.$t('setting.voiceControl.editFunction.rules.valueType')
            break
          }
          if((this.form.vDataType=='ENUM' || this.form.vDataType=='BOOL') && isNull(item.voiceValSynonym?.trim())){
            errorTips = '映射值别名不能为空'
            break
          }
        }
        if(errorTips){
          callback(errorTips)
        }

        // 数值最小值不能大于最大值，区间不能重合
        if( this.form.dataType=='INT' || this.form.dataType=='DOUBLE' || this.form.dataType=='FLOAT'){
          const list = this.form.valueMap.map(item=>{
            return [item.min, item.max]
          })
          const result = checkIfArrayIntervalOverLap(list)
          if(result == 1) {
            callback('数值区间不能重合')
          } else if(result == 2){
            callback('最小值不能大于最大值')
          }
        }
        
        // 别名限制1-10个、值仅限数字、英文、汉字组成
        if(this.form.vDataType=='ENUM' || this.form.vDataType=='BOOL'){
          for(let i=0;i<this.form.valueMap.length;i++){
            const item = this.form.valueMap[i]
            const aliasList = item.voiceValSynonym.split(';').filter(item=>!isNull(item))
            if(aliasList.length == 0 || aliasList.length > 10){
              errorTips = '别名个数限制为1-10个'
              break
            }
            item.voiceValSynonym = aliasList.join(';')
          }
          if(errorTips){
            callback(errorTips)
          }
          if(this.form.valueMap.some(item=>!WORLD_MULTI_REG.test(item.voiceValSynonym))){
            callback('别名值由数字、英文、汉字组成，多个由半角;分隔')
          }
        }

        callback()
      }
    },

    // 复制
    onCopy() {
      this.$message.success(this.$t('public.copy.succeed'));
    },

    // 清除校验
    clearValidate(key){
      this.$refs?.form?.clearValidate([key])
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
 .prompt{
    padding-bottom: 10px;
    color: @aithings-warning-color-FF8E35;
  }
  .fun-name-input{
    width: 520px;
  }
  .function-select,.voice-prop-input{
    width: 230px;
  }
  .google_function-select{
    width: 180px;
  }
  .map-text{
    padding: 0 16px;
    color: @aithings-text-color-black;
  }
  .range-input{
    width: 94px;
  }
  .range-input1{
    width: 124px;
  }
  .range-input+.range-input,.range-input1+.range-input1{
    margin-left: 10px;
  }
  .value-select{
    width: 230px;
  }
  .value-input{
    width: 140px;
  }
  .value-wrap{
    padding-bottom: 6px;
  }
  .add-numerical-button{
    width: 110px;
    color: @primary-color;
    border-color: @primary-color;
    svg{
      margin-right: 10px;
      transform: translateY(2px);
    }
    &:disabled{
      background: none;
      opacity: 0.5;
      color: @primary-color;
      border-color: @primary-color;
    }
  }
  .ant-input[disabled]{
    background-color:@aithings-table-thread-color;
  }
  .copy-icon{
    padding: 0 0 0 10px;
  }
  .voice-prop-textarea{
    width: 200px;
    margin: 0 0 0 10px;
    resize: none;
  }
</style>