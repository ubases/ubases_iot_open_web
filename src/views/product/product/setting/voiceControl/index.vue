<template>
  <section class="page-content">
    <p class="details">{{$t('setting.voiceControl.detail')}}</p>
    <p class="prompt">{{$t('setting.voiceControl.warm.prompt')}}</p>
    <section class="card" v-for="item in originList" :key="item.voiceNo">
      <section class="content flex y-axis-center x-space-between">
        <section class="flex y-axis-center">
          <img :src="item.voiceLogo" class="image"/>
          <div class="name">{{item.voiceName}}</div>
          <div :class="['status-text',{'published': item.status == 3}]" v-if="item.status == 2 || item.status == 3">{{$DictName('voice_control_status',item.status)}}</div>
        </section>
        <section class="flex y-axis-center">
          <a-button v-if="item.status == 2" type="primary" class="publish-button" @click="handlePublish(item)">{{$t('setting.voiceControl.publish.button')}}</a-button>
          <a-button v-if="item.status == 3" type="link" @click="checkRecord(item)">{{$t('setting.voiceControl.release.record')}}</a-button>
          <a-button class="config-scheme" @click="configScheme(item)">{{$t('setting.voiceControl.config.scheme')}}</a-button>
        </section>
      </section>
      <section class="config-functions">
        <p v-if="item.status == 1" class="no-config-text">{{$t('setting.voiceControl.noConfig')}}</p>
        <p v-if="item.status !== 1">{{$t('setting.voiceControl.configured')}}</p>
        <section v-if="item.funList" class="flex y-axis-center functions-wrap">
          <div v-for="(func, index) in item.funList" :key="index" class="function-item">
            {{func}}
          </div>
        </section>

      </section>
    </section>
  </section>

</template>
<script>
import { getVoiceConfigList, setVoiceConfigStatus } from '@/api/product'

export default {
  name: "VoiceControl",
  props:{
    productId: { type: String, default: '' },
    productTypeId: { type: String, default: '' },
    details: { type: Object, default: () => {} },
    status: { type: Number, default: 0 },
  },

  components:{},

  data(){
    return {
      originList: [],
    }
  },
  watch:{
    'details.productKey'(){
      this.getVoiceConfigList()
    }
  },

  mounted(){
    this.getVoiceConfigList()
  },

  methods:{
    async getVoiceConfigList(){
      const res = await getVoiceConfigList({productKey: this.details.productKey})
      if(res.code !== 0) return
      this.originList = {...res.data}
    },

    // 发布
    handlePublish(item){
      this.$ConfirmModal(this, this.$t('setting.voiceControl.publish.confirm.msg'), this.$t('setting.voiceControl.publish.confirm.title')).then(async() => {
        const res = await setVoiceConfigStatus({productKey:this.details.productKey, status: item.status, voiceNo: item.voiceNo})
        if(res.code !== 0) return
        this.$message.success(this.$t('public.action.succeed'))
        this.getVoiceConfigList()
      })
    },

    // 配置方案
    configScheme(item){
      const path = '/product/product/setting/voiceControl/configScheme/index'
      const query = { 
              productId: this.productId, 
              productKey: this.details.productKey, 
              id: item.id, 
              voiceNo:item.voiceNo, 
              voiceName: item.voiceName, 
              productName: this.details.name
            }
      if(item.status === 3){
        this.$ConfirmModal(this, this.$t('setting.voiceControl.configRemind.content'), this.$t('setting.voiceControl.configRemind.title')).then(async() => {
          this.$router.push({ path, query })
        })
      } else{
        this.$router.push({ path, query })
      }
      
    },

    // 查看发布记录
    checkRecord(item){
      this.$router.push({ 
        path: '/product/product/setting/voiceControl/releaseRecord/index', 
        query:{ 
          productId: this.productId, 
          productKey: this.details.productKey,
          voiceNo: item.voiceNo,
        } 
      })
    }
  }
}
</script>


<style scoped lang="less">
@import "../../../../../global.less";


  .page-content{
    padding-top: 16px;
    height: 100%;
  }
  .details{
    color: @aithings-text-color-gray;
    line-height: 20px;
  }
  .prompt{
    padding-top: 10px;
    color: @aithings-warning-color-FF8E35;
  }
  .image{
    max-width: 48px;
    max-height: 48px;
  }
  .name{
    text-indent: 10px;
    color: @aithings-text-color-black;
  }
  .config-scheme{
    margin-left: 10px;
    width: 120px;
    border: 1px solid @primary-color;
    color: @primary-color;
  }
  .publish-button{
    width: 120px;
  }
  .card {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid @aithings-border-color;
  }
  .status-text {
    margin-left: 10px;
    padding: 2px 11px;
    font-size: 10px;
    color: @aithings-text-tips-color;
    line-height: 14px;
    border-radius: 10px;
    border: 1px solid @aithings-text-tips-color;
  }
  .published {
    color: @aithings-green-color-38CB52;
    border: 1px solid @aithings-green-color-38CB52;
  }
  .config-functions {
    width: 100%;
    margin-top: 20px;
    padding: 20px;
    background: @aithings-color-F6F6F8;
    border-radius: 4px;
  }
  .no-config-text {
    line-height: 20px;
  }
  .functions-wrap{
    padding-top: 15px;
  }
  .function-item {
    margin: 0 10px 10px 0;
    padding: 6px 20px;
    background: #fff;
    font-size: 12px;
    color: @aithings-text-color-gray;
    line-height: 18px;
    border-radius: 16px;
    border: 1px solid @aithings-text-color-gray;
  }
</style>