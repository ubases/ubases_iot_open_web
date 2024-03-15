<template>
  <section class="container">
    <section class="content-wrap flex x-space-between">
      <section class="config-content">
        <h4>{{$t('optionalConfig.VoiceService.title')}}</h4>
        <p class="explain">{{$t('optionalConfig.VoiceService.explain')}}</p>
        <a-checkbox-group @change="handleChange" v-model="voiceData">
          <div class="card" v-for="(item,index) in serviceList" :key="index">
            <a-checkbox :value="item.code" :disabled="item.disabled"></a-checkbox>
            <img :src="getImage(item)" class="image"/>
            <span class="name">{{item.name}}{{item.disabled ? $t('optionalConfig.not.opened') : ''}}</span>
            <section v-if="item.isRequired" class="config-deatils">
              <section class="flex y-axis-center">
                <a-button v-if="item.isSave" class="edit-button" @click="copyUrl(item)">{{$t('optionalConfig.copy.authorize.url')}}</a-button>
                <a-button class="edit-button" @click="editHelpDoc(item)">{{$t('optionalConfig.VoiceService.editDoc')}}</a-button>
              </section>
              <div v-if="item.langs">
                <span>{{$t('optionalConfig.VoiceService.uploadDoc')}}：</span>
                <span v-for="lang in item.langs" :key="lang" @click="checkDoc(item,lang)" class="lang-type tap-pointer">{{$FilterLabel(langTypeOptions,lang,'code','name')}}</span>
              </div>
            </section>
          </div>
        </a-checkbox-group>
      </section>
      
      <!-- 效果预览 -->
      <section class="preview-wrap">
        <h4 class="config-title">{{$t('optionalConfig.VoiceService.preview')}}</h4>
        <section class="preview-phone-wrap">
          <section class="service-wrap">
            <div class="title-wrap flex y-axis-center x-space-between">
              <h5 class="title">{{$t('optionalConfig.VoiceService.preview.title')}}</h5>
              <p class="more">{{$t('optionalConfig.VoiceService.preview.more')}}</p>
            </div>
            <section class="service-list flex">
              <div v-for="item in previewList" :key="item.code" class="service-item">
                <img :src="getImage(item)"/>
                <p class="name">{{item.name}}</p>
              </div>
            </section>
          </section>
        </section>
        <p class="tips">{{$t('optionalConfig.VoiceService.preview.tips')}}</p>
      </section>
    </section>
    <footer class="footer">
      <a-button @click="handleSave" class="save-button">{{$t('optionalConfig.VoiceService.saveAndPublish')}}</a-button>
    </footer>
    <editor :visible="editVisible" :data="editItem" @cancel="handleClose" @sumit="handleClose"/>
    <doc :visible="docVisible" :data="checkItem" :lang="checkLang" @cancel="handleDocClose"/>
    <copy-auth-url :visible="copyVisible" :data="copyData" @cancel="cancelCopy"/>
  </section>
</template>
<script>
import { langTypeList } from '@/api/common'
import Editor from './Editor.vue'
import Doc from './Doc.vue'
import { getVoice, saveVoice } from '@/api/optionalConfig'
import CopyAuthUrl from './CopyAuthUrl.vue'

export default {

  props:{
    appId: {type: String, default:''},
    appKey: {type: String, default:''},
    version: {type: String, default:''},
  },

  components:{
    Editor,
    Doc,
    CopyAuthUrl
  },

  data(){
    return {
      originList: [
        {
          name:this.$t('optionalConfig.VoiceService.name.alexa'),
          code:'alexa',
          isRequired: false,
          clientId:'',
          clientScrect:'',
        },{
          name:this.$t('optionalConfig.VoiceService.name.google'),
          code:'google',
          isRequired: false,
          clientId:'',
          clientScrect:'',
        },{
          name:this.$t('optionalConfig.VoiceService.name.tianmao'),
          code:'tianmao',
          isRequired: false,
          clientId:'',
          clientScrect:'',
        },{
          name: this.$t('optionalConfig.VoiceService.name.xiaoai'),
          code:'xiaoai',
          isRequired: false,
          clientId:'',
          clientScrect:'',
        },{
          name: this.$t('optionalConfig.VoiceService.name.xiaomi'),
          code:'xiaomi',
          isRequired: false,
          clientId:'',
          clientScrect:'',
        },
      ],
      langTypeOptions: [],
      editVisible: false,
      docVisible: false,
      checkItem: {},
      editItem: {},
      checkLang: '',
      id: '',
      voiceData: [],
      serviceList: [],
      copyVisible: false,
      copyData:{}
    }
  },

  computed:{
    previewList(){
      return this.serviceList.filter(item => item.isRequired)
    }
  },

  created(){
    this.getLangList()
  },

  watch:{
    appId(val){
      if(!val) return
      this.getVoice()
    }
  },

  methods:{

    // 语音服务获取
    async getVoice(type){
      const res = await getVoice({appId: this.appId, version: this.version})
      if(res.code !== 0) return
      this.id = res.data.id
      const data = res.data.voiceList
      if(type == 'lang'){
        this.serviceList = this.serviceList.map(item=>{
          item.langs = res.data.voiceList.filter(v=>v.code === item.code)?.pop()?.langs || []
          return item
        })
        return
      }
      this.voiceData = []
      this.serviceList = this.originList.map(item => {
        const required = data.filter(ele=>ele.code == item.code)?.pop()
        if(required) {
          this.voiceData.push(required.code)
          return { ...item, ...required, isRequired: true, isSave: true}
        } else{
          return {...item}
        }
      })
    },

    // 图片
    getImage(item){
      if(item.isRequired) {
        return require(`../../../../assets/image/optionalConfig/${item.code}_active.png`)
      } else{
         return require(`../../../../assets/image/optionalConfig/${item.code}.png`)
      }
    },

    // 获取语言列表
    async getLangList(){
      const res = await langTypeList()
      if(res.code !== 0)return
      this.langTypeOptions = res.data || []
    },

    // 选择切换
    handleChange(val){
      this.serviceList = this.serviceList.map(item=>{
        if(!val || val.length === 0){
          item.isRequired = false
        } else{
          val.some(num=>num ==item.code) ? item.isRequired = true : item.isRequired = false
        }
        return item
      })
    },

    // 编辑帮助文档
    editHelpDoc(item){
      this.editVisible = true
      this.editItem = {
        appId: this.appId,
        version: this.version,
        vioceCode: item.code,
        name: item.name,
        contentType: 4
      }
    },

    handleClose(){
      this.editVisible = false
      this.getVoice('lang')
    },

    // 查看文档
    checkDoc(data,lang){
      this.checkItem = {
        version: this.version,
        appId: this.appId,
        vioceCode: data.code,
        contentType: 4,
      }
      this.checkLang = lang
      this.docVisible = true
    },

    // 关闭查看文档弹窗
    handleDocClose(){
      this.docVisible = false
    },

    // 保存并发布
    async handleSave(){
      const res = await saveVoice({id: this.id, voiceList: this.previewList, appKey: this.appKey})
      if(res.code !== 0 )return
      this.$message.success(this.$t('public.save.ok'))
      this.getVoice()
    },

    // 复制授权URL
    copyUrl(item) {
      this.copyVisible = true
      this.copyData = item
    },

    // 关闭复制
    cancelCopy(){
      this.copyVisible = false
    }
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
  .config-content{
    flex:1;
    padding: 20px;
  }
  .preview-wrap{
    overflow-y: auto;
    height: 100%;
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
    font-size: 14px;
    color: @aithings-text-color-black;
    line-height: 20px;  
  }
  .config-deatils{
    padding: 20px 0 0 26px;
  }
  .edit-button{
    width: 120px;
    height: 34px;
    margin: 0 10px 15px 0;
    border-radius: 4px;
    border: 1px solid @primary-color;
    color: @primary-color;
  }
  .lang-type{
    color: @primary-color;
  }
  .lang-type+.lang-type{
    margin-left: 20px;
  }
}

.preview-phone-wrap{
  position: relative;
  width: 178px;
  height: 373px;
  background: url("../../../../assets/image/optionalConfig/preview.png") center/100% 100% no-repeat;
  .service-wrap{
    position: absolute;
    left: 15px;
    top: 88px;
    width: 148px;
    .title-wrap{
      padding: 0 12px 0 6px;
      text-align: left;
    }
    .title{
      color: @aithings-text-color-gray;
      font-size: 16px;
      line-height: 11px;
      zoom: 0.5;
    }
    .more{
      color: @aithings-text-color-gray;
      font-size: 12px;
      line-height: 8px;
      zoom: 0.5;
    }
  }
  .service-list{
    padding: 4px 6px 0;
    .service-item{
      flex: 1;
      text-align: center;
    }
    img{
      width: 24px;
      height: 24px;
    }
    .name{
      padding-top: 7px;
      color: @aithings-text-color-gray;
      font-size: 12px;
      line-height: 8px;
      zoom: 0.5;
    }
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