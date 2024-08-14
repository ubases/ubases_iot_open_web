<template>
  <a-modal
    :title="$t('oemApp.link.products')"
    :width="600"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :closable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
  <p class="detail">{{ $t('oemApp.link.products.detail') }}</p>
  <a-button class="green-border-button all-link" @click="handleAddAll">{{ $t('oemApp.link.products.all') }}</a-button>
    <a-spin :spinning="confirmLoading">
      <section class="wrap">
        <section class="tag-list">
          <div v-for="item in selectedList" :key="item.id" class="tag-item">
            {{ item.name }}
            <a-icon class="close-icon" type="close" @click="handleDelete(item)"/>
          </div>
        </section>
        <a-select v-model="currentValue" class="select-box" @change="handleChange" :placeholder="$t('oemApp.link.products.placeholder')">
          <a-select-option v-for="item in unselectedList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </section>
    </a-spin>
  </a-modal>
</template>

<script>

import { getBindedProducts, handleBindProducts } from "@/api/appExploit"

export default ({
  name: "LinkProducts",
  props: {
    appKey: { type: String, default: '' },
    appName: { type: String, default: '' },
    allProductList:{ type: Array, default: [] },
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
      this.getBindedProducts()
    }
  },
  methods: {
    // 获取关联的产品
    async getBindedProducts(){
      const res = await getBindedProducts({appKey:this.appKey})
      if(res.code!==0) return
      this.selectedList = res.data?.map(item=>{
        return{
          id:item.productId,
          name:item.productName,
          key:item.productKey
        }
      }) || []
      console.log(this.selectedList)
      this.unselectedList = this.allProductList.filter(data => !this.selectedList.find(item => item.id === data.id))
    },
    // 删除
    handleDelete(data){
      this.selectedList = this.selectedList.filter(item => item.id !== data.id)
      this.unselectedList = [...this.unselectedList, data]
    },

    // 一键关联所有
    handleAddAll(){
      this.selectedList = [...this.allProductList]
      this.unselectedList = []
    },

    // 选中产品
    handleChange(value){
      const data  = this.unselectedList.filter(item=>item.id === value)
      this.selectedList = [...this.selectedList,...data]
      this.unselectedList = this.unselectedList.filter(item => item.id !== value)
      this.currentValue = ''
    },

    handleCancel(){
      this.$emit('handleCancel')
    },

    // 确认
    async handleOk(){
      const res = await handleBindProducts({appKey:this.appKey,appName:this.appName,productList:this.selectedList})
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