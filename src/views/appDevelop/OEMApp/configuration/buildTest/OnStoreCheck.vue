<template>
  <section class="page-content">
    <h4 class="title">{{$t('OnStoreCheck.title')}}</h4>
    <p class="details">{{$t('OnStoreCheck.details')}}</p>
    <div style="height:20px" class="space"></div>
    <p class="details">{{$t('OnStoreCheck.tips')}}</p>
    <div style="height:20px" class="space"></div>
    <a-row :gutter="[20,20]">
      <a-col v-for="(item,index) in configList" :key="index" :xs="24" :md="8" >
        <div class="card flex y-axis-center x-space-between">
          <div class="flex y-axis-center">
            <div class="status-icon flex x-axis-center">
              <template v-if="data[item.key]">
                <component :is="statusIconList[data[item.key].isPass]" />
              </template>
            </div>
            <h2>{{item.name}}</h2>
            <div v-if="item.required" class="required-text">{{$t('public.must')}}</div>
          </div>
          <a-button :class="{'check-config':data[item.key] && data[item.key].isPass == 1}" @click="config(item)">
            {{ data[item.key] && data[item.key].isPass == 1 ? $t('public.checkConfig')+' >' : $t('public.goConfig') }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </section>
</template>
<script>
import { InfoIcon,SuccessBlueIcon,ErrorLargeIcon } from '@/core/icons'

export default {
  props:{
    data:{ type:Object, default:()=>{} },
  },
  components:{
    InfoIcon,
    SuccessBlueIcon,
    ErrorLargeIcon
  },
  data (){
    return {
      configList:[
        {name: this.$t('OnStoreCheck.iosCert'), required:true, key:'iosCert',tab:3},
        {name: this.$t('OnStoreCheck.androidCert'), required:true, key:'androidCert',tab:4 },
        {name: this.$t('OnStoreCheck.userPact'), required:true, key:'userPact',tab:1},
        {name: this.$t('OnStoreCheck.userPrivacy'), required:true, key:'userPrivacy',tab:2}
      ],
      statusIconList:{
        1:"SuccessBlueIcon",
        2:"ErrorLargeIcon",
      },
    }
  },
  methods:{

    config(item){
      this.$emit('changeTab',{activeStep:3, activeTab:item.tab})
    },

  }

}
</script>
<style scoped lang="less">
@import "../../../../../global.less";

.page-content{
  padding: 20px;
}
.title{
  padding: 0 0 10px;
  font-size: 15px;
  line-height: 21px;
}
.details{
  color: @aithings-text-color-gray;
  line-height: 22px;
}
.card{
  height: 80px;
  padding: 0 20px;
  border-radius: 4px;
  border: 1px solid @aithings-border-color;
}
.required-text{
  margin-left: 10px;
  width: 43px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid @aithings-color-FF3333;
  font-size: 10px;
  color: @aithings-color-FF3333;
  line-height: 20px;
  text-align: center;
}
/deep/.ant-btn{
  border-color: @primary-color;
  color: @primary-color;
  width: 91px;
}
.check-config{
  border: 0;
}

.status-icon{
  padding-right: 10px;
  svg{
    width: 24px;
    height: 24px;
  }
}
</style>