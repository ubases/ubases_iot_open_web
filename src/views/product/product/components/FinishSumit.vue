<template>
  <a-modal
    :title="$t('setting.finish.sumit.title')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :ok-button-props="{ props: { disabled: okButtonIsDisabled } }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p class="warning-text">{{$t('setting.finish.sumit.warning.text')}}</p>
      <a-descriptions :title="$t('setting.finish.sumit.basic.info')" :column="1">
        <a-descriptions-item :label="$t('setting.finish.sumit.label.networkType')"> {{$DictName('network_type',data.networkType)}}</a-descriptions-item>
        <a-descriptions-item :label="$t('setting.finish.sumit.label.productTypeName')"> {{data.productTypeName}}</a-descriptions-item>
      </a-descriptions>
      <p class="setting-title">
        {{$t('setting.finish.sumit.label.config.info')}}
      </p>
      <a-list bordered :data-source="list">
        <a-list-item  slot="renderItem" slot-scope="item">
          <section class="flex y-axis-center x-space-between item-content">
            <section class="flex y-axis-center">
              <component :is="item.valid ? 'FinishedIcon':'WarningIcon'"/>
              <span v-if="item.valid" class="item-label" v-text="`${item.key}：`"></span>
              <span v-if="item.valid" class="item-value" v-text="item.title"></span>
              <span v-if="!item.valid"  class="item-tips" v-text="$t('setting.finish.sumit.please.select')+`${item.key}`"> </span>
            </section>
            <a-button v-if="!item.valid" @click="setting(item.code)">{{$t('setting.finish.sumit.set.button')}}</a-button>
          </section>
          <img v-if="item.url" :src="item.url" class="item-image"/>
        </a-list-item>
      </a-list>
    </a-spin>
  </a-modal>
</template>

<script>
import {FinishedIcon,  WarningIcon,} from '@/core/icons'
import {getCompleteDevelop, completeDevelop} from '@/api/product'

export default ({
  name: "FinishSumit",
  components:{
    FinishedIcon,
     WarningIcon,
  },
  props: { 
    visible: { type: Boolean, default: false },
    productId:{ type: String, default: ''},
    data: {type: Object, default:()=>{}}
  },
  data(){
    return {
      confirmLoading:false,
      list:[],
    }
  },
  computed:{
    okButtonIsDisabled(){
      return this.list.some(item=>!item.valid)
    }
  },
  mounted(){

  },
  watch:{
    visible(val){
      if(val){
        this.getCompleteDevelop()
      }
    }
  },
  methods:{
    //获取详情
    async getCompleteDevelop(){
      const res = await getCompleteDevelop({productId:this.productId})
      if(res.code !==0) return
      this.list = res.data.list ?? []
    },
    // 确认
    async handleOk() {
      const res = await completeDevelop({id: this.productId})
      if(res.code !== 0)return
      this.$emit("confirmFinished")
      this.$message.info(this.$t('public.action.succeed'))
      
    },
    // 取消
    handleCancel(){
      this.$emit("cancelFinish")
    },

    // 去配置项
    setting(code) {
      this.$emit("toSeting",code)
    }
  }

})
</script>

<style lang="less" scoped>
@import "../../../../global.less";

  .warning-text{
    color: @aithings-warning-color;
    line-height: 20px;
  }
  .title{
    display: block;
    margin-top: 20px;
    font-weight: 600;
    color: @aithings-text-color-black;
  }
  /deep/.ant-descriptions-title, .setting-title{
    margin-bottom: 15px;
    font-size: 14px;
    font-weight: 600;
    color: @aithings-text-color-black;
  }
  /deep/.ant-descriptions-title{
    padding-top: 20px;
  }
  /deep/.setting-title{
    padding-top: 10px;
  }
  /deep/.ant-descriptions-item,.ant-descriptions-row > th, .ant-descriptions-row > td{
    padding-bottom: 10px;
  }
  /deep/ .ant-descriptions-item-label{
    text-align: right;
    width: 70px;
    color: @aithings-text-color-gray;
  }
  /deep/.ant-descriptions-item-content{
    color: @aithings-text-color-black;
  }
  
  /deep/.ant-list-item{
    display: block;
    padding: 18px 16px;
    border-bottom: 1px solid @aithings-border-color;
  }
  /deep/.ant-list-bordered{
    border: 1px solid @aithings-border-color;
  }

  /deep/.item-content{
    width: 100%;
    .item-label{
      padding-left: 10px;
      color: @aithings-text-color-gray;
    }
    .item-value {
      color:@aithings-text-color-black;
    }
    .item-tips{
      padding-left: 10px;
      color:@aithings-text-color-black;
    }
    .ant-btn{
      color: @primary-color;
      border: 1px solid @primary-color;
      padding: 0 23px;
      height: 32px;
    }
  }
  
  /deep/.item-image{
    display: block;
    margin-top: 15px;
    max-width: 50%;
    max-height: 300px;
  }

</style>