<template>
  <section class="config-content flex x-space-between">
    <section class="config-wrap">
      <section class="flex y-axis-center x-space-between">
        <h4 class="config-title">{{$t('Personalization.title')}}</h4>
        <a-button :disabled="editDisabled" class="back-default" @click="resetDefault">{{$t('public.restore.default')}}</a-button>
      </section>
      <section class="config-list flex">
        <section class="config-item" v-for="item in sizeList" :key="item.key">
          <a-spin :spinning="imgLoading[item.key]" wrapperClassName="spin-ele">
            <a-upload
              name="file"
              class="upload-item"
              :disabled="editDisabled"
              :multiple="false"
              :showUploadList="false"
              accept="image/png"
              :beforeUpload="e=>beforeUpload(e,item.w,item.h)"
              :customRequest="e => customRequest(e,item.key)"
            >
              <section :class="['image-wrap',item.className]">
                <img :src="data[item.key] || originData[item.key]" class="image"/>
              </section>
            </a-upload>
          </a-spin>
          <p class="image-name">{{item.name}}</p>
          <p class="size">{{$t('Personalization.size')+`：${item.w}px*${item.h}px`}}</p>
          <p class="type">{{$t('Personalization.img.type')}}</p>
        </section>
      </section>
    </section>
    <section class="preview-wrap">
      <h4 class="config-title">{{$t('public.previewResults')}}</h4>
      <div class="phone-radio-group">
        <a-radio-group v-model="currentPhone">
          <a-radio-button v-for="item in sizeList" :key="item.type" :value="item.type">
            {{item.label}}
          </a-radio-button>
        </a-radio-group>
      </div>
       <section class="preview-phone-wrap iphone-xs-max-shell">
         <section class="phone-bg">
            <div v-if="currentPhone == 1 ||currentPhone == 2" class="logo-preview" :style="{background: `url(${data.loginRegisterBackgroundUrl || originData.loginRegisterBackgroundUrl}) top/100% 100% no-repeat`}">
              <img :src="data.loginRegisterLogoUrl || originData.loginRegisterLogoUrl" class="logo-image"/>
            </div>
            <div v-if="currentPhone == 3 || currentPhone == 4" :class="['logo-preview',{'avatar-bg':currentPhone == 4}, {'empty-bg':currentPhone == 3}]">
              <section v-if="currentPhone == 3" class="empty-image-wrap">
                <img :src="data.noDataUrl || originData.noDataUrl" class="empty-image"/>
                <p class="text">{{$t('Personalization.noData')}}</p>
              </section>
              <img v-if="currentPhone == 4" :src="data.defaultAvatarUrl || originData.defaultAvatarUrl" class="avatar-image"/>
            </div>
         </section>
       </section>
       <p class="tips">{{$t('app.config.preview.tips')}}</p>
    </section>
  </section>
</template>


<script>
import {beforeUpload } from "@/utils/validate"
import { uploadFile } from "@/api/common"
import { getAppPersonalize, saveAppPersonalize,resetDefault } from "@/api/appExploit"

export default {
  props:{
    appId:{ type:String, default:''},
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false},
  },
  components:{

  },
  data (){
    return {
      currentPhone:1,
      sizeList:[
        {type: 1, label:this.$t('Personalization.label.loginRegisterBackgroundUrl'), name:this.$t('Personalization.name.loginRegisterBackgroundUrl'), w: 1080, h:1920, key:"loginRegisterBackgroundUrl",className:"login-register-bg"},
        {type: 2, label:this.$t('Personalization.label.loginRegisterLogoUrl'), name:this.$t('Personalization.name.loginRegisterLogoUrl'), w: 300, h:300, key:"loginRegisterLogoUrl",className:"login-register-logo" },
        {type: 3, label:this.$t('Personalization.label.noDataUrl'), name:this.$t('Personalization.name.noDataUrl'), w: 288, h:288,key:"noDataUrl",className:"empty" },
        {type: 4, label:this.$t('Personalization.label.label'), name:this.$t('Personalization.label.label'), w: 180, h:180,key:"defaultAvatarUrl",className:"default-avatar" },
      ],
      data:{},
      originData:{
        loginRegisterBackgroundUrl:require('@/assets/image/login_bg.png'),
        loginRegisterLogoUrl:require('@/assets/image/logo_default.png'),
        noDataUrl:require('@/assets/image/empty.png'),
        defaultAvatarUrl:require('@/assets/image/default_avatar.png'),
      },
      imgLoading:{
        loginRegisterBackgroundUrl: false,
        loginRegisterLogoUrl: false,
        noDataUrl: false,
        defaultAvatarUrl: false
      }
    }
  },
  computed:{
    getSize (){
      const current = this.sizeList.filter(item=>item.type == this.currentPhone).pop()
      return `${current.w}*${current.h}px`
    }
  },
  mounted(){
    this.getAppPersonalize()
  },
  methods:{
    // 获取数据
    async getAppPersonalize(){
      const res = await getAppPersonalize({appId:this.appId, version:this.version})
      if(res.code !== 0) return
      this.data = res.data
    },

    //恢复默认
    async resetDefault(){
      const res = await resetDefault({appId:this.appId, version:this.version, defType:2, id:this.data.id})
      if (res.code !== 0) return
      this.$message.success(this.$t('appFooterBar.restore.default.succeed'))
      this.getAppPersonalize()
    },

    // 图片上传
    async customRequest(fileData,type){
      const file = fileData.file
      this.imgLoading[type] = true
      const res = await uploadFile(file,'app')
      this.imgLoading[type] = false
      if (res.code !== 0) return
      const res1 = await saveAppPersonalize({...this.data,[type]:res.data.fullPath})
      if(res1.code !== 0) return
      this.$message.success(this.$t('public.uploadImg.succeed'));
      this.getAppPersonalize()
    },

    // 图片上传前校验
    beforeUpload(file,width,height){
      if (file.type !== 'image/png') {
        this.$message.warning(this.$t('app.config.img.type'))
        return false
      } 
      return beforeUpload(this,file,false,width,height)
    },
  }

}
</script>

<style  lang="less" scoped>
@import "../../../../../global.less";
@import "./common.less";
.config-list {
  padding: 85px 0 40px 28px;
  align-items: flex-end;
}
.config-item{
  text-align: center;
}
.config-item+.config-item{
  margin-left: 90px;
}

.image-wrap{
  position: relative;
  width: 70px;
  height: 70px;
  padding: 5px;
  margin: 0 auto;
  border-radius: 4px;
  border: 1px solid @aithings-border-color;
  .image{
    width: 100%;
    height: 100%;
  }
  &:hover{
    &::after{
      content: '';
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.4) url("../../../../../assets/icons/upload_white_24.svg") center no-repeat;
      border-radius: 3px;
    }
  }
}
.login-register-bg{
  width: 100px;
  height: 178px;
}
.empty{
  padding: 9px;
}
.default-avatar{
  .image{
    border-radius: 50%;
  }
}
.image-name{
  padding: 10px 0 15px;
  font-size: 12px;
  color: @aithings-text-color-gray;
  line-height: 17px;
  text-align: center;
}
.size,.type{
  font-size: 12px;
  color: @aithings-text-tips-color;
  line-height: 18px;
}
.ant-radio-button-wrapper{
  padding: 0 7px;
}
.preview-wrap .tips{
  padding-top: 13px;
  color: @aithings-text-tips-color;
}
.logo-preview{
  position: relative;
  width: 100%;
  height: 100%;
  .logo-image{
    position: absolute;
    left: 61px;
    top: 79px;
    width: 44px;
    height: 44px;
  }
}
.empty-image-wrap{
  position: absolute;
  left: 61px;
  top: 112px;
  text-align: center;
  .empty-image{
    width: 44px;
    height: 44px;
  }
  .text{
    padding-top: 10px;
    font-size: 12px;
    color: @aithings-text-color-gray;
  }
}
.avatar-bg{
  background: url("../../../../../assets/image/avatar_bg.png") top/100% no-repeat;
}
.empty-bg{
  background: url("../../../../../assets/image/empty_bg.png") top/100% no-repeat;
}
.avatar-image{
  position: absolute;
  top: 21px;
  left: 11px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.back-default:disabled{
  opacity: 0.4;
}
</style>