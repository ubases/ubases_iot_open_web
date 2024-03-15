<template>
  <section class="container">
    <section class="content-wrap flex x-space-between">
      <section class="config-content">
        <h4>{{$t('optionalConfig.ThirdPartyService.title')}}</h4>
        <a-checkbox-group @change="handleChange" v-model="thirdData">
          <div class="card flex" v-for="(item,index) in serviceList" :key="index">
            <section class="flex y-axis-center">
              <a-checkbox :value="item.code"></a-checkbox>
              <img :src="getImage(item)" class="image"/>
              <span class="name">{{item.name}}</span>
              <p class="apple-detail" v-if="item.code == 'appleid'">{{$t('optionalConfig.ThirdPartyService.apple.detail')}}</p>
            </section>
            <section class="config-deatils" v-if="item.code !== 'appleid'">
              <a-form-model ref="form" class="form" :model="item" :rules="rules" layout="inline">
                <a-form-model-item label="App ID" prop="appId" v-if="item.code == 'wechat'">
                  <a-input v-model="item.appId" :maxLength="50" :placeholder="$t('optionalConfig.ThirdPartyService.placeholder.appId')"/>
                </a-form-model-item>
                <a-form-model-item label="App Secret" prop="appKey" v-if="item.code == 'wechat'">
                  <a-input v-model="item.appKey" :maxLength="50" :placeholder="$t('optionalConfig.ThirdPartyService.placeholder.appKey')"/>
                </a-form-model-item>
                <a-form-model-item  v-if="item.code == 'wechat'" label="Universal Links" prop="universalLink">
                  <a-input v-model="item.universalLink" disabled/>
                  <a-button type="link" class="copy-button" v-clipboard:copy="item.universalLink" v-clipboard:success="onCopy">
                    <icon-font type="icon-copy" :style="{ fontSize: '16px' }" />{{$t('public.copy')}}
                  </a-button>
                </a-form-model-item>
                <a-form-model-item label="client ID" prop="clientId" v-if="item.code == 'google'">
                  <a-input v-model="item.clientId" :maxLength="50" :placeholder="$t('optionalConfig.ThirdPartyService.rules.clientID')"/>
                </a-form-model-item>
              </a-form-model>
            </section>
          </div>
        </a-checkbox-group>
      </section>
    </section>
    <footer class="footer">
      <a-button @click="handleSave" class="save-button">{{$t('optionalConfig.ThirdPartyService.saveAndPublish')}}</a-button>
    </footer>
  </section>
</template>
<script>
import { getThirdService,saveThirdService } from '@/api/optionalConfig'

export default {
  props:{
    appId: {type: String, default:''},
    version: {type: String, default:''},
  },
  data(){
    return {
      rules:{
        appId:[
          { required: true, message: this.$t('optionalConfig.ThirdPartyService.rules.appId'), trigger: 'blur'}
        ],
        appKey:[
          { required: true, message: this.$t('optionalConfig.ThirdPartyService.rules.appKey'), trigger: 'blur' }
        ],
        clientId:[
          { required: true, message: this.$t('optionalConfig.ThirdPartyService.rules.clientID'), trigger: 'blur' }
        ],
      },
      id:'',
      thirdData:[],
      serviceList:[],
    }
  },
  watch:{
    appId(val){
      if(val) {
        this.clearAllValidate()
        this.getThirdService()
      }
    }
  },
  created(){
    if(this.appId) this.getThirdService()
  },
  methods:{
    
    // 三方服务获取
    async getThirdService(){
      const res = await getThirdService({appId: this.appId, version: this.version})
      if(res.code !== 0) return
      this.id = res.data.id
      const data = res.data.thirdList
      this.thirdData = []
      this.serviceList = data.map(item => {
        if(item.isCheck == 1) {
          this.thirdData.push(item.code)
        } 
        return { ...item, clientId:item.appId}
      });
      this.changeRule(this.thirdData)
    },

    // 选择切换
    handleChange(val){
      this.serviceList = this.serviceList.map(item=>{
        if(!val || val.length === 0){
          item.isCheck = 0
        } else{
          item.isCheck = val.some(num=>num ==item.code) ? 1:0
        }
        return item
      })
      this.changeRule(this.thirdData)
      this.clearValidate()
      
    },

    // 图片
    getImage(item){
      if(item.isCheck == 1) {
        return require(`../../../../assets/image/optionalConfig/login_${item.code}_active.png`)
      } else{
         return require(`../../../../assets/image/optionalConfig/login_${item.code}.png`)
      }
    },

    // 保存并发布
    async handleSave(){
      let isValid = false
      const formList = this.$refs.form?.filter(item=>item.model.isCheck==1)
      if(formList && formList.length > 0){
        formList.forEach( form=>{
          form.validate(async(valid) => {
            if (!valid) {
              isValid = true
              return
            }
          })
          if(isValid) return
        })
      }
      if(isValid) return
      this.serviceList.forEach(item=>{
        if(item.code == 'google'){
          item.appId = item.clientId
        }
      })
      const res = await saveThirdService({id: this.id, thirdList:this.serviceList})
      if(res.code !== 0 )return
      this.$message.success(this.$t('public.save.ok'))
      this.getThirdService()
    },
    
    changeRule(codes){
      if(codes.includes('wechat')){
        this.rules.appId = [{ required: true, message: this.$t('optionalConfig.ThirdPartyService.rules.appId'), trigger: 'blur'}]
        this.rules.appKey = [{ required: true, message: this.$t('optionalConfig.ThirdPartyService.rules.appKey'), trigger: 'blur' }] 
      } else{
        this.rules.appId = []
        this.rules.appKey = [] 
      }
      if(codes.includes('google')){
        this.rules.clientId = [{ required: true, message: this.$t('optionalConfig.ThirdPartyService.rules.clientID'), trigger: 'blur' }]
      } else{
        this.rules.clientId = []
      }
    },

    // 重置未选中表单校验
    clearValidate(){
      const formList = this.$refs.form?.filter(item => item.model.isCheck == 0)
      if(!formList) return
      formList.forEach( form => {
        form.clearValidate()
      })
    },

    // 重置表单校验
    clearAllValidate () {
      const formList = this.$refs.form
      if(!formList) return
      formList.forEach( form => {
        form.clearValidate()
      })
    },

    onCopy() {
      this.$message.success(this.$t('public.copy.succeed'));
    },
  }
}
</script>


<style scoped lang="less">
@import "../../../../global.less";
@import "../../customizedApp/configuration/components/common.less";
.container{
  position: relative;
  height: 100%;
}
.content-wrap{
  height: calc(100% - 60px);
  overflow-y: auto;
  .config-content{
    flex:1;
    padding: 20px;
  }
}
/deep/.ant-checkbox-group{
  width: 100%;
}
.explain{
  padding-top: 10px;
  color: @aithings-text-color-gray;
  line-height: 20px;
}
.apple-wrap{
  padding-left: 16px;
}
.apple-detail{
  padding-left: 20px;
  flex:1;
}
.card{
  width: 100%;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid @aithings-border-color;
  .image{
    width: 48px;
    height: 48px;
    margin: 0 10px;
  }
  .name{
    min-width: 90px;
    font-size: 14px;
    color: @aithings-text-color-black;
    line-height: 20px;  
  }
  .config-deatils{
    padding-left: 20px;
  }
  .form{
    padding: 20px 0 0;
    min-height: 80px;
    .ant-input{
      width: 220px;
      border: 1px solid @aithings-border-color;
      background: @aithings-table-thread-color;
      &::placeholder{
        color: @aithings-text-tips-color;
      }
    }
  }
  .ant-form-inline .ant-form-item{
    margin-right: 36px;
  }
  .ant-form-item-label > label{
    color: @aithings-text-color-gray;
  }
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