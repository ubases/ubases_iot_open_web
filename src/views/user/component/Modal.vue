<template>
  <a-modal
    title=""
    :visible="visible"
    :width="250"
    :maskClosable="false"
    :closable="false"
    :footer="null"
    :centered="true"
  >
  <div class="content">
    <finish-large-icon />
    <p class="title" v-text="title"></p>
    <p class="details">{{$t('user.register.toDashboard')}}(0{{time}}S)</p>
  </div>
  
  </a-modal>
</template>

<script>
import { FinishLargeIcon } from '@/core/icons'
export default ({
  name:"Modal",
  props:{
    visible:{ type: Boolean, default: false},
    title:{ type: String, default: ''},
  },
  components:{
    FinishLargeIcon,
  },
  data() {
    return {
      time: 3,
      timer:null
    }
  },
  watch: {
    visible (val){
      if(val) this.countDown()
    }
  },
  methods:{
    countDown () {
      this.timer = window.setInterval(()=>{
      this.time--
      if(this.time===0 || this.time < 0) {
        window.clearInterval(this.timer)
        this.$router.push({ path: "/dashboard/index" });
      }
    },1000)
    }
  },

   beforeDestroy(){
    window.clearInterval(this.timer)
  }
  
})
</script>

<style lang="less" scoped>
/deep/ .ant-modal-mask{
  background: none;
}
/deep/ .ant-modal-content{
  height: 180px;
  background: rgba(52, 58, 64, 0.7);
  border-radius: 8px;
  .ant-modal-body{
    padding: 0;
    height: 100%;
  }
}
.content{
  padding-top: 29px;
  color: #fff;
  text-align: center;
  .title{
    font-size: 24px;
    line-height: 33px;
  }
  .details{
    margin-top: 5px;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>