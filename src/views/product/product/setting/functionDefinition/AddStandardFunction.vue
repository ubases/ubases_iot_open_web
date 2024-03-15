<template>
    <a-modal
    :title="$t('setting.add.Standard.function.title')"
    :width="750"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <section class="content flex">
        <section class="function-list-wrap">
          <section class="header flex y-axis-center x-space-between">
            <span>{{$t('setting.add.Standard.function.select')}}</span>
            <a-button type="link" @click="selectAll">{{$t('setting.add.Standard.function.select.all')}}</a-button>
          </section>
          <section class="list" >
            <section v-for="item in functionList" :key="item.id" @click="addFunction(item)" class="list-item tap-pointer flex y-axis-center x-space-between">
              <section>
                <p class="function-name" v-text="item.name"></p>
                <section class="flex y-axis-center">
                  <p class="function-point" v-text="`DP ID：${item.dpid}`"></p>
                  <p class="function-point" v-text="$t('setting.add.Standard.function.identifier')+`：${item.identifier}`"></p>
                </section>
              </section>
              <a-icon type="right"/>
            </section>
          </section>
        </section>
        <section class="function-list-wrap">
          <section class="header flex y-axis-center x-space-between" >
            <span v-text="$t('setting.add.Standard.function.selected')+`(${this.selectedList.length})`"></span>
            <a-button type="link" @click="deleteAll">{{$t('setting.add.Standard.function.delete.selected')}}</a-button>
          </section>
          <section class="list" >
            <section v-for="(item,index) in selectedList" :key="item.id" class="list-item select-item flex y-axis-center x-space-between">
              <section class="function-info-wrap">
                <p class="function-name" v-text="item.name"></p>
                <section class="flex y-axis-center function-info">
                  <p class="function-point point-id" v-text="`ID:${item.id}`"></p>
                  <p class="function-point identifier" v-text="$t('setting.add.Standard.function.identifier')+`:${item.identifier}`"></p>
                </section>
              </section>
              <a-icon type="close" @click="deleteFunction(index)"/>
            </section>
          </section>
        </section>
      </section>
    </a-spin>
  </a-modal>
</template>

<script>

import { getStandardFuncList,addStandardFunc } from "@/api/product"
export default ({
  name:"AddStandardFunction",
  components:{
  },
  props:{
    list: { type: Array, default: ()=>[] },
    visible: { type: Boolean, default: false },
    productId: { type: String, default: ''},
    baseProductId: { type: String, default: ''}
  },
  data(){
    return {
      confirmLoading: false,
      selectedList: [],
      functionListAll:[],
      functionList:[],
    }
  },
  watch: {
    selectedList() {
      this.functionList = this.functionListAll.filter(item => !this.selectId.includes(item.id))
    },

    async visible(val){
      if(!val)return
      this.selectedList= []
      await this.getStandardFuncList()
    },

  },
  computed:{
    selectId () {
      return this.selectedList.map(item => item.id) ?? []
    },
  },
  mounted(){
  },
  methods:{
    // 标准功能列表
    async getStandardFuncList(){
      const res = await getStandardFuncList({baseProductId:this.baseProductId})
      if(res.code !==0) return
      const list = res.data?.list
      if(!list || list.length== 0) return
      const listIdentifiers = this.list.map(item=>item.identifier)
      this.functionListAll = list.filter(item => !listIdentifiers.includes(item.identifier))
      this.functionList = this.functionListAll
    },

     // 确认
    async handleOk(){
      this.confirmLoading = true
      const res = await addStandardFunc({productId:this.productId, funcList:this.selectedList})
      this.confirmLoading = false
      if(res.code !== 0) return
      this.$emit("confirmEdit")
      this.$message.info(this.$t('public.add_success'))
    },
    handleCancel(){
      this.$emit("cancelEdit")
    },
    // 添加功能
    addFunction(item) {
      this.selectedList.push(item)
    },

    // 删除功能
    deleteFunction(index){
      this.selectedList.splice(index,1)
    },

    //全部选择
    selectAll() {
      this.selectedList = [...this.selectedList, ...this.functionList]
    },

    // 删除已选功能
    deleteAll() {
      this.selectedList = []
    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
@import "../../../../../utils//utils.less";
  .content{
    width: 100%;
    border: 1px solid @aithings-border-color;
  }
  .function-list-wrap{
    flex: 1;
    .header{
      height: 52px;
      padding: 0 20px;
      background: @aithings-search-bg-color;
      color: @primary-color;
    }
  }
  .function-list-wrap + .function-list-wrap {
    border-left: 1px solid @aithings-border-color;
  }
  .list {
    overflow-y: auto;
    max-height: 500px;
    min-height: 50px;
    .list-item{
      padding: 10px 20px;
      border-bottom: 1px solid @aithings-border-color;
    }
    .select-item{
      width: 330px;
      margin: 20px;
      border: 1px solid @aithings-border-color;
    }
    .function-info-wrap{
      width: 270px;
      .function-info{
        width: 100%;
        
      }
    }
    .function-name{
      width: 100%;
      padding-bottom: 2px;
      color: @aithings-text-color-black;
      font-weight: 500;
      line-height: 20px;
      .textOverflow()
    }
    .function-point{
      
      color: @aithings-text-color-gray;
      line-height: 18px;
      font-size: 12px;
      
    }
    .function-point + .function-point {
      padding-left: 8px;
    }
    .point-id{
      width: 145px;
      .textOverflow()
    }
    .identifier{
      width: 115px;
      .textOverflow()
    }
  }
  
  
  .anticon-right, .anticon-.close{
    color: @aithings-text-color-gray;
  }
  /deep/ .ant-btn-link{
    padding: 0;
    color: @primary-color;
  }
  
</style>