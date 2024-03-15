<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="title[type] + $t('appSplashScreen.push.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="container">
        <section class="form-wrap content-padding">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 13 }"
          >
            <a-form-model-item :label="$t('appSplashScreen.push.label.pushName')" prop="name">
              <a-input v-model="form.name" :disabled="readOnly" :maxLength="50" :placeholder="$t('appSplashScreen.push.placeholder.pushName')"/>
            </a-form-model-item>
            <a-form-model-item :label="$t('appSplashScreen.push.label.pushApp')" prop="appKey">
              <a-select v-model="form.appKey" :disabled="readOnly" :options="appOptions" @change="appChange" :placeholder="$t('appSplashScreen.push.placeholder.pushApp')" />
            </a-form-model-item>
            <a-form-model-item :label="$t('appSplashScreen.push.label.pushVersion')" prop="appVersion">
              <a-select v-model="form.appVersion" :disabled="readOnly" :options="versionOptions" :placeholder="$t('appSplashScreen.push.placeholder.pushVersion')" />
            </a-form-model-item>
            <a-form-model-item :label="$t('appSplashScreen.push.label.pushCrowd')" prop="putinUser">
              <a-radio-group v-model="form.putinUser" :disabled="readOnly" :options="$DictList('push_crowd_type')" />
              <section v-if="form.putinUser == 2" class="form-item-detail">
                <a-textarea v-model="form.accounts" :disabled="readOnly" :maxLength="20000" :placeholder ="$t('email.push.datails.placeholder.account')" @blur="handleValid('putinUser')" :auto-size="{ minRows: 2,maxRows: 10}"/>
                <p class="tips">{{$t('email.push.datails.tips.account')}}</p>
              </section>
            </a-form-model-item>
            <a-form-model-item :label="$t('appSplashScreen.push.label.openPage')" prop="openPageType" :wrapper-col="{ span: 18 }">
              <a-radio-group v-model="form.openPageType" :disabled="readOnly" :options="$DictList('flash_open_page_type')" />
              <div class="radio-wrap">
                <a-select v-if="form.openPageType == 1" v-model="form.appPageType" :options="$DictList('app_push_page')" :disabled="readOnly" @change="handleValid('openPageType')" :placeholder="$t('appSplashScreen.push.openPage.placeholder.appPage')" />
                <a-input v-if="form.openPageType == 2" v-model="form.openPageUrl" :maxLength="100" :disabled="readOnly" @blur="handleValid('openPageType')" :placeholder="$t('appSplashScreen.push.openPage.placeholder.webUrl')"/>
              </div>
            </a-form-model-item>
            <a-form-model-item :label="$t('appSplashScreen.push.label.pushTime')" prop="endTime" :wrapper-col="{ span: 19 }">
              <a-date-picker show-time v-model="form.startTime" :disabled="readOnly" valueFormat="YYYY-MM-DD HH:mm:ss" @change="handleValid('endTime')" :placeholder="$t('public.select.time')">
                <a-icon slot="suffixIcon" type="down" style="color: #8392A7; font-size: 12px;" />
              </a-date-picker>
              <span class="to-text">{{$t('public.to')}}</span>
              <a-date-picker show-time v-model="form.endTime" :disabled="readOnly" valueFormat="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDate" @change="handleValid('endTime')" :placeholder="$t('public.select.time')" >
                <a-icon slot="suffixIcon" type="down" style="color: #8392A7; font-size: 12px;" />
              </a-date-picker>
            </a-form-model-item>
            <a-form-model-item :label="$t('appSplashScreen.push.label.pushDuration')" prop="showTime">
              <a-input-number class="push-duration-input" v-model="form.showTime" :precision="0" :min="1" :max="60" :disabled="readOnly" :placeholder="$t('appSplashScreen.push.placeholder.pushDuration')"/>
              <span class="duration-tips">{{$t('appSplashScreen.push.tips.pushDuration')}}</span>
            </a-form-model-item>
            <a-form-model-item :label="$t('appSplashScreen.push.label.pushImage')" prop="imageUrl_4" :wrapper-col="{ span: 21 }">
              <section class="push-image-wrap">
                <section class="flex y-axis-end push-image-phone-list">
                  <div v-for="(item,index) in phonePreview" :key="index" class="push-image-phone">
                    <div :class="['phone-wrap', item.className]">
                      <div class="phone-content">
                        <section class="upload-wrap">
                          <a-spin :spinning="imgLoading[index]" wrapperClassName="spin-ele">
                            <a-upload
                              name="file"
                              :multiple="false"
                              :showUploadList="false"
                              :disabled="readOnly"
                              accept="image/png,image/gif"
                              :beforeUpload="e => beforeUpload(e,item.width,item.height)"
                              :customRequest="e => customRequest(e,index)"
                            >
                              <section class="image-wrap">
                                <img v-if="form[item.urlKey]" :src="form[item.urlKey]" class="image"/>
                              </section>
                            </a-upload>
                          </a-spin>
                        </section>
                        <section class="logo-wrap flex xy-axis-center">
                          <img :src="require('../../../../assets/image/logo_default.png')" class="app-logo"/>
                        </section>
                      </div>
                    </div>
                    <p class="push-image-size">{{$t('appSplashScreen.push.pushImage.sizeText')+item.sizeText}}</p>
                  </div>
                </section>
                <p class="push-image-tips">{{$t('appSplashScreen.push.pushImage.tips')}}</p>
                <p class="push-image-tips">{{$t('appSplashScreen.push.pushImage.type')}}</p>
              </section>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
              <a-button v-if="type !== 'check'" type="primary" @click="handleSave"> {{$t('public.save')}}</a-button>
              <a-button @click="$router.back()" class="cancel-btn">{{$t('public.back')}}</a-button>
            </a-form-model-item>
          </a-form-model>
        </section>
      </section>
    </a-page-header>
  </section>
</template>
<script>
import QuillEditor from '@/components/Editor/QuillEditor.vue'
import {beforeUpload, WEBURL_REG } from "@/utils/validate"
import { addFlashscreen, editFlashscreen, getFlashscreenDetail} from "@/api/splashScreenPush"
import { getAppList, getAppVersionList } from "@/api/appExploit"
import { uploadFile } from "@/api/common"
import moment from "moment";
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { PHONE_REG, US_PHONE_REG, EMAIl_REG, } from '@/utils/validate'

export default {
  name: "AppSplashScreenPushDetails",
  components:{
    QuillEditor
  },
  data() {
    return {
      id: '',
      form: {},
      rules: {
        name: [{ required: true, message: this.$t('appSplashScreen.push.rules.pushName'), trigger: '' }],
        appKey: [{ required: true, message: this.$t('appSplashScreen.push.rules.pushApp'), trigger: 'change' }],
        appVersion: [{ required: true, message: this.$t('appSplashScreen.push.rules.pushVersion'), trigger: 'change' }],
        putinUser: [
          { required: true, message: this.$t('appSplashScreen.push.rules.pushCrowd'), trigger: 'change' },
          { validator:(rule, value, callback) => {value === 2 && !this.form.accounts? callback(this.$t('appSplashScreen.push.rules.accounts')): callback()}, trigger: ''},
          // { validator:(rule, value, callback) => {value === 2 && this.form.accounts.split(/[\,?\r?\n|(?<!\n)\r]+/).length > 1000? callback(this.$t('appSplashScreen.push.rules.accounts.length')): callback()}, trigger: ''}
        ],
        openPageType: [
          { required: true, message: this.$t('appSplashScreen.push.rules.openPage'), trigger: 'change' },
          { validator:(rule, value, callback) => {value === 1 && !this.form.appPageType? callback(this.$t('appSplashScreen.push.openPage.placeholder.appPage')): callback()}, trigger: ''},
          { validator:(rule, value, callback) => {value === 2 && !this.form.openPageUrl? callback(this.$t('appSplashScreen.push.rules.webUrl')): callback()}, trigger: ''},
          { validator:(rule, value, callback) => {value === 2 && !WEBURL_REG.test(this.form.openPageUrl) ? callback(this.$t('appSplashScreen.push.rules.webUrl')): callback()}, trigger: ''}
        ],
        endTime: [
          { required: true, message: this.$t('appSplashScreen.push.rules.pushTime'), trigger: 'change' },
          { validator:(rule, value, callback) => {!this.form.startTime||!this.form.endTime? callback(this.$t('appSplashScreen.push.rules.pushTime')): callback()}, trigger: ''}
        ],
        showTime:[{ required: true, message: this.$t('appSplashScreen.push.rules.pushDuration'), trigger: '' }],
        imageUrl_4: [
          { required: true, message: this.$t('appSplashScreen.push.rules.pushImage'), trigger: '' },
          { validator:(rule, value, callback) => {!this.form.imageUrl_1|| !this.form.imageUrl_2||!this.form.imageUrl_3||!this.form.imageUrl_4? callback(this.$t('appSplashScreen.push.rules.pushImage')): callback()}, trigger: ''}
        ],
      },
      appOptions: [],
      emailServiceOptions: [],
      versionOptions: [],
      phonePreview:[
        {
          sizeText: this.$t('appSplashScreen.push.pushImage.size1'),
          width: 640,
          height: 720,
          className: "image720",
          urlKey: "imageUrl_1",
          md5Key: "imageMd5_1",
        },{
          sizeText: this.$t('appSplashScreen.push.pushImage.size2'),
          width: 1080,
          height: 1560,
          className: "image1560",
          urlKey: "imageUrl_2",
          md5Key: "imageMd5_2",
        },{
          sizeText: this.$t('appSplashScreen.push.pushImage.size3'),
          width: 1080,
          height: 1800,
          className: "image1800",
          urlKey: "imageUrl_3",
          md5Key: "imageMd5_3",
        },{
          sizeText: this.$t('appSplashScreen.push.pushImage.size4'),
          width: 1242,
          height: 2328,
          className: "image2328",
          urlKey: "imageUrl_4",
          md5Key: "imageMd5_4",
        },
      ],
      type:'',
      title:{
        add: this.$t('public.add'),
        edit: this.$t('public.edit'),
        check: this.$t('public.view'),
        reLaunch: this.$t('public.create')
      },
      imgLoading:{
        0:false,
        1:false,
        2:false,
        3:false,
      }
    }
  },
  computed: {
    readOnly(){
      return this.type === 'check'
    }
  },
  async created() {
    this.id = this.$route.query.id || ''
    this.type = this.$route.query.type || '' // add：添加， check：查看， edit：编辑， reLaunch：再次投放
    await this.getAppList()
    if(this.type && this.type !== 'add'){
      this.getFlashscreenDetail()
    }
  },
  methods: {
    // 获取全部应用
    async getAppList(){
      const res = await getAppList()
      if (res.code !==0) return
      this.appOptions = res.data?.list?.map(item=>{
        return{
          label: item.name,
          value: item.appKey,
          appId: item.id
        }
      })
    },

    // 获取app版本列表
    async appChange(value){
      const appId = this.appOptions.filter(app=> app.value === value)?.pop()?.appId || ''
      const res = await getAppVersionList({query:{appId}})
      if(res.code !== 0) return
      this.versionOptions = res.data?.list?.map(item=>{
        return{
          label: `高于并包括${item.version}`,
          value: item.version,
        }
      }) || []
    },

    // 获取详情
    async getFlashscreenDetail(){
      const res = await getFlashscreenDetail({id:this.id})
      if(res.code !== 0) return
      this.form = res.data
      this.form.startTime = moment(res.data.startTime*1000).format('YYYY-MM-DD HH:mm:ss')
      this.form.endTime = moment(res.data.endTime*1000).format('YYYY-MM-DD HH:mm:ss')
      this.form.accounts = res.data?.accounts?.toString() || ''
      if(this.form.appKey){
        this.appChange(this.form.appKey)
      }
      this.phonePreview.forEach((item,index)=>{
        this.form[item.urlKey] = res.data?.putinImgUrls[index]?.imageUrl || ''
        this.form[item.md5Key] = res.data?.putinImgUrls[index]?.imageMd5 || ''
      })
      if(this.type === 'reLaunch'){
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },

    editorChange(html){
      this.form.emailContent = html
    },
    // 保存
    handleSave(){
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        this.confirmLoading = true
        const {name,appKey,appVersion,putinUser,openPageType, appPageType,openPageUrl,startTime,endTime,showTime} = {...this.form}

        const param = {
          status: 1,
          name,appKey,appVersion,putinUser,openPageType, appPageType,openPageUrl,startTime:Number(moment(startTime).format('X')),endTime:Number(moment(endTime).format('X')),showTime
        }
        if(this.form.accounts){
          const list = this.form.accounts.split(/[\,?\r?\n|(?<!\n)\r]+/).map(item=>item.trim())
          const listNew = [...new Set(list)]  // 去重
          let arr = []
          new Array(999).fill('15013790363')
          if(listNew.length > 1000){
            this.$message.info(this.$t('appSplashScreen.push.rules.accounts.length'))
            return
          }
          let error = false
          for (const item of listNew) {
            if(item != ''){
              if(PHONE_REG.test(item) || EMAIl_REG.test(item) || US_PHONE_REG.test(item)){
                arr.push(item)
              } else{
                error = true
                this.$message.info(`${item} ` + this.$t('appSplashScreen.account.error'))
                break;
              }
            }
          }
          if(error) return
          param['accounts'] = arr
        } 
        param['putinImgUrls'] = this.phonePreview.map(item=>{
          return {
            imageUrl: this.form[item.urlKey],
            imageMd5: this.form[item.md5Key],
          }
        })
        param['appName'] = this.appOptions.filter(item=>item.value === this.form.appKey)?.pop()?.label || ''
        const res = this.type === 'edit' ? await editFlashscreen({...param, id: this.form.id}) :  await addFlashscreen({...param})
        this.confirmLoading = false
        if(res.code !== 0 ) return
        this.$router.push({path:"/marketing/appSplashScreenPush/index.vue"})
      })
      
    },

    beforeUpload(file, width, height){
      if (file.type !== 'image/png' && file.type !== 'image/gif') {
        this.$message.warning(this.$t('appSplashScreen.push.img.valid.type'))
        return false
      } 
      return beforeUpload(this,file,10,width,height)
    },

    // 图片上传
    async customRequest(fileData,index){
      const file = fileData.file
      this.imgLoading[index] = true
      const res = await uploadFile(file,'app')
      this.imgLoading[index] = false
      if (res.code !== 0) return
      this.$set(this.form,`imageUrl_${index+1}`,res.data.fullPath)
      this.$set(this.form,`imageMd5_${index+1}`,res.data.key)
      this.handleValid('imageUrl_4')
      this.$message.success(this.$t('public.uploadImg.succeed'));
    },

    // 结束时间设置限制
    disabledDate(current){
      return current && current < (this.form.startTime ? moment(this.form.startTime).startOf('day') : moment().startOf('day'));
    },

    // 重新校验
    handleValid(key){
      this.$refs.ruleForm?.validateField([key])
    }
  }
}
</script>
<style lang="less" scoped>
  @import "../../../../global.less";
  @import "../../../../utils/utils.less";
  .page-wrap, /deep/.ant-page-header{
    height: 100%;
  }
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .container{
    padding: 0 20px 30px;
  }
  .form-wrap{
    max-width: 1130px;
  }
  .content-padding{
    padding-top: 10px;
  }
  .ant-form{
    .ant-form();
  }
  .form-item-detail{
    padding-top: 4px;
  }
  .tips{
    color: @aithings-text-color-gray;
  }
  .date-wrap{
    display: inline-block;
    width: 140px;
  }
  .period-select,.time-wrap{
    width: 110px;
    margin-left: 10px;
  }
  .to-text{
    padding: 0 8px ;
    color: @aithings-text-color-black;
  }
  .radio-wrap{
    margin: 10px 0;
    width: 220px;
  }
  .ant-btn{
    margin-top: 20px;
    padding: 0 28px;
  }
  .ant-btn + .ant-btn {
    margin-left: 20px;
  }
  .cancel-btn{
    color: @primary-color;
    border-color: @primary-color;
  }
  .push-duration-input{
    width: 220px;
  }
  .duration-tips{
    padding-left: 7px;
    color: @aithings-text-color-gray;
  }
  .push-image-wrap{
    max-width: 788px;
    height: 340px;
    padding: 20px;
    background: @aithings-table-thread-color;
    .image-wrap .image{
      max-width: 100%;
      max-height: 100%;
    }
    .image720{
      width: 60px;
      height: 105px;
      padding: 11px 4px 15px 3px;
      background: url('../../../../assets/image/push_image640x720.png') center/100% no-repeat;
      .logo-wrap{
        height: 20px;
      }
      .app-logo{
        width: 8px;
        height: 8px;
      }
      .upload-wrap,.image-wrap{
        width: 53px;
        height: 60px;
      }
    }
    .image1560{
      width: 80px;
      height: 159px;
      padding: 12px 4px 16px 3px;
      background: url('../../../../assets/image/push_image1080x1560.png') center/100% no-repeat;
      .logo-wrap{
        height: 25px;
      }
      .app-logo{
        width: 12px;
        height: 12px;
      }
      .upload-wrap,.image-wrap{
        width: 73px;
        height: 106px;
      }
    }
    .image1800{
      width: 80px;
      height: 176px;
      padding: 11px 3px 16px;
      background: url('../../../../assets/image/push_image1080x1800.png') center/100% no-repeat;
      .logo-wrap{
        height: 25px;
      }
      .app-logo{
        width: 12px;
        height: 12px;
      }
      .upload-wrap,.image-wrap{
        width: 74px;
        height: 124px;
      }
    }
    .image2328{
      width: 84px;
      height: 177px;
      padding: 2px;
      background: url('../../../../assets/image/push_image1242x2328.png') center/100% no-repeat;
      .phone-content{
        overflow: hidden;
        border-radius: 4px;
      }
      .logo-wrap{
        height: 23px;
      }
      .app-logo{
        width: 16px;
        height: 16px;
      }
      .upload-wrap,.image-wrap{
        width: 80px;
        height: 150px;
      }
    }
    .phone-content{
      width: 100%;
      height: 100%;
      background: @aithings-bg-gray;
      .logo-wrap{
        background: #fff;
      }
      .app-logo{
        display: block;
      }
    }
  }
  .push-image-tips{
    line-height: 18px;
    font-size: 12px;
    text-indent: 32px;
    color: @aithings-text-tips-color;
  }
  .phone-wrap{
    margin: 0 auto;
  }
  .push-image-size{
    padding-top: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 18px;
    color: @aithings-text-color-gray;
  }
  .push-image-phone-list{
    padding: 4px 0 24px;
  }
  .push-image-phone{
    flex:1;
  }
</style>
