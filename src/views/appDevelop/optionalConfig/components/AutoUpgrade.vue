<template>
  <section class="container">
    <section class="content-wrap">
      <h4 class="title">{{$t('optionalConfig.autoUpgrade.title')}}</h4>
      <p class="tips">{{$t('optionalConfig.autoUpgrade.tips1')}}</p>
      <p class="tips">{{$t('optionalConfig.autoUpgrade.tips2')}}</p>
      <a-form-model ref="form" class="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item :label="$t('optionalConfig.autoUpgrade.label.iosUrl')" prop="iosAddr">
          <a-input v-model="form.iosAddr" :placeholder="$t('optionalConfig.autoUpgrade.placeholder.iosUrl')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('optionalConfig.autoUpgrade.label.androidUrl')" prop="androidInterAddr">
          <a-input v-model="form.androidInterAddr" :placeholder="$t('optionalConfig.autoUpgrade.placeholder.androidUrl')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('optionalConfig.autoUpgrade.label.androidAbroadUrl')" prop="androidOuterAddr">
          <a-input v-model="form.androidOuterAddr" :placeholder="$t('optionalConfig.autoUpgrade.placeholder.androidAbroadUrl')"/>
        </a-form-model-item>
      </a-form-model>
    </section>
    <footer class="footer">
      <a-button @click="handleSave" class="save-button">{{$t('optionalConfig.ThirdPartyService.saveAndPublish')}}</a-button>
    </footer>
  </section>
</template>

<script>
import { getAutoUpgrade, saveAutoUpgrade} from '@/api/optionalConfig'

  export default {
    name:"AutoUpgrade",
    props:{
      appId: {type: String, default:''},
      version: {type: String, default:''},
    },
    data(){
      return {
        form: {},
        id: ''
      }
    },
    created(){
      if(this.appId) this.getAutoUpgrade()
    },
    watch: {
      appId (val) {
        if(!val) return
        this.getAutoUpgrade()
      },
    },
    methods:{
      // 获取配置
      async getAutoUpgrade(){
        const res = await getAutoUpgrade({appId: this.appId, version: this.version})
        if(res.code !== 0) return
        this.id = res.data?.id
        this.form = res.data?.downloadAddr
      },

      // 保存并发布
      async handleSave(){
        const res = await saveAutoUpgrade({id: this.id, downloadAddr:this.form})
        if(res.code !== 0 )return
        this.$message.success(this.$t('public.save.ok'))
        this.getAutoUpgrade()
      },
    }
  }
</script>
<style scoped lang="less">
@import "../../../../global.less";
@import "../../../../utils/utils.less";
.container{
  position: relative;
  height: 100%;
}
.content-wrap{
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 20px;
}
.title{
  padding-bottom: 10px;
}
.tips{
  color: @aithings-text-color-gray;
  line-height: 20px;
}
.ant-form{
  padding-top: 30px;
  max-width: 840px;
  .ant-form()
}
.footer{
  position: absolute;
  bottom:0;
  left: 0;
  height: 60px;
  width: 100%;
  text-align: center;
  background: #FFFFFF;
  box-shadow: 0px -1px 14px 0px rgba(131, 146, 167, 0.16);
  border-radius: 0px 0px 4px 4px;
  line-height: 60px;
  .save-button{
    width: 180px;
    background: @primary-color;
    border: 1px solid @primary-color;
    color: #fff;
  }
}
</style>