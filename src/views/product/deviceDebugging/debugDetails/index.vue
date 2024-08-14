<template>
  <section class="page-wrap no-padding limit-height">
    <a-page-header :title="`${deviceId}`+$t('debugDetails.title')"  @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <div class="debug-content">
        <section class="content-left">
          <h3>{{$t('debugDetails.instructions.report')}}</h3>
          <span class="remind">{{$t('debugDetails.remind')}}</span>
          <div class="report-content">
            <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
              <a-form-model-item :label="item.name" v-for="item in functionList" :key="item.id">
                <a-select 
                  v-if="item.dataType == 'ENUM' || item.dataType == 'FAULT'" 
                  v-model="form[item.dpid]" 
                  :options="item.options"
                  :allowClear="true"
                  :disabled="type == 1 && item.rwFlag == 'READ'"
                  placeholder="please select" />
                <a-select 
                  v-if="item.dataType == 'BOOL'" 
                  :value="form[item.dpid] === undefined ? undefined : `${form[item.dpid]}`"
                  :options="item.options"
                  :allowClear="true"
                  :disabled="type == 1 && item.rwFlag == 'READ'"
                  @change="e=>handleChange(e,item.dpid)"
                  placeholder="please select" />
                <a-input 
                  v-if="item.dataType == 'TEXT'" 
                  :maxLength="Number(item.dataSpecs.length)"  
                  v-model="form[item.dpid]" 
                  :disabled="type == 1 && item.rwFlag == 'READ'"
                  @blur="e=>inputChange(form[item.dpid],item.dpid)"/>
                <a-input-number 
                  v-if="item.dataType == 'INT'" 
                  :min="Number(item.dataSpecs.min)" 
                  :max="Number(item.dataSpecs.max)" 
                  :step="item.dataSpecs.step"
                  :precision="0"
                  v-model="form[item.dpid]" 
                  :disabled="type == 1 && item.rwFlag == 'READ'"
                  @blur="e=>inputChange(form[item.dpid],item.dpid)"/>
                <a-input-number 
                  v-if="item.dataType == 'DOUBLE' || item.dataType == 'FLOAT'" 
                  :min="Number(item.dataSpecs.min)" 
                  :max="Number(item.dataSpecs.max)" 
                  :precision="3"
                  v-model="form[item.dpid]"
                  :disabled="type == 1 && item.rwFlag == 'READ'"
                  @blur="e=>inputChange(form[item.dpid],item.dpid)" />
                <span v-if="item.dataSpecs.unit">&nbsp;&nbsp;{{$DictName('properties_unit', item.dataSpecs.unit) || item.dataSpecs.unit}}</span>
                <a-button type="link" @click="clearOrder(item)">{{ $t('debugDetails.msg.clear') }}</a-button>
              </a-form-model-item>
            </a-form-model>
            <section>
              <section class="preparation-text" v-if="preparation">
                <p>{{ $t('debugDetails.prestarting') }}...</p>
                <p>{{ $t('debugDetails.about5minutes') }}</p>
              </section>
              <div :class="['report tap-pointer',{disable: preparation}]" @click="sentMsg">{{$t('debugDetails.send')}}</div>
              <div class="clear-all tap-pointer" @click="resetOrder">{{ $t('debugDetails.clear.allInstruction') }}</div>
            </section>
          </div>
        </section>
        <section class="content-right" style="border-left:1px solid #DAE6F8">
          <div class="news-title">
            <h3>{{$t('debugDetails.msg.record')}}</h3>
            <div class="flex x-space-between search">
              <div class="flex y-axis-center ">
                <a-input
                  class="search-input"
                  v-model="searchKey"
                  :placeholder="$t('debugDetails.searchKey.placeholder')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
                <a-button type="primary" @click="query">{{$t("public.query")}}</a-button>
                <a-button  class="regular-button" @click="reset">{{$t("public.reset")}}</a-button>
              </div>
              <div class="clear tap-pointer" @click="clearRecord">{{$t('debugDetails.msg.clear.record')}}</div>
            </div>
           
          </div>
          <div ref="msgContent" class="news-content" @scroll="handleScroll"> 
            <div class="msg-item" v-for="(item,index) in filterMsgRecord" :key="index">
              <div class="header flex y-axis-center x-space-between">
                <div>{{item.time}}</div>
                <div>{{item.topic}}</div>
              </div>
              <div class="content">{{item.msgStr}}</div>
            </div>
          </div>
        </section>
      </div>
    </a-page-header>
  </section>
</template>

<script>
import { getFuncList } from "@/api/product"
import moment from "moment";
import { mapGetters } from "vuex"
import { randomString,isNull } from "@/utils/util"


export default ({
  name:"debugDetails",
  data(){
    return {
      labelCol: { xl:{span: 8}, md: {span: 8}},
      wrapperCol: { xl:{span: 15}, md: {span: 16}},
      form: {},
      newsList:[],
      productKey:'',
      productId:'',
      functionList:[],
      deviceId:'',
      propsList:[],
      msgRecordList:[],
      mqttServer:'',
      isOnline: 0, // 是否上线 0 未上线， 1 上线
      type:0,  // 1 真实设备， 2 虚拟设备
      multipleDpids:{}, //有倍数的dpid
      searchKey:'',
      searchKeyFilter:'',
      isNeedScroll:true
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    preparation(){
      return this.type == 2 && this.isOnline == 0
    },
    filterMsgRecord(){
      const key = this.searchKeyFilter.trim()
      if(isNull(key)){
        return this.msgRecordList
      } else {
        return this.msgRecordList.filter(item=>item.topic.includes(key) || item.msgStr.includes(key))
      }
    }
  },
  mounted (){
    this.productKey = this.$route.query.productKey
    this.productId = this.$route.query.productId
    this.deviceId = this.$route.query.did
    this.type = this.$route.query.type
    this.getFuncList()
  },
  methods:{
    // 获取功能列表
    async getFuncList(){
      const res = await getFuncList({productId:this.productId,custom:-1})
      if(res.code !==0) return
      this.mqttServer = res.data?.webMQTT
      this.controlInit()
      const list = res.data?.list || []
      this.functionList = list.map(item => {
        if((item.dataType == 'ENUM' || item.dataType == 'FAULT') &&  item.dataSpecsList){
          item.options = JSON.parse(item.dataSpecsList).map(item => {
            return {
              value: item.value,
              label: item.name
            }
          })
        }
        if(item.dataType == 'BOOL'){
          const isSet = item.identifier?.split('_')?.pop()
          if(isSet === 'set'){
            item.options =[{value: 'true', label: 'true'}]
          } else if(item.dataSpecsList){
            item.options = JSON.parse(item.dataSpecsList).map(item => {
              return {
                value: item.name,
                label: item.name
              }
            })
          } else{
            item.options =[{value: 'true', label: 'true'},{value: 'false', label: 'false'}]
          }
          
        }
        if(item.dataType == 'INT' || item.dataType == 'DOUBLE' || item.dataType == 'FLOAT'){
          const dataSpecs = JSON.parse(item.dataSpecs)
          if(dataSpecs.multiple && dataSpecs.multiple != 0 && dataSpecs.multiple != 1){
            this.multipleDpids[item.dpid] = Number(dataSpecs.multiple)
          }
        }
        if(item.dataSpecs) item.dataSpecs = JSON.parse(item.dataSpecs)
        return item
      })
      this.propsList = this.functionList.map(item => item.dpid)
    },

    sentMsg(){
      if(this.preparation) return
      let data = this.$deepClone(this.form)
      // 对于有倍数的数值进行处理
      Object.keys(this.form).forEach((item)=>{
        if(this.multipleDpids.hasOwnProperty(item)){
          data[item]= data[item]*this.multipleDpids[item]
        }
      })
      Control.setProps({...data})
    },

    // 消息检索
    query(){
      this.searchKeyFilter = this.searchKey
    },
    reset(){
      this.searchKeyFilter = ''
      this.searchKey = ''
    },

    // 清空所有指令
    resetOrder(){
      this.form = {}
    },

    // 清空指令
    clearOrder(item){
      delete this.form[item.dpid]
      this.form = {...this.form}
    },

    // 收到消息
    sendMsgContent(topic,msg){
      const content = {
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        topic,
        msg,
        msgStr:JSON.stringify(msg)
      }
      this.msgRecordList.push(content)
      if(this.isNeedScroll){
        this.updateMsgView()
      }
    },

    // 初始化mqtt
    controlInit(){
      const param = {mqttServer:this.mqttServer, productKey:this.productKey, deviceId:this.deviceId}
      const options = {username: this.userInfo?.userName || '',password: this.userInfo?.userName || '',clientId: "webdbg_" + randomString(32)}
      Control.init(param,options)
      // 获取属性回调
      Control.registerQueryPropCallBack = this.registerPropCallBack;
      // 修改属性回调
      Control.registerReportCallBack = this.registerReportCallBack;
      // 设备在线回调
      Control.registerOnlineCallBack = this.registerOnlineCallBack;
      // 设备信息回调
      Control.registerDeviceInfoCallBack = this.registerDeviceInfoCallBack;
      // 发送消息回调
      // Control.sendMsgContentCallBack = this.sendMsgContentCallBack;
      // 控制触发上报
      Control.registerControlReportCallBack = this.registerReportCallBack;
      // 查询触发上报
      Control.registerQueryReportCallBack = this.registerReportCallBack;

      //连接mqtt监听消息回调
      Control.start()
      //获取所有属性
      Control.getProps(this.propsList);
    },
    //获取属性 或 属性发生变化回调
    registerPropCallBack(props,topic,msg) {
      this.form = {...this.form, ...props}
      this.sendMsgContent(topic,msg)
    },
    registerOnlineCallBack(online,topic,msg) {
      this.isOnline = online
      this.sendMsgContent(topic,msg)
    },
    registerDeviceInfoCallBack(devInfo,topic,msg) {
      //设备信息回调
      this.sendMsgContent(topic,msg)
    },
    registerReportCallBack(props,topic,msg){
      // 设备上报的消息
      this.sendMsgContent(topic,msg)
    },

    // 清空记录
    clearRecord(){
      this.msgRecordList = []
    },

    // 布尔值变化
    handleChange(e,key){
      if(e){
        this.$set(this.form, key, JSON.parse(e))
      } else {
        this.$set(this.form, key, undefined)
      }
    },
    // 数字输入框变化
    inputChange(val,key){
      if (val === null || val === undefined){
        this.$set(this.form, key, undefined)
      }
    },
    // 消息记录框滚到底部
    updateMsgView(){
      this.$nextTick(function() {
        this.$refs.msgContent.scrollTop=this.$refs.msgContent.scrollHeight
      });
    },

    // 默认滚动，用户往上滚动后则不滚动，置底后继续滚动
    handleScroll(e){
      if(this.$refs.msgContent.scrollTop!==this.$refs.msgContent.scrollHeight-this.$refs.msgContent.offsetHeight){
        this.isNeedScroll = false
      } else{
        this.isNeedScroll = true
      }
    }

  },

  beforeDestroy(){
    Control.end()
  }
})
</script>

<style lang="less" scoped>
  @import "../../../../global.less";

  .limit-height, /deep/.ant-page-header{
    height: 100%;
  }
  /deep/.ant-page-header-heading{
    padding: 16px 20px !important;
    border-bottom: 1px solid @aithings-border-color;
  }
  /deep/.ant-page-header-content{
    padding-top: 0;
    height: calc(100% - 65px);
  }
  .debug-content{
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  .ant-form{
    height: calc(100% - 50px);
    overflow-y: auto;
    width: 450px;
    background: #FFFFFF;
    border-radius: 10px;
    border: 3px solid @aithings-color-E9EAEE;
    margin: 10px 30px 40px;
    padding: 30px 0;
  }
  /deep/.ant-form-item-label > label{
    color: @aithings-text-color-gray ;
  }
  /deep/.ant-form-item-label{
    min-height: 35px;
    line-height: normal;
    padding-right: 12px;
    white-space:break-spaces;
    display: flex;
    justify-content: right;
    align-items: center;
  }
  /deep/.ant-form-item-label > label::after{
    display: none;
  }
  /deep/.ant-form-item-control{
    line-height: 34px;
  }
  /deep/.ant-form-item{
    margin-bottom: 20px;
  }
  /deep/.ant-input{
    width: 120px;
  }
  /deep/.ant-select{
    width: 200px;
  }
  .content-left{
    padding: 22px 55px 0 20px;
    height: 100%;
    .remind{
      padding-top: 15px;
      height: 35px;
      font-size: 14px;
      font-weight: 400;
      color: @aithings-text-color-gray;
      line-height: 35px;
    }
    .report-content{
      height: calc(100% - 58px);
      display: flex;
      align-items: center;
      .preparation-text{
        padding-bottom: 4px;
        color: @aithings-color-FF3333;
        text-align: center;
      }
      .report{
        text-align: center;
        width: 110px;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        background: @primary-color;
        border-radius: 4px;
        &.disable{
          opacity: 0.4;
          cursor: no-drop;
        }
      }
      .clear-all{
        margin-top: 20px;
        width: 110px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: @primary-color;
        border: 1px solid @primary-color;
        border-radius: 4px;
      }
    }
  }
  .content-right{
    padding-top: 22px;
    min-width:200px;
    flex: 1;
    height: 100%;
    .news-title{
      padding:0 20px;
    }
    .clear{
        text-align: center;
        width: 100px;
        height: 34px;
        font-size: 14px;
        font-weight: 400;
        color: @primary-color;
        line-height: 34px;
        border-radius: 4px;
        border: 1px solid @primary-color;
      }
      .search-input{
        width: 220px;
        display: block;
        margin-right: 10px;
        /deep/.ant-input{
          width: 220px;
        }
      }
      .search{
        padding-top: 10px;
        button+button{
          margin-left: 10px;
        }
      }
    .news-content{
      height: calc(100% - 90px);
      overflow-y:auto;
      min-width: 200px;
      width: 100%;
      background: @aithings-table-thread-color;
      margin-top: 24px;
      padding:0 20px;
      .msg-item{
        border-bottom: 1px solid @aithings-color-E9EAEE; 
        padding:20px 0
      }
      .header{
        margin-bottom:10px;
        font-size: 14px;
        font-weight: 600;
        color: @aithings-text-color-black;
        line-height: 34px;
        
        border-radius: 2px;
        div{
          background: @aithings-border-color;
          padding: 0 5px;
        }
      }
      .content{
        font-size: 14px;
        font-weight: 400;
        color: @aithings-text-color-black;
        line-height: 22px;
        word-wrap: break-word;
      }
    }
  }
  @media (max-width: @screen-xl) {
    .content-left{
      padding: 22px 10px 0 20px;
    }
    /deep/.ant-form{
      margin: 10px 10px 10px 0;
      width: 340px;
    }
    /deep/.ant-input{
      width: 120px;
    }
    /deep/.ant-select{
      width: 140px;
    }
    .content-right  .news-content{
      padding: 0 12px;
    }
  }
</style>