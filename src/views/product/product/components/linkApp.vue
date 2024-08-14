<template>
  <a-modal
    :title="$t('product.link.app')"
    :width="600"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :closable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
  <p class="detail">{{ $t('product.link.app.detail') }}</p>
  <a-button class="green-border-button all-link" @click="handleAddAll">{{ $t('product.link.app.all') }}</a-button>
    <a-spin :spinning="confirmLoading">
      <section class="wrap">
        <section class="tag-list">
          <div v-for="item in selectedList" :key="item.key" class="tag-item">
            {{ item.name }}
            <a-icon class="close-icon" type="close" @click="handleDelete(item)"/>
          </div>
        </section>
        <a-select v-model="currentValue" class="select-box" @change="handleChange" :placeholder="$t('product.link.app.placeholder')">
          <a-select-option v-for="item in unselectedList" :key="item.key" :value="item.key">{{ item.name }}</a-select-option>
        </a-select>
      </section>
    </a-spin>
  </a-modal>
</template>

<script>

import { getBindedApp, handleBindApp } from "@/api/product"

export default ({
  name: "linkApp",
  props: {
    productId: { type: String, default: '' },
    produtKey: { type: String, default: '' },
    allAppList:{ type: Array, default: [] },
    visible: { type: Boolean, default: false },
  },
  components:{

  },
  data() {
    return {
      confirmLoading: false,
      selectedList:[],
      unselectedList:[],
      currentValue:''
    }
  },
  watch: {
    visible(val){
      if(!val) return
      this.unselectedList = this.allAppList
      this.getBindedApp()
    }
  },
  methods: {
    // 获取关联的产品
    async getBindedApp(){
      const res = await getBindedApp({productId:this.productId})
      if(res.code!==0) return
      this.selectedList =  res.data?.map(item=>{
        return{
          id:item.id,
          name:item.appName,
          key:item.appKey
        }
      }) || []
      this.unselectedList = this.allAppList.filter(data => !this.selectedList.find(item => item.key === data.key))
    },
    // 删除
    handleDelete(data){
      this.selectedList = this.selectedList.filter(item => item.key !== data.key)
      this.unselectedList = [...this.unselectedList, data]
    },

    // 一键关联所有
    handleAddAll(){
      this.selectedList = [...this.allAppList]
      this.unselectedList = []
    },

    // 选中
    handleChange(value){
      console.log(value)
      const data  = this.unselectedList.filter(item=>item.key === value)
      this.selectedList = [...this.selectedList,...data]
      this.unselectedList = this.unselectedList.filter(item => item.key !== value)
      this.currentValue = ''
    },

    handleCancel(){
      this.$emit('handleCancel')
    },

    // 确认
    async handleOk(){
      const res = await handleBindApp({productId:this.productId,produtKey:this.produtKey,appList:this.selectedList})
      if(res.code!==0) return
      this.$emit('handleOk')
    }
  }
})
</script>


<style lang="less" scoped>
@import "../../../../global.less";

.all-link{
  position: absolute;
  right: 30px;
  top: 20px;
}
.tag-list{
  display: flex;
  flex-wrap: wrap;
}
.tag-item{
    margin: 15px 15px 0 0;
    padding: 6px 15px;
    font-size: 12px;
    color: #70757D;
    line-height: 18px;
    border-radius: 16px;
    border: 1px solid #70757D;
}
.close-icon{
  padding-left: 15px;
}
.select-box{
  margin-top: 20px;
  width: 400px;
}
.wrap{
  padding-bottom: 40px;
}
</style>