<template>
  <section class="no-data-wrap">
    <img src="../../assets/image/no-data.png"/>
    <h3>{{$t('public.no.data')}}</h3>
    <p class="details" v-text="text"></p>
    <a-button type="primary" class="grean-button" @click="add">
      <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
      {{buttonText}}
    </a-button>
  </section>
</template>
<script>

export default {
  name:"NoData",
  props:{
    text:{ type:String, default:'' },
    buttonText:{ type:String, default:'' },
    path:{ type:String, default:'' },
  },
  methods:{
    add(){
      this.$router.push({ path: this.path })
    }
  }
}
</script>
<style scoped lang="less">
@import "../../global.less";
  .no-data-wrap{
    margin-top: 110px;
    text-align: center;
    img{
      margin: 0 auto;
      width: 96px;
      height: 96px;
    }
    h3{
      padding: 13px 0 10px;
      font-size: 16px;
      font-weight: 400;
      color: @aithings-text-color-black;
      line-height: 22px;
    }
    .details{
      color: @aithings-text-color-gray;
      line-height: 20px;
    }
    .grean-button{
      margin: 25px auto 0;
      width: 116px;
    }
  }
</style>