<template>
    <a-modal
    :title="(type=='add'? $t('public.add'):$t('public.Modify'))+$t('intelligentScene.details.button.condition')"
    :width="900"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <section class="content-wrap flex">
        <section class="condition-list-wrap">
          <section class="header flex y-axis-center ">
            <span>{{$t('intelligentScene.details.select.condition')}}</span>
          </section>
          <section class="condition-list" >
            <section 
            v-for="item in conditionList" 
            :key="item.value" 
            @click="selectCondition(item)" 
            :class="['list-item tap-pointer flex y-axis-center x-space-between',{active:selectedCond == item.value}]">
              <section>
                <p class="name" v-text="item.label"></p>
              </section>
              <a-icon type="right"/>
            </section>
          </section>
        </section>

        <!-- 定时 -->
        <section v-if="selectedCond == 3" class="set-time-wrap">
          <section class="header flex y-axis-center">
            <span v-text="$t('intelligentScene.details.set.time')"></span>
          </section>
          <section class="time-wrap flex x-space-between">
            <section class="hour-list-wrap tap-pointer">
              <div class="unit">{{$t('intelligentScene.details.unit.hour')}}</div>
              <ul class="hour-list" ref="hourList" @scroll="handleScroll('hourList','hourValue', hourList)">
                <li :class="['item',{active: hourValue == item}]" v-for="(item,index) in hourList" :key="index" v-text="item"></li>
              </ul>
            </section>
            <section class="hour-list-wrap tap-pointer">
              <div class="unit">{{$t('intelligentScene.details.unit.minute')}}</div>
              <ul class="minute-list" ref="minuteList" @scroll="handleScroll('minuteList','minuteValue', minuteList)">
                <li :class="['item',{active: minuteValue == item}]" v-for="(item,index) in minuteList" :key="index" v-text="item"></li>
              </ul>
            </section>
            
          </section>
        </section>
        <section v-if="selectedCond == 3" class="set-repeat-wrap">
          <section class="header flex y-axis-center x-space-between">
            <span v-text="$t('intelligentScene.details.select.repeat')"></span>
            <a-button type="link" @click="selectAllWeek">{{$t('public.select.all')}}</a-button>
          </section>
          <section class="week-wrap">
            <ul class="week-list-wrap">
              <li v-for="(item,index) in weekList" :key="index" @click="selectWeek(index)" :class="['week-text tap-pointer',{active:item.active}]">{{item.label}}</li>
            </ul>
          </section>
        </section>
        <!-- /定时 -->
        <template v-if="selectedCond !== 3 ">
          <section class="col-wrap" v-for="(col,index) in colList" :key="index">
            <section class="header flex y-axis-center x-space-between">
              <span v-text="col.title"></span>
            </section>
            <section class="list">
              <template v-if="col.type === 'select'">
                <section 
                  v-for="(item,i) in lists[col.list]" 
                  :key="i" 
                  @click="selectValue(col.key,lists[col.list],i,col)" 
                  :class="['item flex y-axis-center x-space-between tap-pointer',{active: selectData[col.key] == item.value}]"
                >
                  <section :class="[item.image? 'flex y-axis-center': '']">
                    <div v-if="item.image" class="image-wrap">
                      <img :src="item.image" class="image"/>
                    </div>
                    <p class="label" v-text="item.label"></p>
                    <p class="identifier" v-if="item.identifier">{{`标识符：${item.identifier}`}}</p>
                  </section>
                  <a-icon v-if="index !== colList.length-1" type="right"/>
                </section>
              </template>
              <section v-if="col.type === 'compareSelect'" class="flex compare-sign-wrap">
                <section class="compare-sign">
                  <section 
                    v-for="(sign,i) in lists.signList" 
                    :key="i" 
                    @click="selectValue('compare',lists.signList,i,col)" 
                    :class="['item flex y-axis-center x-space-between tap-pointer',{active: selectData.compare == sign.value}]"
                  >
                    <section> {{sign.label}}</section>
                    <a-icon type="right"/>
                  </section>
                </section>
                <section class="num-list-wrap">
                  <section 
                    v-for="(item,i) in lists[col.list]" 
                    :key="i" 
                    @click="selectValue(col.key,lists[col.list],i,col)" 
                    :class="['item tap-pointer',{active: selectData[col.key] == item.value}]"
                  >
                    <section>
                      <p class="label" v-text="item.label"></p>
                    </section>
                  </section>
                </section>

              </section>
              <section v-if="col.type === 'selectInput'" class="flex compare-sign-wrap">
                <section class="compare-sign">
                  <section 
                    v-for="(sign,i) in lists.signList" 
                    :key="i" 
                    @click="selectValue('funcCompare',lists.signList,i,col)" 
                    :class="['item flex y-axis-center x-space-between tap-pointer',{active: selectData.funcCompare == sign.value}]"
                  >
                    <section> {{sign.label}}</section>
                    <a-icon v-if="index !== 2" type="right"/>
                  </section>
                </section>
                <section class="input-wrap">
                  <a-input-number v-model="selectData.funcValue" :min="Number(numRange.min)" :max="Number(numRange.max)" :step="Number(numRange.step)" :precision="numRange.dataType=='INT'?0:3"/>
                </section>
              </section>
              <section v-if="col.type === 'textInput'" class="flex compare-sign-wrap">
                <section class="text-input-wrap">
                  <a-input class="text-input" v-model="selectData.funcValue" :maxLength="Number(numRange.length)"/>
                </section>
                
              </section>
            </section>
          </section>
        </template>
        
      </section>
    </a-spin>
  </a-modal>
</template>

<script>

import { getTranslateFuncList,getProductList } from "@/api/product"
export default ({
  name:"AddSceneSet",
  components:{
  },
  props:{
    type: { type: String, default: '' },
    visible: { type: Boolean, default: false },
    data: { type: Object, default: ()=>{} },
  },
  data(){
    return {
      confirmLoading: false,
      conditionList: this.$DictList('scene_condition'),
      conditonKey:{
        3:'timer',
        2:'weather',
        4:'statechange'
      },
      selectedCond:3,
      hourList:['','','','00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','','',''],
      minuteList:['','','','00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','','',''],
      weekList:[],
      hourValue: '00',
      minuteValue: '00',
      colList:[],
      lists:{},
      selectData:{
        type:1,
      },
      numRange:{},
      weatherValueList:{
          1:Array.from(Array(81), (v,k) =>{return {value:k-40, label:k-40}}),
          2:Array.from(Array(101), (v,k) =>{return {value:k, label:k}}),
          3:this.$DictList('weather_status'),
          4:Array.from(Array(1001), (v,k) =>{return {value:k, label:k}}),
          6:this.$DictList('sun_status'),
        },
    }
  },
  watch: {
    async visible(val){
      if(!val)return
      if(this.type === 'edit'){
        this.init()
        await this.getProductList()
        this.changeData()
      } else {
        this.init()
        await this.getProductList()
      } 
    },
    ['selectData.type'](val){
      if(val !== 3 & val !== 6){
        this.weatherList[1].type = 'compareSelect'
        this.$set(this.weatherList,'weatherValueOptions',this.weatherValueList[val])
      } else {
        this.weatherList[1].type = 'select'
      }
      this.$set(this.lists,'weatherValueOptions',this.weatherValueList[val])
    }

  },
  computed:{
    weatherList () {
      return [
        { title:'', list: 'weatherFunc', key: 'type', type:'select'},
        { title:'', list: 'weatherValueOptions', key: 'value', type:'compareSelect'}
      ]
    },
    deviceStatusChange(){
      return [
        { title: this.$t('intelligentScene.details.select.product'), list: 'productList', key: 'productKey', change: 'product', type:'select' },
        { title: this.$t('intelligentScene.details.select.prop'), list: 'condFuncList', key: 'funcKey', change: 'func', type:'select'},
        { title: this.$t('intelligentScene.details.select.propValue'), list: 'propsList', key: 'funcValue', type:'select'}
      ]
    },
  },
  mounted(){
  },
  methods:{
    // 初始化数据
    init(){
      this.selectedCond = 3
      this.weekList = this.$DictList('week').map(item=> {
        return {
          ...item,
          active: false
        }
      })
      this.hourValue = '00'
      this.minuteValue = '00'
      this.colList = []
      this.lists = {
        productList:[],
        condFuncList:[],
        propsList:[],
        weatherFunc:this.$DictList('scene_weather_cond'),
        signList: this.$DictList('operational_character'),
        weatherValueOptions:[]
      }
      this.$set(this.lists,'weatherValueOptions',this.weatherValueList[1])
      this.selectData ={
        type:1,
        compare: 2,
        value: 0,
        productKey: '',
        productId:'',
        funcKey: '',
        funcValue: '',
        funcCompare: 2
      }
      this.numRange = {}
      this.$nextTick(() => {
        this.$refs.hourList.scrollTop = 0
        this.$refs.minuteList.scrollTop = 0
      })
      
    },

    // 渲染数据
    async changeData(){
      const data = this.data
      this.selectedCond =data.conditionType
      if(this.selectedCond === 3){
        // 定时
        this.weekList.forEach(item=>{
          data.timer?.weeks?.split(',').some(week=>week == item.value) ? item.active=true : item.active=false
        })
        const time = data.timer.value.split(':')
        this.hourValue =  time[0]||'00'
        this.minuteValue = time[1]||'00'
        const hourIndex = this.hourList.findIndex(hour=>hour === this.hourValue)
        const minuteIndex = this.minuteList.findIndex(min=>min === this.minuteValue)
        this.$nextTick(() => {
          this.$refs.hourList.scrollTop = (hourIndex-3)*40
          this.$refs.minuteList.scrollTop = (minuteIndex-3)*40 
        })
      } else if(this.selectedCond === 2){
      // 天气变化
        this.colList = this.weatherList
        const { type, compare, value} ={...data.weather}
        this.selectData.type = type
        this.selectData.compare = compare
        this.selectData.value = value
      }else if(this.selectedCond === 4){
      // 设备状态变化
        this.colList = this.deviceStatusChange
        const { funcKey, productKey, funcCompare, funcValue} ={...data.statechange}
        this.selectData.funcKey = funcKey
        this.selectData.productKey = productKey
        this.selectData.funcCompare = funcCompare
        this.selectData.funcValue = funcValue
        const pro = this.lists.productList?.filter(item=>item.productKey === productKey)?.pop() || {}
        this.lists.propsList= []
        this.colList[2].type = 'select'
        await this.handleProductChange(pro,true)
      }
    },

    // 选择条件
    selectCondition(item){
      this.selectedCond = item.value
      if(item.value == 2){
        this.colList = this.weatherList
      } else if(item.value == 4){
        this.colList = this.deviceStatusChange
      }
    },

    // 时间选择滚动
    handleScroll (ele, key,list) {
      this.$nextTick(() => {
        setTimeout(() => {
          const element = this.$refs[ele]
          element.scrollTop = element.scrollTop - element.scrollTop%40
          this[key] = list[element.scrollTop/40 + 3]
        }, 400)
      })
    },

    // 选择星期几
    selectWeek(index){
      this.weekList[index].active = !this.weekList[index].active
    },

    // 星期全选
    selectAllWeek(){
      this.weekList.forEach(item => {
        item.active = true
      });
    },

    // 选中值
    selectValue(key, list, index, col){
      this.selectData[key] = list[index].value
      if(col.change && col.change == 'product') {
        this.handleProductChange(list[index])
        this.lists.propsList= []
        this.colList[2].type = 'select'
      } else if (col.change && col.change == 'func'){
        this.handleFuncChange(list[index])
      }
    },
    
    // 获取产品列表
    async getProductList(){
      const res = await getProductList({page:0})
      if(res.code !==0) return
      this.lists.productList = res.data?.list?.map(item=>{
        return {
          value:item.productKey,
          label:item.name,
          image:item.imageUrl,
          schemeId: item.schemeId,
          productId: item.id,
          productKey:item.productKey,
        }
      }) || []
    },

    // 产品变更
    async handleProductChange(item,isInit){
      // 获取产品指令列表
      this.selectData.productId = item.productId
      const res = await getTranslateFuncList({productId:item.productId, condType: 'triggerCond'})
      if(res.code !==0) return
      const list = res.data?.map(item=>{
        return {
          ...item,
          value: item.dpId,
          label: item.name,
        }
      }) || []
      this.$set(this.lists,'condFuncList',list)
      if(isInit){
        const func = this.lists.condFuncList?.filter(item=>item.dpId == this.selectData.funcKey)?.pop() || {}
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
        this.$set(this.lists,'propsList',propsList)
        this.colList[2].type = 'select'
      }else if(item.dataType === 'BOOL'){
        const list = JSON.parse(item.dataSpecsList)
        const propsList = list.map(t=>{
          return {
            label: t.desc,
            value: t.name,
          }
        })
        this.$set(this.lists,'propsList',propsList)
        this.colList[2].type = 'select'
      }else if(item.dataType === 'INT' || item.dataType == "DOUBLE" || item.dataType == "FLOAT"){
        this.numRange = JSON.parse(item.dataSpecs)
        this.colList[2].type = 'selectInput'
        this.$set(this.lists,'propsList',this.$DictList('operational_character'))
      }else if(item.dataType === 'TEXT'){
        this.numRange = JSON.parse(item.dataSpecs)
        this.colList[2].type = 'textInput'
      }
    },

     // 确认
    async handleOk(){
      let data = {}
      data['conditionType'] = this.selectedCond
      if(this.selectedCond === 3){
      // 定时
      const weeks = this.weekList.filter(item=>item.active).map(item=> item.value)
      data[this.conditonKey[this.selectedCond]] = {
        weeks: weeks.toString() || '',
        value: `${this.hourValue}:${this.minuteValue}`,
      }
      } else if(this.selectedCond === 2){
      // 天气变化
        data[this.conditonKey[this.selectedCond]] = {
          type: this.selectData.type,
          compare: this.selectData.compare || 2,
          value:`${this.selectData.value}`
        }
      }else if(this.selectedCond === 4){
      // 设备状态变化
      if(!this.selectData.productId){
        this.toast('请选择产品')
        return
      } else if (!this.selectData.funcKey){
        this.toast('请选择指令/属性')
        return
      } else if (!`${this.selectData.funcValue}`){
        this.toast('请设定属性值')
        return
      }
        const func = this.lists.condFuncList?.filter(item=>item.dpId === this.selectData.funcKey)?.pop() || {}
        data[this.conditonKey[this.selectedCond]] = {
          funcKey: `${this.selectData.funcKey}`,
          productKey: this.selectData.productKey,
          productId:this.selectData.productId,
          funcCompare:this.selectData.funcCompare || 2,
          funcValue:`${this.selectData.funcValue}`,
          funcIdentifier:func.identifier,
          funcDesc:func.name,
        }
      }
      this.$emit("handleOk", data)
      
    },
    handleCancel(){
      this.$emit("handleCancel")
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
@import "../../../../utils/utils.less";
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
  .condition-list {
    overflow-y: auto;
    height: 400px;
    border-top: 1px solid @aithings-border-color;
    .name{
      padding-bottom: 2px;
      color: @aithings-text-color-black;
      font-weight: 500;
      line-height: 20px;
    }
    .list-item{
      padding: 10px 15px 10px 20px;
      border-bottom: 1px solid @aithings-border-color;
      &.active{
        background: @aithings-search-bg-color;
        .name{
          color: @primary-color;
        }
        
      }
    }

  }

  .set-time-wrap{
    width: 50%;
    border-right: 1px solid @aithings-border-color;
    .time-wrap{
      padding: 45px 80px;
    }
    .hour-list-wrap{
      position: relative;
      height: 210px;
      width: 100px;
      .unit{
        position: absolute;
        top: 120px;
        right: 0;
        width: 100px;
        height: 40px;
        padding-left: 50px;
        color: @primary-color;
        line-height: 40px;
        text-align: center;
        background: rgba(59, 124, 255, 0.1);
        z-index: 0;
      }
      
    }
    .hour-list, .minute-list{
      position: absolute;
      top: 0;
      left: 0;
      height: 280px;
      width: 100px;
      overflow-y: auto;
      overflow-x: visible;
      scrollbar-width: none;
      z-index: 1;
      &::-webkit-scrollbar{
        width: 0px;
        background: none;
      }
      .item{
        height: 40px;
        text-indent: 20px;
        line-height: 40px;
        color: @aithings-text-color-black;
        &.active{
          color: @primary-color;
        }
      }

    }
  }
  .set-repeat-wrap{
    width: 25%;
    .week-text{
      width: 40px;
      height: 40px;
      margin: 12px auto 0;
      font-size: 12px;
      text-align: center;
      line-height: 40px;
      border-radius: 50%;
      color: #fff;
      background: @aithings-text-tips-color;
      &.active{
        background: @primary-color;
      }
    }
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
      .label{
        max-width: 150px;
        .textOverflow();
      }
      .image-wrap+.label{
        max-width: 124px;
        .textOverflow();
      }
      .identifier{
        max-width: 150px;
        .textOverflow();
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
  .compare-sign-wrap{
    height: 100%;
  }
  .compare-sign{
    width: 50%;
    height: 100%;
    border-right: 1px solid @aithings-border-color;
  }
  .num-list-wrap{
    width: 50%;
    height: 100%;
    overflow-y: auto;
  }
  .input-wrap{
    width: 50%;
    padding: 5px 0;
  }
  .text-input-wrap{
    width: 100%;
    padding: 5px 5%;
    border-bottom: 1px solid @aithings-border-color;
    .text-input{
      width: 100%;
    }
  }
  /deep/.ant-input-number{
    width: 100%;
  }
</style>