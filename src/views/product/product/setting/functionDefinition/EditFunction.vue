<template>
    <a-modal
    :title="getTitle"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p v-if="form.custom == 0" class="regular-tips">{{$t('setting.edit.function.tips')}}</p>
      <a-form-model ref="ruleForm" class="regular-form" :model="form" :rules="rules" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item :label="$t('setting.edit.function.label.dpid')" prop="dpid" >
          <a-input-number class="number-input" v-if="!form.id" v-model="form.dpid" :min="101" :max="199" :precision="0" :placeholder="$t('setting.edit.function.placeholder.dpid')"/>
          <p v-if="form.id">{{form.dpid}}</p>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.edit.function.label.name')" prop="name" >
          <a-input v-model="form.name" :maxLength="20" :placeholder="$t('setting.edit.function.placeholder.name')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.edit.function.label.identifier')" prop="identifier" >
          <a-input v-if="form.custom != 0" v-model="form.identifier" :maxLength="50" :placeholder="$t('setting.edit.function.placeholder.identifier')"/>
          <span v-if="form.custom == 0"> {{form.identifier}}</span>
        </a-form-model-item>
        <a-form-model-item :label="$t('setting.edit.function.label.dataType')" prop="dataType">
          <a-radio-group  v-if="form.custom != 0" v-model="form.dataType" @change="dataTypeChange" :options="$DictList('data_type')" />
          <span v-if="form.custom == 0">
            {{$DictName('data_type',form.dataType)}}
          </span>
        </a-form-model-item>
        <!-- 数值型 -->
        <template v-if="dataType == 'INT' || dataType == 'DOUBLE' || dataType=='FLOAT'">
          <a-form-model-item :label="$t('setting.edit.function.label.max')" prop="max">
            <a-input v-show="false" v-model="form.max"/>
            <a-input-number v-model="form.min" :precision="dataType == 'INT'?0:3" :min="0" :max="9999999999" :placeholder="$t('setting.edit.function.placeholder.number')" class="min"/>
            <span class="line">——</span>
            <a-input-number v-model="form.max" :precision="dataType == 'INT'?0:3" :min="form.min" :max="9999999999" :placeholder="$t('setting.edit.function.placeholder.number')" class="max"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('setting.edit.function.label.step')" prop="step">
            <a-input-number v-model="form.step" :min="0" :precision="dataType == 'INT'?0:3" :max="9999999999" :placeholder="$t('setting.edit.function.placeholder.number')" class="number-input"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('setting.edit.function.label.multiple')" prop="multiple">
            <a-input-number v-model="form.multiple" :min="0" :precision="0" :max="9999999999" :placeholder="$t('setting.edit.function.placeholder.number')" class="number-input"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('setting.edit.function.label.unit')" prop="unit" >
            <a-select v-model="form.unit" :options="$DictList('properties_unit') || []"/>
          </a-form-model-item>
        </template>
        <!-- /数值型 -->

        <!-- 枚举型 -->
        <template v-if="dataType == 'ENUM'">
          <a-form-model-item :label="$t('setting.edit.function.label.enum')" prop="enum" >
            <div>
              <div class="flex y-axis-center" v-for="(item,index) in form.enum" :key="index">
                <a-row :gutter="10" type="flex">
                  <a-col  :xs="4" :md="4">
                    <a-input-number 
                    v-model="item.value" 
                    placeholder="值" 
                    :min="0" 
                    :max="1000" 
                    :precision="0" 
                    style="width:53px;height: 34px;"
                    @change="enumValueChange"
                    />
                  </a-col>
                  <a-col  :xs="7" :md="7">
                    <a-input v-model="item.name" :placeholder="$t('setting.edit.function.emun.name')"/>
                  </a-col>
                  <a-col  :xs="7" :md="7">
                    <a-input v-model="item.desc" :placeholder="$t('setting.edit.function.emun.desc')"/>
                  </a-col>
                  <a-col  :xs="2" :md="2" style="padding-top: 4px;">
                    <span @click="changeSort(-1,index,'enum')" :class="['item-icon tap-pointer',{'disabled':index==0}]">
                      <icon-font type="icon-shangyi" :style="{ fontSize: '24px',color: index==0 ?'rgba(0,0,0,0.2)': 'rgba(0,0,0,0.45)'}"/>
                    </span>
                  </a-col>
                  <a-col  :xs="2" :md="2" style="padding-top: 4px;">
                    <span @click="changeSort(+1,index,'enum')" :class="['item-icon tap-pointer',{'disabled':index==form.enum.length-1}]">
                      <icon-font type="icon-a-xiayi1" :style="{ fontSize: '24px',color: index==form.enum.length-1 ?'rgba(0,0,0,0.2)': 'rgba(0,0,0,0.45)'}"/>
                    </span>
                  </a-col>
                  <a-col  :xs="2" :md="2" style="padding-top: 4px;">
                    <span @click="deleteItem(index,'enum')" class="item-icon tap-pointer">
                      <icon-font type="icon-shanchu2" :style="{ fontSize: '24px',color:'rgba(0,0,0,0.45)'}"/>
                    </span>
                  </a-col>
                </a-row>
              </div>
            </div>
            <a-button type="primary" @click="addItem('enum')">{{ $t('setting.edit.function.btn.addValue') }}</a-button>
          </a-form-model-item>
        </template>
        <!-- /枚举型 -->

        <!-- 字符型 -->
        <template v-if="dataType == 'TEXT'">
          <a-form-model-item :label="$t('setting.edit.function.max.length')" prop="maxLength">
            <span>{{$t('setting.edit.function.max.number')}}</span>
          </a-form-model-item>
        </template>
        <!-- /字符型 -->

        <a-form-model-item :label="$t('setting.edit.function.data.transfer.type')" prop="rwFlag">
          <a-radio-group v-if="form.custom != 0" v-model="form.rwFlag" :options="$DictList('data_transfer_type')" />
          <template v-if="form.custom == 0">
            {{$DictName('data_transfer_type',form.rwFlag)}}
          </template>
        </a-form-model-item>
        <a-form-model-item v-if="dataType" :label="$t('setting.edit.function.label.default')" prop="defaultVal" >
          <a-input 
          v-if="dataType == 'TEXT'" 
          v-model="form.defaultVal" 
          :maxLength="255"
          />
          <a-input-number 
          v-if="dataType == 'INT' || dataType == 'DOUBLE' || dataType == 'FLOAT'" 
          v-model="form.defaultVal" 
          :precision="dataType == 'INT'?0:3" 
          :min="form.min" 
          :max="form.max" 
          :placeholder="$t('setting.edit.function.placeholder.number')"
          class="min"
          />
          <a-select v-if="dataType == 'ENUM'" v-model="form.defaultVal">
            <a-select-option v-for="(item,index) in form.enum" :key="`${index}`" :value="`${item.value}`">
              {{item.name}}
            </a-select-option>
          </a-select>
          <a-select v-if="dataType == 'BOOL'" v-model="form.defaultVal" :options="[{value:'true',label:'true'},{value:'false',label:'false'}]"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('public.remark')" prop="desc" >
          <a-input v-model="form.desc"  :maxLength="400"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { editFunc,addCustomFunc } from "@/api/product"
import { IDENTIFIER_REG, WORLD_NUM_REG } from "@/utils/validate"
import { isNull } from '@/utils/util'

export default ({
  name:"EditFunction",
  components:{
  },
  props:{
    data: { type: Object, default: ()=>{} },
    visible: { type: Boolean, default: false },
    productId: { type: String, default:''}
  },
  data(){
    return {
      confirmLoading: false,
      enumList:[],
      dataType:"",
      form:{},
      rules: {
        dpid: [{ required: true, message: '请输入DP ID!', trigger: 'blur' }],
        name: [
          { required: true, message: this.$t('setting.edit.function.rules.name'), trigger: 'blur' },
          { required: true, pattern: WORLD_NUM_REG, message: this.$t('setting.edit.function.rules.name.wordType'), trigger:'',},
          ],
        identifier: [
          { required: true, message: this.$t('setting.edit.function.rules.identifier'), trigger: 'blur' },
          { required: true, pattern: IDENTIFIER_REG, message: this.$t('setting.edit.function.rules.identifier.wordType'), trigger:'',},
          ],
        dataType: [{ required: true, message: this.$t('setting.edit.function.rules.dataType'), trigger: 'change' }],
        rwFlag: [{ required: true, message: this.$t('setting.edit.function.rules.rwFlag'), trigger: 'change' }],
        max: [
          { required: true, message: this.$t('setting.edit.function.rules.max'), trigger: '' },
          { validator:(rule, value, callback) => { !isNull(this.form.min) && !isNull(this.form.max)? callback():callback(this.$t('setting.edit.function.rules.max'))},  trigger: '' }
          ],
        step: [{ required: true, message: this.$t('setting.edit.function.rules.step'), trigger: 'blur' }],
        multiple: [{ required: true, message: this.$t('setting.edit.function.rules.multiple'), trigger: 'blur' }],
        defaultVal:[{ required: true, message: this.$t('setting.edit.function.rules.defaultVal'), trigger: 'blur' }],
        enum: [
          { required: true, validator:this.enumValidator,  trigger: 'change' }
        ],
      }
    }
  },
  computed:{
    getTitle(){
      if(!this.form.id){
        return this.$t('setting.edit.function.title.add')
      } else if(this.form.custom == '0'){
        return this.$t('setting.edit.function.title.edit.standard')
      } else{
        return this.$t('setting.edit.function.title.edit.custom')
      }
    }
  },
  watch: {
    visible(val){
      if(!val) return
      this.form = this.$deepClone(this.data)
      this.dataType = this.form.dataType
      this.setParams()
    }
  },
  mounted(){
  },
  methods:{
    enumValidator(rule, value, callback){
      if(value.length === 0){
        callback(this.$t('setting.edit.function.rules.enum'))
      } else{
        if(value.some(item=>isNull(item.value) || isNull(item.name) || isNull(item.desc))){
          callback(this.$t('setting.edit.function.enumValidator'))
        } else {
          const a = value.map(item=>item.value)
          const b = Array.from(new Set(a))
          if(b.length !== a.length){
            callback(this.$t('setting.edit.function.enum.noRepeat'))
          }
        }
      }
       callback()
    },
    //提交
    handleOk(){
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        let res = null
        const params = this.getparams()
        if(!this.form.id){
          res = await addCustomFunc(params)
        } else{
          res = await editFunc(params)
        }
        if(res.code !== 0) return
        this.$emit("confirmEdit",this.form.custom)
        this.resetData()
      });
    },

    // 提交参数处理
    getparams(){
      const form = this.form
      const params = {
        productId: this.productId,
        dpid: form.dpid,
        name:form.name,
        identifier: form.identifier,
        dataType: form.dataType,
        custom: form.custom,
        rwFlag: form.rwFlag,
        desc: form.desc,
        required:form.required,
        defaultVal: `${form.defaultVal}`
      }
      if(form.id){
        params['id'] = form.id
      }
      if( form.dataType == "INT"){
        params.dataSpecs = JSON.stringify({"custom":form.custom, "dataType":form.dataType, min: form.min, max: form.max, step: form.step, multiple: form.multiple, unit:`${form.unit||''}`})
      } else if(form.dataType == "DOUBLE" || form.dataType=='FLOAT'){
        params.dataSpecs = JSON.stringify({"custom":form.custom, "dataType":form.dataType, min: form.min, max: form.max, step: form.step, multiple: form.multiple, unit:`${form.unit||''}`})
      } else if( form.dataType == "ENUM"){
        const list= form.enum.map((item,index) => {
          return {"custom":form.custom, "dataType":form.dataType, value:item.value, name:item.name, desc:item.desc, sort:index}
        })
        params.dataSpecsList = JSON.stringify(list)
      } else if( form.dataType == "TEXT"){
        params.dataSpecs = JSON.stringify({"custom":form.custom, "dataType":form.dataType, length:255})
      } else if( form.dataType == "BOOL"){
        const list= form.bool?form.bool:[{"custom":form.custom, "dataType":form.dataType, value:0, name:'false'},{"custom":form.custom, "dataType":form.dataType, value:1, name:'true'}]
        params.dataSpecsList = JSON.stringify(list)
      }

      return params
    },

    // 渲染参数处理
    setParams(){
      if(( this.form.dataType == "INT" ||  this.form.dataType == "DOUBLE" || this.form.dataType=='FLOAT') && this.form.dataSpecs){
        const dataSpecs = JSON.parse(this.form.dataSpecs)
        this.form.min = Number(dataSpecs.min)
        this.form.max = Number(dataSpecs.max) 
        this.form.step = Number(dataSpecs.step || 1)
        this.form.multiple = Number(dataSpecs.multiple || 1)
        this.form.unit = dataSpecs.unit || ''
      } else if( this.form.dataType == "ENUM"){
        if(this.form.dataSpecsList){
          const list = JSON.parse(this.form.dataSpecsList)
          this.$set(this.form,'enum', this.$deepClone(list))
        }else{
          this.enumList = []
        }
      } else if(this.form.dataType == "BOOL"){
        if(this.form.dataSpecsList){
          this.form.bool = JSON.parse(this.form.dataSpecsList)
        }
      }
    },

    handleCancel(){
      this.$emit("cancelEdit")
      this.resetData()
    },

    resetData() {
      this.enumList = []
      this.dataType = ""
      this.$refs.ruleForm?.resetFields();
    },

    //数据类型切换
    dataTypeChange(e) {
      this.dataType = e.target.value
      this.$refs?.ruleForm?.clearValidate(["max","step","multiple","unit","enum"])
      this.$set(this.form,'defaultVal','')
      switch (this.dataType) {
        case "ENUM":
          this.form['enum'] = this.form?.enum || [];
          break;
      }
    },

    // 枚举型标签删除
    deleteItem(index,type) {
      if( !this.form[type].some(item=>item.value == this.form.defaultVal)){
        this.$set(this.form,'defaultVal','')
      }
      this.form[type].splice(index,1)
      this.$refs?.ruleForm?.clearValidate([type])
    },

    // 枚举型标签新增
    addItem(type){
      const list = this.$deepClone(this.form[type])
      list.push({value:0,name:'',desc:''})
      this.form[type] = this.$deepClone(list)
      this.$set(this,'form',this.$deepClone( this.form))
      
    },

    // 修改标签位置
    changeSort(direct,index, type){
      if((direct+index) < 0 || (direct+index) > this.form[type].length -1) return
      const data = this.$deepClone(this.form[type][direct+index]) 
      this.form[type].splice(direct+index,1,this.form[type][index])
      this.form[type].splice(index,1,data)
    },

    // 枚举标签值需改
    enumValueChange(){
      if(!this.form.enum.some(item=>item.value == this.form.defaultVal)){
        this.$set(this.form,'defaultVal','')
      }
    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
.regular-tips{
  color: @aithings-warning-color;
}
.fault-tips{
  color: @aithings-text-tips-color;
}
/deep/.ant-radio-wrapper{
  display: block;
  padding: 4px 0;
}
.min,.max{
  width: 44%;
}
.line{
  color: @aithings-text-tips-color;
  padding: 0 7px;
}
.number-input{
  width: 100%;

}
.regular-form{
  padding-top: 20px;
}
/deep/.ant-input-number-handler-wrap{
  display: none;
}

.item-icon.disabled{
  cursor:no-drop;
}
</style>