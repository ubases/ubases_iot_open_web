<template>
  <a-modal
      :title="changeType === 'module'? $t('setting.hardware.develop.replace.module'): $t('setting.hardware.develop.relevance.firmware.title')"
      :width="1060"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <p class="tips">{{$t('setting.hardware.develop.relevance.firmware.tips')}}</p>
        <hardware-table-card 
          v-bind="$attrs"

          type="table" 
          :productId ="productId"
          @handleSelect="handleSelect"
          >
        </hardware-table-card>
      </a-spin>
    </a-modal>
</template>
<script>
  import HardwareTableCard from "./HardwareTableCard.vue"

  export default ({
    name:"HardwareTableCard",
    inheritAttrs: true,
    props: {
      productId: { type: String, default: '' },
      visible: { type: Boolean, default: false },
      changeType: { type: String, default: ''},
    },
    components:{
      HardwareTableCard,
    },
    data() {
      return {
        confirmLoading: false
      }
    },
    created(){
    },
    computed:{
      newDataList(){
        return [...this.dataList]
      },
      newColumnList(){
        return [...this.columnList]
      },
    },
    methods: {
      handleSelect(data){
        // this.dataList.forEach(item => {
        //   if( item.id === data.id ) item.active = 1
        //   if(item.firmwareType == data.firmwareType) item.diasbled = true
        // })
        // this.$emit('handleSelect')
      },

      handleCancel(){
        this.$emit('handleCancel')
      }
    }
  })
</script>
<style lang="less" scoped>
  @import "../../../../../global.less";
  .tips{
    color: @aithings-warning-color-FF8E35;
  }
</style>