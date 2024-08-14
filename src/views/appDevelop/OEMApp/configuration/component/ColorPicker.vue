<template>
  <section class="color-picker-popover" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
    <div :class="['color-btn tap-pointer flex y-axis-center',{disabled}]">
      <div class="color-wrap" :style="{background: color,width:`${size.width}px`,height:`${size.height}px`}"></div>
      <p class="color-text" v-text="color"></p>
    </div>
    <section class="color-picker-wrap" :style="{top:size.height + 12}" v-if="showPicker">
      <section class="color-picker">
        <sketch-picker v-model="pickerColor" />
        <section class="footer flex y-axis-center">
          <div class="circle"></div>
          <p class="tap-pointer back-default" @click="reset">{{$t('public.restore.default.value')}}</p>
          <a-button class="sumit-btn" @click="sumit">{{ $t('public.sumit') }}</a-button>
        </section>
      </section>
    </section>
  </section>
</template>
<script>

import sketch from "@/components/ColorPicker/Sketch.vue"

export default {
  props:{
    color: { type: String, default: '' },
    size: { type: Object, default: ()=>{}},
    disabled:{ type: Boolean, default: false}
  },
  components: {
    'sketch-picker': sketch,
  },
  data(){
    return {
      showPicker: false,
      pickerColor:''
    }
  },

  mounted(){
    this.pickerColor = this.color
  },
  
  methods:{
    handleMouseenter(){
      if(this.disabled) return
      this.showPicker = true
      this.pickerColor = this.color
    },

    handleMouseleave(){
      this.showPicker = false
    },

    reset(){
      this.pickerColor = this.color
    },

    sumit(){
      this.showPicker = false
      this.$emit("sumitColor", this.pickerColor)
    }
  }
}
</script>
<style scoped lang="less">
@import "../../../../../global.less";
.color-picker-popover{
  position: relative;
  .color-picker-wrap{
    position: absolute;
    left: -20px;
    z-index: 99;
    padding-top: 10px;
  }
  .color-picker{
    background: #fff;
    box-shadow: 0px 1px 8px 2px rgba(0, 0, 0, 0.11);
  }
}
.color-btn{
  padding: 6px 15px;
  border: 1px solid @aithings-border-color;
  border-radius: 25px;
  .color-wrap{
    border-radius: 50%;
  }
  .color-text{
    padding-left: 9px;
    color: @aithings-text-color-gray;
  }
  &.disabled{
    cursor: no-drop;
  }
}
.footer{
  padding: 20px 10px 10px;
  justify-content: flex-end;
  .circle{
    width: 12px;
    height: 12px;
    background: @aithings-color-E9EAEE;
    border: 1px solid @aithings-border-color;
    border-radius: 50%;
  }
  .back-default{
    padding: 0 10px 0 4px;
    color: @primary-color;
  }
  .sumit-btn{
    height: 26px;
    padding: 0 10px;
    border-color: @aithings-text-tips-color;
    color: @aithings-text-color-black;
    font-weight: 600;
  }
}
</style>