<template>
  <a-modal
    :title="$t('public.warm.prompt')"
    :width="800"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <span class="details">{{$t('buildTips.details')}}</span>
      <span class="tips">{{$t('buildTips.tips')}}</span>
      <section>
        <a-checkbox-group v-model="os">
          <div class="card" v-for="item in packageList" :key="item.key">
            <a-checkbox :value="item.key" :disabled="!data[item.checkKey] || data[item.checkKey].isPass !== 1">{{item.name}}</a-checkbox>
            <section class="details-content">
              <p class="details" v-for="(text,index) in item.detail" :key="index">{{text}}</p>
              <p v-if="data[item.checkKey] && data[item.checkKey].isPass == 2" class="error">{{ data[item.checkKey].cause }}</p>
            </section>
          </div>
        </a-checkbox-group>
      </section>
    </a-spin>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel">{{$t('public.cancel')}}</a-button>
      <a-button key="submit" type="primary" :disabled="os.length === 0" @click="handleOk">{{$t('buildTips.build.button')}}</a-button>
    </template>
  </a-modal>
</template>
<script>

export default {
 name:"BuildTips",
 props:{
   visible:{ type:Boolean, default:false },
   data:{ type:Object, default:()=>{} },
 },
 data(){
    return{
      confirmLoading:false,
      os:[],
      packageList:[
        {
          name: this.$t('buildTips.package.name.iosCert'),
          key:'1',
          checkKey:"iosCert",
          detail:[
            this.$t('buildTips.package.detail1.iosCert'),
            this.$t('buildTips.package.detail2.iosCert'),
          ]
        }, {
          name: this.$t('buildTips.package.name.androidCert'),
          key:'2',
          checkKey:"androidCert",
          detail:[
            this.$t('buildTips.package.detail1.androidCert'),
            this.$t('buildTips.package.detail2.androidCert'),
          ]
        },{
          name: this.$t('buildTips.package.name.androidCert.overseas'),
          key:'3',
          checkKey:"androidCert",
          detail:[
            this.$t('buildTips.package.detail1.androidCert.overseas'),
          ]
        },
      ]
    }
 },
methods:{
  handleCancel(){
    this.$emit("cancel")
  },

  handleOk(){
    this.$emit("sumit",this.os)
  }
 }
}
</script>
<style scoped lang="less">
@import "../../../../../global.less";
.card{
  margin-top: 20px;
  padding: 20px 16px;
  border: 1px solid @aithings-border-color;
}
/deep/.ant-checkbox-wrapper{
  margin-bottom: 13px;
  font-size: 15px;
  font-weight: 600;
  color: @aithings-text-color-black;
  line-height: 16px;
}
/deep/.ant-checkbox + span{
  padding-left: 13px;
}
/deep/.ant-modal-body{
  padding-bottom: 56px;
}
.details-content{
  padding-left: 27px;
}
.details{
  color: @aithings-text-color-gray;
  line-height: 22px;
}
.error{
  padding-top: 5px;
  color: @aithings-color-F5222D;
}
.tips{
  color: @aithings-warning-color-FF8E35;
}
</style>