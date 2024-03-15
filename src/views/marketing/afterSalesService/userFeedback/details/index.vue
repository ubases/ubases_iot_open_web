<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="$t('after.sales.service.details.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="container flex">
        <!-- 左侧反馈内容 -->
        <section class="content">
          <a-descriptions :title="$t('after.sales.service.details.content')" :column="1">
            <a-descriptions-item :label="$t('after.sales.service.details.problem.classification')">{{detailsData.typeName}}</a-descriptions-item>
            <a-descriptions-item :label="$t('after.sales.service.details.occurrence.time')">{{detailsData.findtime | momentFilter}}</a-descriptions-item>
          </a-descriptions>
          <section class="flex">
            <p class="label">{{$t('after.sales.service.details.content')}} :</p>
            <section class="feedback-content-wrap">
              <section class="text pre-wrap">{{detailsData.content}}</section>
              <section class="flex">
                <template v-if="detailsData.videos && detailsData.videos.length > 0">
                  <template v-for="(item,index) in detailsData.videos">
                    <div v-if="item !== ''" class="media-wrap" :key="`vedio${index}`">
                      <video controls>
                        <source :src="item">
                      </video>
                    </div>
                  </template>
                </template>
                <template v-if="detailsData.pictures && detailsData.pictures.length > 0">
                  <template v-for="(item,index) in detailsData.pictures">
                    <div v-if="item !== ''" class="media-wrap" :key="`image${index}`">
                      <img :src="item" @click="$PreviewModal({ url: item })"/>
                    </div>
                  </template>
                </template>
              </section>
            </section>
          </section>
          <a-divider />
          <a-spin :spinning="confirmLoading">
            <section class="reply-wrap flex" v-if="detailsData.status !== 2">
              <h3>{{$t('after.sales.service.details.reply')}}</h3>
              <section class="reply-content">
                <a-form-model  ref="ruleForm" class="regular-form" :rules="rules" :model="replyForm">
                  <a-form-model-item prop="content">
                    <a-input v-model="replyForm.content" :maxLength="2500" type="textarea" />
                  </a-form-model-item>
                  <a-form-model-item>
                    <input v-show="false" v-model="replyForm.media" />
                    <section class="flex">
                      <section class="media-wrap" v-for="(item,index) in replyForm.videos" :key="`video${index}`">
                        <delete-red-icon class="delete-icon tap-pointer" @click="deleteMedia('videos',index)"/>
                        <video controls>
                          <source :src="item" type="video/mp4">
                        </video>
                      </section>
                      <section class="media-wrap" v-for="(item,index) in replyForm.pictures" :key="`image${index}`">
                        <delete-red-icon class="delete-icon tap-pointer" @click="deleteMedia('pictures',index)"/>
                        <img :src="item" />
                      </section>
                      <section class="media-action">
                        <a-upload
                          name="file"
                          accept="image/png,image/jpeg,image/x-ms-bmp,video/mp4"
                          :showUploadList="false"
                          :customRequest="handCustomerRequest"
                          @change="handleFileChange"
                        >
                          <a-button size="small" class="upload-button" :disabled="isLoading" :loading="isLoading"><template v-if="!isLoading"><upload-blue-icon/></template>{{$t('after.sales.service.details.upload.button')}}</a-button>
                        </a-upload>
                      </section>
                    </section>
                  </a-form-model-item>
                </a-form-model>
                <footer>
                  <a-button type="primary" class="save-button" @click="handleSave">{{$t('public.save')}}</a-button>
                  <a-button class="cancel-button" @click="handleCancel">{{$t('public.cancel')}}</a-button>
                </footer>

              </section>
            </section>
          </a-spin>
           <section v-if="detailsData.status === 2" class="flex">
              <h3 class="reply-record-label">{{$t('after.sales.service.details.reply.record')}}:</h3>
              <section class="feedback-content-wrap">
                <section class="text">
                  <span>{{replyForm.operationTime | momentFilter}}</span>&nbsp;&nbsp;&nbsp;
                  <span>{{$t('after.sales.service.details.operator')}}：{{replyForm.operator}}</span>
                </section>
                <section class="text pre-wrap">{{replyForm.content}}</section>
                <section class="flex">
                  <template v-if="replyForm.videos && replyForm.videos.length > 0">
                    <template v-for="(item,index) in replyForm.videos">
                      <div v-if="item !== ''" class="media-wrap" :key="`video${index}`">
                        <video controls>
                          <source :src="item" type="video/mp4">
                        </video>
                      </div>
                    </template>
                  </template>
                  <template v-if="replyForm.pictures && replyForm.pictures.length > 0">
                    <template v-for="(item,index) in replyForm.pictures">
                      <div v-if="item !== ''" class="media-wrap" :key="`image${index}`">
                        <img :src="item" @click="$PreviewModal({ url: item })"/>
                      </div>
                    </template>
                  </template>
                </section>
                <footer>
                  <a-button class="cancel-button" @click="handleCancel">{{$t('public.back')}}</a-button>
                </footer>
              </section>
            </section>
        </section>
        <!-- 右侧信息详情 -->
        <section class="info">
          <template v-for="(info,index) in infoList">
            <a-descriptions :key="index" :title="info.title" :column="1">
              <a-descriptions-item v-for="(item,key) in info.list" :key="`${info.name}-${key}`" :label="item.label">
                <template  v-if="item.filter">
                  {{$DictName(item.filter,detailsData[info.name][item.value]) || ''}}
                </template>
                <template v-else-if="item.momentFilter">
                  <template v-if="detailsData[info.name][item.value]">{{detailsData[info.name][item.value] | momentFilter}}</template>
                </template>
                <template v-else>
                  {{ detailsData[info.name][item.value] || ''}}
                </template>
              </a-descriptions-item>
            </a-descriptions>
          </template>
        </section>
      </section>
    </a-page-header>
  </section>
</template>

<script>
import { uploadFile } from "@/api/common"
import { DeleteRedIcon,UploadBlueIcon } from "@/core/icons"
import { getFeedbackDetail, getFeedbackReply} from "@/api/userFeedback"

export default {
  name: "FeedbackDetails",
  components:{
    DeleteRedIcon,
    UploadBlueIcon
  },
  data() {
    return {
      id: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      infoList:[
        {
          title: this.$t('after.sales.service.feedback.info'),
          name:"feedbackInfo",
          list:[
            { label: this.$t('after.sales.service.id'), value:'id'},
            { label: this.$t('after.sales.service.findtime'), value:'createdTime', momentFilter:true},
            { label: this.$t('after.sales.service.statusName'), value:'statusName'},
          ]
        }, {
          title: this.$t('after.sales.service.device.info'),
          name:"deviceInfo",
          list:[
            { label: this.$t('after.sales.service.deviceName'), value:'deviceName'},
            { label: this.$t('after.sales.service.deviceId'), value:'deviceId'},
            { label: this.$t('after.sales.service.firmwareVersion'), value:'firmwareVersion'},
          ]
        }, {
          title: this.$t('after.sales.service.user.info'),
          name:"userInfo",
          list:[
            { label: this.$t('after.sales.service.nickName'), value:'nickName'},
            { label: this.$t('after.sales.service.userAccount'), value:'userAccount'},
            { label: this.$t('after.sales.service.registerTime'), value:'registerTime', momentFilter:true},
            { label: this.$t('after.sales.service.phone'), value:'phone'},
          ]
        }, {
          title:this.$t('after.sales.service.app.info'),
          name:"appInfo",
          list:[
            { label: this.$t('after.sales.service.appName'), value:'appName'},
            { label: this.$t('after.sales.service.appVersion'), value:'appVersion'},
            { label: this.$t('after.sales.service.mobileSystem'), value:'mobileSystem'},
            { label: this.$t('after.sales.service.mobileLang'), value:'mobileLang'},
            { label: this.$t('after.sales.service.mobileModel'), value:'mobileModel'},
          ]
        }
      ],
      detailsData:{
        feedbackInfo:{},
        deviceInfo:{},
        userInfo:{},
        appInfo:{}
      },
      replyForm:{
        pictures:[],
        videos:[]
      },
      rules:{
        content:[{ required: true, message: this.$t('after.sales.service.rules.content'), trigger: "" }]
      },
      confirmLoading:false,
      isLoading:false,
    };
  },
  created() {
    this.id = this.$route.query.id || ''
    this.getDetails()
  },
  methods: {
    async getDetails(){
      const res = await getFeedbackDetail(this.id)
      if(res.code !== 0) return
      this.detailsData = {...res.data} || {}
      const feedbackInfo = {
        id: res.data?.id || '',
        createdTime: res.data?.createdTime || '',
        statusName: res.data?.statusName || '',
      }
      this.detailsData['feedbackInfo']= feedbackInfo
      this.replyForm = res.data?.status === 2 ? res.data?.replyList.shift() : {pictures:[], videos:[]}
    },

    // 保存
    async handleSave(){
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = await getFeedbackReply({feedbackId:this.id,...this.replyForm})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$message.success(this.$t('public.save.ok'));
        this.getDetails()
      })

    },

    // 取消
    handleCancel(){
      this.$router.back()
    },

    // 删除上传的图片或视频
    deleteMedia(key,index){
      this.replyForm[key].splice(index, 1)
    },

    //  图片上传
    async handCustomerRequest() {
    },

    // 图片上传
    async handleFileChange(fileData) {
      const file = fileData.file
      if(file.type == 'video/mp4' && this.replyForm.videos && this.replyForm.videos.length >= 2){
        this.$message.error(this.$t('after.sales.service.vedio.limit'))
        return false
      } 
      if((file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/x-ms-bmp') && this.replyForm.pictures && this.replyForm.pictures.length >= 5) {
        this.$message.error(this.$t('after.sales.service.image.limit'))
        return false
      }
      if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/x-ms-bmp' && file.type !== 'video/mp4') {
        this.$message.warning(this.$t('after.sales.service.file.type'))
        return false
      } 
      const isLimitImage = file.size / 1024 / 1024 > 5
      if (isLimitImage && /image/.test(file.type)) {
        this.$message.error(this.$t('after.sales.service.vedio.size.limit'))
        return false
      }
      const isLimitVideo = file.size / 1024 / 1024 > 10
      if (isLimitVideo && /video/.test(file.type)) {
        this.$message.error(this.$t('after.sales.service.image.size.limit'))
        return false
      }
      this.isLoading = true
      const res = await uploadFile(file.originFileObj,"network")
      this.isLoading = false
      if (res.code == 0) {
        if(file.type == 'video/mp4'){
          this.replyForm.videos.push(res.data.fullPath)
        } else{
          this.replyForm.pictures.push(res.data.fullPath)
        }
      } else{
        this.$message.error(res.msg)
      }
    },

  },
};
</script>
<style lang="less" scoped>
  @import "../../../../../global.less";
  .page-wrap, /deep/.ant-page-header{
    height: 100%;
  }
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  /deep/.ant-page-header-content{
    padding: 0;
    height: calc(100% - 65px);
  }
  .container,.content,.info{
    height: 100%;
  }
  .content{
    flex: 1;
    padding: 30px 0 20px 20px;
    overflow-y: auto;
  }
  .info{
    width: 355px;
    padding: 30px 30px 10px;
    overflow-y: auto;
    background: @aithings-table-thread-color;
  }
  .media-wrap{
    position: relative;
    margin: 18px 20px 0 0;
    width: 132px;
    height: 132px;
    
    img{
      max-width: 132px;
      max-height: 132px;
      border-radius: 4px;
    }
    video{
      max-width: 132px;
      max-height: 132px;
      border-radius: 4px;
    }
    .delete-icon{
      position: absolute;
      top: -8px;
      right: -8px;
      width: 16px;
      height: 16px;
    }
  }
  .media-action{
    margin-top: 18px;
  }
  h3{
    color: @aithings-text-color-black;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }
  .ant-descriptions + .ant-descriptions{
    margin-top: 15px;
  }
  /deep/.ant-descriptions-title{
    margin-bottom: 15px;
    font-size: 15px;
    font-weight: 600;
    color: @aithings-text-color-black;
    line-height: 21px;
  }
  /deep/.ant-descriptions-item-label,.label{
    padding-right: 10px;
    color: @aithings-text-color-gray;
    line-height: 20px;
  }
  /deep/.ant-descriptions-item-content{
    color: @aithings-text-color-black;
    line-height: 20px;
  }
  /deep/.ant-descriptions-row > td{
    padding-bottom: 15px;
  }
  .label{
    padding-right: 16px;
  }
  .feedback-content-wrap{
    flex: 1;
    padding-right: 30px;
    .text{
      max-width: 600px;
    }
    .text+.text{
      margin-top: 15px;
    }
  }
  .reply-content{
    flex: 1;
    padding: 0 30px 40px 50px;
    
  }
  .reply-record-content{
    flex: 1;
    padding: 0 30px 40px 20px;
  }
  /deep/textarea.ant-input{
    max-width: 610px;
    width: 100%;
    height: 180px;
    border-radius: 8px;
    border: 1px solid @aithings-border-color;
    resize:none;
  }
  .upload-button{
    width: 160px;
    border: 1px solid @primary-color;
    color: @primary-color;
    svg{
      transform: translateY(3px);
      margin-right: 10px;
    }
    &:disabled{
      opacity: 0.4;
      background: #fff;
    }
  }
  /deep/.ant-form-item{
    margin-bottom: 16px;
  }
  .reply-record-label{
    padding-right: 16px;
  }
  footer{
    margin-top: 24px;
  }
  .save-button{
    width: 91px;
    height: 34px;
    background: @primary-color;
    border-radius: 4px;
  }
  .cancel-button{
    margin-left: 20px;
    width: 91px;
    height: 34px;
    border-radius: 4px;
    border: 1px solid @primary-color;
    color: @primary-color;
  }
  .pre-wrap{
    white-space: pre-wrap;
  }
</style>