<template>
  <table-card v-bind="$attrs">
    <template v-slot:moduleName="{record}" >
      <section class="flex y-axis-center">
        <section class="image-wrap">
          <img :src="record.imgUrl" class="module-image"/>
        </section>
        <section>
          <p v-text="record.moduleName" class="module-name"></p>
          <a target="_blank" :href="record.fileUrl" class="check-doc">{{$t('setting.hardware.develop.check.doc')}} ></a>
        </section>
      </section>
    </template>
    <template v-slot:type="{record}">
      <p>{{$DictName('firmware_type',record.type)}}</p>
    </template>
    <template v-slot:action="{record}" >
      <a-button type="link" v-if="record.active === 0 && !record.disabled" @click="handleSelect(record)">{{$t('setting.hardware.develop.select')}}</a-button>
      <a-button type="link" v-if="record.active === 1" disabled>{{$t('setting.hardware.develop.selected')}}</a-button>
      <a-button type="link" v-if="record.associated" disabled>{{$t('setting.hardware.develop.associated')}}</a-button>
    </template>
  </table-card>
</template>
<script>
import TableCard from "@/components/tableCard/index.vue"

  export default ({
    name:"HardwareTableCard",
    inheritAttrs: true,
    props:{
      productId: { type: String, default: '' },
      status: { type: Number, default: 0 },
    },
    components:{
      TableCard,
    },
    data() {
      return {
      }
    },
    methods: {
      // 选择模组
      async handleSelect(record){
        this.$emit('handleSelect',record)
      },

      // 解除关联自定义固件
      disassociate(record){
        this.$emit('disassociate',record)
      }
    }
  })
</script>
<style lang="less" scoped>
@import "../../../../../global.less";

  .image-wrap{
    width: 64px;
    height: 64px;
    margin-right: 11px;
    .module-image {
      max-width: 62px;
      max-height: 62px;
      border-radius: 4px;
    }
  }
  /deep/ .ant-btn-link{
    padding: 0;
    &:focus{
      border: 0;
    }
  }
  /deep/ .ant-btn-sm {
    height: 28px;
    border-color: @primary-color;
    color: @primary-color;
    &:focus,&:hover{
      border-color: @primary-color;
      color: @primary-color;
    }
  }
  /deep/.ant-btn-link:disabled{
    color: @aithings-text-color-gray;
  }
  .check-doc{
    color: @primary-color;
  }
  .module-name{
    color: @aithings-text-color-black;
  }
</style>