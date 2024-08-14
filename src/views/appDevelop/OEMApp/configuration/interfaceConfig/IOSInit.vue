<template>
  <section class="config-content flex x-space-between">
    <section class="config-wrap">
      <h4 class="config-title">{{$t('IOSInit.title')}}</h4>
      <p class="config-tips">{{$t('IOSInit.tips')}}</p>
      <section class="phone-type-list flex">
        <section class="phone-type" v-for="item in sizeList" :key="item.type">
          <a-spin :spinning="imgLoading[item.key]" wrapperClassName="spin-ele">
            <a-upload
              name="file"
              :disabled="editDisabled"
              :multiple="false"
              :showUploadList="false"
              accept="image/png"
              :beforeUpload="e => beforeUpload(e, item.w, item.h)"
              :customRequest="e => customRequest(e, item.key)"
            >
              <section :class="['phone-wrap', item.type]" :style="{background: imgData[item.key] ? `url(${imgData[item.key]}) center/100% no-repeat` :'none'}">
                <img v-if="!imgData[item.key]" :src="logoUrl || logoDefaultUrl" class="logo"/>
              </section>
            </a-upload>
          </a-spin>
          <p class="size-detail">{{`${item.w}*${item.h}px`}}</p>
        </section>
      </section>
      <p class="tips">{{$t('AndroidInit.size')}}</p>
      <p class="tips">{{$t('AndroidInit.type')}}</p>
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
       <section :class="['preview-phone-wrap',`${currentPhone}-shell`] ">
         <section class="phone-bg" :style="{background: getBackground ? `url(${imgData[previewImage[currentPhone]]}) center/100% 100% no-repeat` :'#fff'}">
           <div v-if="!getBackground" class="logo-preview">
             <img :src="logoUrl || logoDefaultUrl" class="logo-image"/>
           </div>
         </section>
       </section>
       <p class="tips size-tips" v-text="getSize"></p>
       <p class="tips">{{$t('app.config.preview.tips')}}</p>
    </section>
  </section>
</template>


<script>
import { beforeUpload } from "@/utils/validate"
import { uploadFile } from "@/api/common"
import { getAppIOSInit, saveAppIOSInit } from "@/api/appExploit"

export default {
  props:{
    appId:{ type:String, default:''},
    version:{ type:String, default:''},
    logoUrl:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false},
  },
  data (){
    return {
      logoDefaultUrl:require('../../../../../assets/image/logo_default.png'),
      currentPhone:"IPhone4",
      sizeList:[
        {type:"IPhone4", label:"IPhone4", w: 640, h:960, key:'smallImage'},
        {type:"IPhone5_6", label:"IPhone5,6,6P", w: 1080, h:1920, key:'mediumImage' },
        {type:"IPhoneXS", label:"IPhoneXS MAX", w: 1242, h:2688, key:'bigImage' }
      ],
      imgData:{},
      previewImage:{
        IPhone4:'smallImage',
        IPhone5_6:'mediumImage',
        IPhoneXS:'bigImage',
      },
      imgLoading:{
        smallImage: false,
        mediumImage: false,
        bigImage: false
      }
    }
  },
  computed:{
    getSize (){
      const current = this.sizeList.filter(item=>item.type == this.currentPhone).pop()
      return `${current.w}*${current.h}px`
    },
    getBackground (){
      const current = this.sizeList.filter(item=>item.type == this.currentPhone).pop()
      return this.imgData[current.key]
    }
  },
  watch:{
    logoUrl(){
      this.getAppIOSInit()
    }
  },
  mounted(){
    this.getAppIOSInit()
  },

  methods:{
    // 获取数据
    async getAppIOSInit(){
      const res = await getAppIOSInit({appId:this.appId, version:this.version})
      if(res.code !== 0 ) return
      this.imgData = res.data
    },

    // 保存数据
    async saveAppIOSInit(){
      const res = await saveAppIOSInit({...this.imgData})
      return res
    },

    // 图片上传
    async customRequest(fileData,type){
      const file = fileData.file
      this.imgLoading[type] = true
      const res = await uploadFile(file,'app')
      this.imgLoading[type] = false
      if (res.code !== 0) return
      this.imgData[type] = res.data.fullPath
      const res1 = this.saveAppIOSInit()
      if(res1.code !==0) return
      this.getAppIOSInit()
      this.$message.success(this.$t('public.uploadImg.succeed'));
      this.getAppIOSInit()
    },

    // 图片上传前校验
    beforeUpload(file,width,height){
      if (file.type !== 'image/png') {
        this.$message.warning(this.$t('app.config.img.type'))
        return false
      } 
      return beforeUpload(this,file,2,width,height)
    },
  }

}
</script>

<style  lang="less" scoped>
@import "../../../../../global.less";
@import "./common.less";
.phone-type-list{
  padding: 50px 0 40px 24px;
  align-items: flex-end;
  .IPhone4{
    width: 60px;
    height: 110px;
    .logo{
      margin: 29px auto 0;
      width: 18px;
      height: 18px;
    }
  }
  .IPhone5_6{
    width: 70px;
    height: 144px;
    .logo{
      margin: 37px auto 0;
      width: 21px;
      height: 21px;
    }
  }
  .IPhoneXS{
    width: 80px;
    height: 193px;
    .logo{
      margin: 52px auto 0;
      width: 24px;
      height: 24px;
    }
  }
}
.phone-type+.phone-type{
  padding-left: 84px;
}
.phone-wrap{
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid @aithings-border-color;
  &:hover{
    &::after{
      content: '上传';
      width: 100%;
      height: 20px;
      position: absolute;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      font-size: 10px;
      text-align: center;
      line-height: 20px;
    }
  }
  .logo{
    display: block;
  }

}

.size-detail{
  padding-top: 15px;
  font-size: 12px;
  color: @aithings-text-color-gray;
  line-height: 17px;
}
.tips{
  font-size: 12px;
  color: @aithings-text-tips-color;
  line-height: 17px;
}
.IPhoneXS-shell{
  .phone-bg{
    padding-top: 93px;
    text-align: center;
  }
  .logo-image{
    width: 50px;
    height: 50px;
  }
}
.IPhone4-shell{
  .phone-bg{
    padding-top: 52px;
    text-align: center;
  }
  .logo-image{
    width: 42px;
    height: 42px;
  }
}
.IPhone5_6-shell{
  .phone-bg{
    padding-top: 58px;
    text-align: center;
  }
  .logo-image{
    width: 44px;
    height: 44px;
  }
}

</style>