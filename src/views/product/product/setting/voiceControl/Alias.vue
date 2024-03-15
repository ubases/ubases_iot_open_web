<template>
   <div class="flex y-axis-center">
    <div class="name-list flex y-axis-center">
      <template v-for="(name, index) in nameList">
        <a-tag :key="index" :closable="index !== 0" class="add-tag" @close="() => handleClose(name)">
          {{ name }}
        </a-tag>
      </template>
    </div>
    <a-input
      v-if="inputVisible"
      ref="input"
      type="text"
      :style="{ width: '100px' }"
      v-model="inputValue"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag v-if="!inputVisible && nameList.length < 10" class="add-tag" @click="showInput">
      设置别名，可设置多个
    </a-tag>
  </div>
</template>
<script>
export default ({
  name:"Alias",
  props:{
    names:{ type:Array, default:()=>[] },
  },

  components:{
  },

  data(){
    return {
      nameList:[],
      inputVisible: false,
      inputValue: '',
    }
  },
  computed:{

  },

  watch:{
    names(){
      this.nameList = this.$deepClone(this.names)
    }
    
  },

  mounted(){
    
  },

  methods:{

    showInput() {
      this.inputVisible = true;
      this.$nextTick(function() {
        this.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      const inputValue = this.inputValue;
      let nameList = this.nameList
      if (inputValue && nameList.indexOf(inputValue) === -1) {
        nameList = [...nameList, inputValue];
      }
      Object.assign(this, {
        nameList,
        inputVisible: false,
        inputValue: '',
      });
    },
  }
})
</script>

<style lang="less" scoped>
@import "../../../../../global.less";

.add-tag{
  height: 34px;
  border:1px solid @aithings-border-color;
  line-height: 32px;
  background: #ffffff;
}
.name-list{
  max-width: 250px;
  overflow-x: auto;
  flex-wrap: nowrap;
}
</style>