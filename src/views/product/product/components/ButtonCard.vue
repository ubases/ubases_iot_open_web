<template>
  <section class="card-wrap">
    <p class="title" v-text="data.title"></p>
    <p class="details" v-text="data.details"></p>
    <a-button class="regular-button" :disabled="data.disabled" @click="handleClick">{{ data.buttonText }}</a-button>
  </section>
</template>

<script>


export default ({
  name:"ButtonCard",
  props:{
    data: {type:Object, default: ()=>{}}
  },
  methods:{
    handleClick() {
      this.$emit('handleClick',this.data)
    }
  }

})
</script>

<style lang="less" scoped>
@import "../../../../global.less";
  .card-wrap{
    border: 1px solid @aithings-border-color;
    padding: 20px;
    .title{
      font-weight: 600;
      color: @aithings-text-color-black;
      line-height: 20px;
      padding-bottom: 5px;
    }
    .details{
      line-height: 18px;
      color: @aithings-text-color-gray;
    }
    /deep/.ant-btn{
      margin-top: 15px;
      padding: 0 35px;
      border: 1px solid @primary-color;
      color: @primary-color;
      &:disabled {
        background: @aithings-table-thread-color;
        border: 1px solid @aithings-border-color;
        color: @aithings-text-tips-color;
      }
    }
  }
</style>