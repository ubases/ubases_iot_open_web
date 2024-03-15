<template>
  <section>
    <a-row class="thread" v-if="type ==='table'">
      <a-col v-for="col in columnList" :key="col.name" :span="col.span">
        {{col.name}}
      </a-col>
    </a-row>
    <section>
      <a-row :class="['card',{'active':item.active === 1},{'disabled':item.disabled}]" v-for="(item,index) in dataList" :key="index" type="flex" align="middle">
        <a-col v-for="col in columnList" :key="col.slot" :span="col.span">
          <slot :name="col.slot" v-bind:record="item">{{item[col.slot]}}</slot>
        </a-col>
      </a-row>
    </section>
  </section>
</template>
<script>


  export default ({
    name:"TableCard",
    props: {
      columnList: {type:Array, default: ()=>[]},
      dataList: {type:Array, default: ()=>[]},
      type: {type:String, default: 'table'}, // table表格，card卡片
    },
    data() {
      return {
      }
    },
    methods: {

    }
  })
</script>
<style lang="less" scoped>
@import "../../../../global.less";
@import "../../../../utils/utils.less";
.thread {
  padding: 11px 15px;
  background: @aithings-table-thread-color;
  font-weight: 600;
  line-height: 20px;
}
.card {
  .radio-card();
  padding: 14px 15px;
  border: 0;
  border-bottom: 1px solid @aithings-border-color;
  &.active{
    border: 1px solid @primary-color;
  }
  &.disabled{
    background: @aithings-table-thread-color;
    cursor: no-drop;
  }
}
</style>
