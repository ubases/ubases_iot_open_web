<template>
    <a-modal
    :title="(type=='add'? $t('public.add'):$t('public.Modify'))+$t('intelligentScene.details.button.task')"
    :width="900"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <section class="content-wrap flex">
        <template>
          <section class="col-wrap" v-for="(col,index) in colList" :key="index">
            <section class="header flex y-axis-center x-space-between">
              <span v-text="col.title"></span>
            </section>
            <section class="list">
              <template v-if="col.type === 'select'">
                <section 
                  v-for="(item,i) in lists[col.list]" 
                  :key="i" 
                  @click="selectValue(col.key,lists[col.list],i)" 
                  :class="['item flex y-axis-center x-space-between tap-pointer',{active: selectData[col.key] == item.value}]"
                >
                  <section :class="[item.image? 'flex y-axis-center': '']">
                    <div v-if="item.image" class="image-wrap">
                      <img :src="item.image" class="image"/>
                    </div>
                    <p class="label" v-text="item.label"></p>
                  </section>
                  <a-icon v-if="index !== 2" type="right"/>
                </section>
              </template>
              <template v-if="col.type === 'checkbox'">
                <a-checkbox-group v-model="tasksCheck[selectData.productKey]" @change="funcChange">
                  <section 
                    v-for="(item,i) in lists[col.list]" 
                    :key="i" 
                    @click="selectValue(col.key,lists[col.list],i)" 
                    :class="['item func-item tap-pointer',{active: selectData[col.key] == item.value}]"
                  >
                    <section class="flex y-axis-center">
                      <a-checkbox :value="item.value" />
                      <section :class="['func-content',item.image? 'flex y-axis-center': '']">
                        <div v-if="item.image" class="image-wrap">
                          <img :src="item.image" class="image"/>
                        </div>
                        <p class="label" v-text="item.label"></p>
                        <p class="identifier" v-if="item.identifier">{{`标识符：${item.identifier}`}}</p>
                      </section>
                      <a-icon v-if="index !== 2" type="right"/>
                    </section>
                  </section>
                </a-checkbox-group>
              </template>
              <section v-if="col.type === 'textInput'" class="input-wrap">
                <a-input v-model="selectData.funcValue" @change="inputChange" :maxLength="Number(numRange.length)"/>
              </section>
              <section v-if="col.type === 'numberInput'" class="input-wrap">
                <a-input-number v-model="selectData.funcValue" @change="inputChange" :min="Number(numRange.min)" :max="Number(numRange.max)" :step="Number(numRange.step)" :precision="numRange.dataType=='INT'?0:3"/>
              </section>
            </section>
          </section>
        </template>
        
      </section>
    </a-spin>
  </a-modal>
</template>

<script>

import { getTranslateFuncList, getProductList } from "@/api/product"
import { filter } from "lodash"
export default ({
  name:"SetTask",
  components:{
  },
  props:{
    type: { type: String, default: '' },
    visible: { type: Boolean, default: false },
    data: { type: Object, default: ()=>{} },
    taskList: { type: Array, default: ()=>[] },
  },
  data(){
    return {
      confirmLoading: false,
      colList:[
        { title: this.$t('intelligentScene.details.select.product'), list: 'productList', key: 'productKey', type:'select'},
        { title: this.$t('intelligentScene.details.select.prop'), list: 'taskFuncList', key: 'funcKey', type:'checkbox'},
        { title: this.$t('intelligentScene.details.select.propValue'), list: 'propsList', key: 'funcValue', type:'select'}
      ],
      lists:{
        productList:[],
        taskFuncList:[],
        propsList:[],
      },
      selectData:{
        productName:'',
        productKey: '',
        productId:'',
        funcKey: '',
        funcValue: '',
        funcCompare: 2
      },
      numRange:{},
      tasksCheck:{},
      tasksData:{},
      originTaskList:[]
    }
  },
  watch: {
    async visible(val){
      if(!val) return
      this.tasksCheck = {}
      this.tasksData = {}
      this.originTaskList = this.$deepClone(this.taskList)
      this.originTaskList.forEach(item=>{
        this.tasksData[item.productKey] = item.functions
        this.$set(this.tasksCheck,item.productKey,item.functions.map(fun=>Number(fun.funcKey)))
      })
      if(this.type === 'edit'){
        this.init()
        await this.getProductList()
        this.changeData()
      } else {
        this.init()
        await this.getProductList()
      } 
      
    },

  },
  mounted(){
  },
  methods:{
    // 初始化数据
    init(){
      this.lists = {
        productList:[],
        taskFuncList:[],
        propsList:[],
      },
      this.selectData = {
        productName:'',
        productKey: '',
        productId:'',
        funcKey: '',
        funcValue: '',
        funcCompare: 2
      },
      this.numRange ={}
    },

    // 渲染数据
    async changeData(){
        const data = this.$deepClone(this.data)
        this.selectData.productId = data.productId
        this.selectData.productKey = data.productKey
        this.selectData.funcKey = Number(data.functions[0].funcKey)
        this.selectData.funcCompare = data.functions[0].funcCompare || 2
        this.selectData.funcValue = data.functions[0].funcValue
        const pro = this.lists.productList?.filter(item=>item.productKey === data.productKey)?.pop() || {}
        this.tasksData[data.productKey] = [...data.functions]
        await this.handleProductChange(pro,true)
    },

    // 选中值
    selectValue(key, list, index){
      this.selectData[key] = list[index].value
      const productKey = this.selectData.productKey
      if(key === 'productKey') {
        if(!this.tasksCheck[productKey]){
          this.$set(this.tasksCheck,[productKey],[])
        }
        if(!this.tasksData[productKey]){
          this.tasksData[productKey] = []
        }
        this.handleProductChange(list[index])
      } else if (key === 'funcKey'){
        this.handleFuncChange(list[index])
        const func = this.tasksData[productKey].filter(ele=> ele.funcKey == list[index].value)?.pop() || null
        this.$set(this.selectData,'funcValue', func ? func.funcValue :'')
      } else if(key ==='funcValue'){
        this.tasksData[productKey].forEach(item => {
          if(item.funcKey == this.selectData.funcKey){
            item.funcValue = list[index].value
          }
        })
      }
      
    },

    // 输入框值变化
    inputChange(){
      this.tasksData[this.selectData.productKey].forEach(item => {
          if(item.funcKey == this.selectData.funcKey){
            item.funcValue = this.selectData.funcValue
          }
        })
    },

    // 功能多选框值变化,选中某个功能
    funcChange(val){
      const productKey = this.selectData.productKey
      const originData = [...this.tasksData[productKey]]
      this.tasksData[productKey] = val.map(item=>{
        const data = originData.filter(ele=> ele.funcKey === item)?.pop() || null
        if(data){
          return data
        } else {
          const func = this.lists.taskFuncList?.filter(t=>t.dpId === item)?.pop() ||{}
          return {
            funcKey:item,
            funcValue: this.setDefaultProp(func),
            funcCompare: 2,
            funcIdentifier:func.identifier,
            funcDesc:func.name,
          }
        }
      })
    },

    // 设置属性默认值
    setDefaultProp(item){
      if(item.dataType === 'ENUM'|| item.dataType == 'FAULT'){
        const list = JSON.parse(item.dataSpecsList)
        return list[0].value
      }else if(item.dataType === 'BOOL'){
        const list = JSON.parse(item.dataSpecsList)
        return list[0].name
      }else if(item.dataType === 'INT' || item.dataType == "DOUBLE" || item.dataType == "FLOAT"){
        const numRange = JSON.parse(item.dataSpecs)
        return numRange.min
      }else if(item.dataType === 'TEXT'){
        return ''
      }
    },
    
    // 获取产品列表
    async getProductList(){
      const res = await getProductList({page:0})
      if(res.code !==0) return
      if(this.type === 'edit'){
        // 编辑，只显示编辑的产品信息
        this.lists.productList = res.data?.list?.filter(item=>item.productKey === this.data.productKey)?.map(item=>{
          const { productKey,name, imageUrl, schemeId, id} = {...item}
          return {
            value: productKey,
            label: name,
            image: imageUrl,
            schemeId: schemeId,
            productId: id,
            productKey: productKey,
            productName: name,
          }
        }) || []
      } else {
        // 添加，删选掉已存在的产品
        this.lists.productList = res.data?.list?.filter(item=>!this.originTaskList?.some(t=>t.productKey === item.productKey))?.map(item=>{
          const { productKey,name, imageUrl, schemeId, id} = {...item}
          return {
            value: productKey,
            label: name,
            image: imageUrl,
            schemeId: schemeId,
            productId: id,
            productKey: productKey,
            productName: name,
          }
        }) || []
      }
      
    },

    // 产品变更
    async handleProductChange(item,isInit){
      // 获取产品指令列表
      this.selectData.productId = item.productId
      this.selectData.productName = item.productName
      const res = await getTranslateFuncList({productId:item.productId, condType: 'execCond'})
      if(res.code !==0) return
      const list = res.data?.map(item=>{
        return {
          ...item,
          value: item.dpId,
          label: item.name,
        }
      }) || []
      this.$set(this.lists,'taskFuncList',list)
      if(isInit){
        const func = this.lists.taskFuncList?.filter(item=>item.dpId == this.selectData.funcKey)?.pop() || {}
        this.handleFuncChange(func)
      }
    },

    // 指令变更
    handleFuncChange(item){
      if(item.dataType === 'ENUM'|| item.dataType == 'FAULT'){
        const list = JSON.parse(item.dataSpecsList)
        const propsList = list.map(t=>{
          return {
            label: t.desc,
            value: t.value,
          }
        })
        this.colList[2].type = 'select'
        this.$set(this.lists,'propsList',propsList)
      }else if(item.dataType === 'BOOL'){
        const list = JSON.parse(item.dataSpecsList)
        const propsList = list.map(t=>{
          return {
            label: t.desc,
            value: t.name,
          }
        })
        this.colList[2].type = 'select'
        this.$set(this.lists,'propsList',propsList)
      }else if(item.dataType === 'INT' || item.dataType == "DOUBLE" || item.dataType == "FLOAT"){
        this.numRange = JSON.parse(item.dataSpecs)
        this.colList[2].type = 'numberInput'
        this.$set(this.lists,'propsList',this.$DictList('operational_character'))
      }else if(item.dataType === 'TEXT'){
        this.numRange = JSON.parse(item.dataSpecs)
        this.colList[2].type = 'textInput'
      }
    },

     // 确认
    async handleOk(){
      if(!this.selectData.productKey){
        this.$emit("handleOk", [...this.originTaskList])
        return
      }
      let data = {}
      if(this.tasksCheck[this.selectData.productKey] && this.tasksCheck[this.selectData.productKey].length > 0){
        // 有选择设备功能
        data = {
          productId:this.selectData.productId,
          productKey:this.selectData.productKey,
          functions:this.tasksData[this.selectData.productKey]?.map(item=>{
            const func = this.lists.taskFuncList?.filter(f=>f.dpId == item.funcKey)?.pop() || {}
            return {
              funcKey:`${item.funcKey}`,
              funcCompare: 2,
              funcValue:`${item.funcValue}` || `${this.selectData.funcValue}`,
              funcIdentifier:func.identifier,
              funcDesc:func.name,
            }
          }) || []
        }
        // 匹配编辑设备的数据
        const index = this.originTaskList.findIndex(item=>item.productKey === data.productKey)
        if(index !== -1) {
          this.originTaskList.splice(index,1,data)
        } else {
          if(data.functions.length !== 0) this.originTaskList.push(data)
        }
      }  else{
        // 无选择设备功能
        // 匹配编辑设备的数据
        const index = this.originTaskList.findIndex(item=>item.productKey === this.selectData.productKey)
        if(index !== -1) {
          this.originTaskList.splice(index,1)
        }
      }
      this.$emit("handleOk", [...this.originTaskList])
    },
    handleCancel(){
      this.$emit("handleCancel")
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
  .content{
    width: 100%;
    border: 1px solid @aithings-border-color;
  }
  .header{
    height: 52px;
    padding: 0 20px;
    background: @aithings-search-bg-color;
    color: @primary-color;
  }
  
  .condition-list-wrap{
    flex: 1;
    border-right: 1px solid @aithings-border-color;
  }
  .content-wrap{
    border: 1px solid @aithings-border-color;
  }
  /deep/.ant-checkbox-group{
    width: 100%;
  }
  .func-content{
    flex: 1;
    padding-left: 10px;
  }

  ul{
    padding: 0;
    list-style: none;
  }
  .col-wrap{
    flex: 1;
   
    .list{
      overflow-y: auto;
      height: 400px;
      border-top: 1px solid @aithings-border-color;
    }
    .item{
      padding: 10px 15px 10px 20px;
      border-bottom: 1px solid @aithings-border-color;
      color: @aithings-text-color-black;
      &.active{
        background: @aithings-search-bg-color;
        color: @primary-color;
      }
      .image-wrap{
        width: 32px;
        height: 32px;
        margin-right: 4px;
      }
      .image{
        display: block;
        max-width: 32px;
        max-height: 32px;
        border-radius: 4px;
      }
      .identifier{
        font-size: 12px;
        color: @aithings-text-color-gray;
      }
    }
  }
  .col-wrap+.col-wrap{
    border-left: 1px solid @aithings-border-color;
  }
  .anticon-right, .anticon-.close{
    color: @aithings-text-color-gray;
  }
  /deep/ .ant-btn-link{
    padding: 0;
    color: @primary-color;
  }
  .input-wrap{
    width: 100%;
    padding: 5px 5%;
    border-bottom: 1px solid @aithings-border-color;
    /deep/.ant-input-number, /deep/.ant-input{
      width: 100%;
    }
  }
</style>