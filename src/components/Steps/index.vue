<template>
  <section class="flex y-axis-ceter steps-wrap">
    <div 
    v-for="(item,index) in stepList" 
    :key="index" 
    :class="['flex y-axis-center step-item',{finished: !item.disabled},{active:activeStep === index+1},{disabled: item.disabled}]"
    @click="handleClick(item,index)"
    >
      <div class="step-serial" v-text="index+1"></div>
      <div class="step-name" v-text="item.name"></div>
    </div>
  </section>
</template>

<script>

export default {
  name:"Steps",
  props:{
    activeStep:{ type: Number, default: 1},
    stepList:{ type: Array, default: ()=>[]}
  },
  data(){
    return{

    }
  },
  methods:{
    handleClick(item,index){
      if(item.disabled) return
      this.$emit('stepChange',index+1)
    }
  }
  
}
</script>

<style lang="less" scoped>
@import "../../global.less";
@import "../../utils/utils.less";
.step-item{
  flex: 1;
  position: relative;
  height: 48px;
  padding-left: 35px;
  border-top: 1px solid @aithings-color-E9EAEE;
  border-bottom: 1px solid @aithings-color-E9EAEE;
  cursor: pointer;
  &.disabled{
    cursor: no-drop;
  }
  &:first-child{
    border-left: 1px solid @aithings-color-E9EAEE;
    padding-left: 14px;
  }
  &:last-child{
    border-right: 1px solid @aithings-color-E9EAEE;
  }
  &:not(:last-child){
    &::after, &::before{
      border: 24px solid transparent;
      border-left: 21px solid #fff;
      width: 0;
      height: 0;
      position: absolute;
      top: 0px;
      right: -44px;
      content: ' ';
      z-index: 999;
    }
    &::before{
      border-left-color: @aithings-color-E9EAEE;
      right: -45px;
    }
  }
  .step-serial{
    width: 26px;
    height: 26px;
    border: 2px solid @aithings-color-E9EAEE;
    border-radius: 50%;
    line-height: 24px;
    text-align: center;
    font-size: 16px;
    color: @aithings-color-BDBDBD;
  }
  .step-name{
    padding-left: 11px;
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
    color: @aithings-color-999999;
  }
  &.finished{
     .step-serial{
      border: 2px solid @primary-color;
      color: @primary-color;
    }
    .step-name{
      color: @primary-color;
    }
    // &:not(:last-child){
    //   &::after, &::before{
    //     border: 23px solid transparent;
    //     border-left: 21px solid #fff;
    //     right: -44px;
    //   }
    // }
  }
  &.active{
    background: @primary-color;
    border-top: 1px solid @primary-color;
    border-bottom: 1px solid @primary-color;
    &:first-child{
      border-left: 1px solid @primary-color;
    }
    &:last-child{
      border-right: 1px solid @primary-color;
    }
    .step-serial{
      border: 2px solid #fff;
      background: @primary-color;
      color: #fff;
    }
    .step-name{
      color: #fff;
    }
    &:not(:last-child){
      &::after, &::before{
        border: 23px solid transparent;
        border-left: 21px solid @primary-color;
        right: -44px;
      }
    }
  }

}
</style>