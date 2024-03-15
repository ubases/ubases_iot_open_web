<template>
  <section class="flex y-axis-center card" @click="handleClick">
    <section class="card-img-wrap flex xy-axis-center">
      <img :src="imgUrl" class="card-img"/>
    </section>
    <section>
      <slot></slot>
    </section>
  </section>
</template>
<script>

export default ({
  name:"RadioCard",
  props: {
    data:{ type: Object, default: ()=>{}},
    imgUrl:{ type: String, default: ''},
  },
  methods: {
    handleClick(){
      this.$emit('cardSelected', this.data)
    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
@import "../../../../utils/utils.less";
  .card{
    margin: 15px 10px 15px 0;
    padding: 5px;
    .radio-card();
    .card-img-wrap{
      width: 64px;
      height: 64px;
      margin-right: 5px;
      .card-img {
        max-width: 62px;
        max-height: 62px;
        border-radius: 4px;
      }
    }
  }
</style>
