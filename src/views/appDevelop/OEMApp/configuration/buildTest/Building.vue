<template>
  <section class="page-content flex">
    <section class="building-status">
      <div style="height:10px" class="space"></div>
      <h4 class="title">{{$t('building.title')}}</h4>
      <p class="details">{{$t('building.details')}}</p>
      <div style="height:20px" class="space"></div>
      <section>
        <div class="card flex y-axis-center" v-for="item in packageList" :key="item.key">
          <div :class="{'building':item.status == 2}">
            <component :is="statusIconList[item.status].icon" />
          </div>
          <div class="status-content">
            <div class="name-wrap flex y-axis-center"><h4 class="name">{{$DictName('build_package_type', item.os)}}</h4> <span v-if="item.status != 2" :class="['status-text',statusIconList[item.status].class]">{{$DictName('app_build_status', item.status)}}</span></div>
            <p v-if="!item.hasUpdate && item.status == 2 && !item.timeSurplus" class="status">{{$t('building.status')}}</p>
            <p v-if="!item.hasUpdate && item.status == 2 && item.timeSurplus" class="status">{{$t('building.predict')}}{{item.timeSurplus}}{{$t('public.minute')}}</p>
            <p v-if="item.hasUpdate" class="status">{{ $t('building.app.hasUpdate') }}</p>
            <p v-if="item.status ==1 && item.cause" class="status warning" v-text="item.cause"></p>
            <!-- iOS测试包证书缺失 -->
            <p v-if="item.status == 3" class="status">{{$t('building.info')}}</p>
            <p v-if="item.status == 4" class="status" v-text="item.cause || $t('building.oneMoreTime')"></p>
          </div>
          <div class="action">
            <a v-if="item.status == 3" :class="['download-link',{disabled:item.hasUpdate}]" :href="getPckUrl(item)">{{$t('building.download.installation.package')}}</a>
            <a-button v-if="item.status == 1" type="primary" :disabled="!!item.cause" class="rebuild-btn" @click="rebuild(item)">{{$t('buildTips.build.button')}}</a-button>
            <a-button v-if="isShowRebuild && item.status != 1 && item.status != 2" type="primary" :disabled="status == 5" class="rebuild-btn" @click="rebuild(item)">{{$t('building.reconstruction')}}</a-button>
            <a-button v-if="item.status == 2" type="primary" :disabled="status == 5" class="rebuild-btn" @click="cancelBuild(item)">{{$t('building.cancel')}}</a-button>
          </div>
        </div>
      </section>
    </section>
    <section class="qrcode-wrap" v-if="isShow">
      <h4 class="title">{{$t('building.app.test.package')}}</h4>
      <p class="details">{{$t('building.app.test.package.info')}}</p>
      <div class="qrcode-image-wrap">
        <qr-code :text="QrCodedata" :options="{margin:0}"/>
      </div>
    </section>
  </section>
</template>
<script>
import {BuildingIcon,ErrorLargeIcon,SuccessIcon,FaultIcon} from '@/core/icons'
import QrCode from "@/components/VueQrCode/index.vue"
import { getAppBuildPkg, buildAppPkg, getQrCodeUrl, buildCancel, getAppBuildCheck } from '@/api/appExploit'
import { URL_PARAMS } from '@/utils/validate'

export default {
  props:{
    appId: { type:String, default:'' },
    appName: { type:String, default:'' },
    version:{ type:String, default:''},
    editDisabled: { type:Boolean, default:false },
    status: { type:Number, default: 0}
  },
  components:{
    BuildingIcon,
    ErrorLargeIcon,
    SuccessIcon,
    FaultIcon,
    QrCode,
  },
  data (){
    return {
      // 1 未构建, 2 构建中, 3构建成功,4 构建失败
      packageList:[],
      statusIconList:{
        1:{ icon:"ErrorLargeIcon", class:"error-text" },
        2:{ icon:"BuildingIcon", class:"" },
        3:{ icon:"SuccessIcon", class:"success-text" },
        4:{ icon:"FaultIcon", class:"fault-text" },
      },
      timer:null,
      QrCodedata:''
    }
  },
  computed:{
    isShow(){
      // 是否又构建完成的包
      return this.packageList.some(item => item.status == 3)
    },
    isShowRebuild(){
      return !this.packageList.some(item=>item.status == 2)
    }
  },
  watch:{
    async isShow(val){
      if(val){
        // 获取构建包二维码链接
        const res = await getQrCodeUrl({ appId: this.appId, version:this.version })
        if(res.code !== 0) return
        this.QrCodedata = res.data
      }
    }
  },
  mounted(){
    this.getAppBuildPkg()
  },
  methods:{
    // 获取构建包列表
    async getAppBuildPkg(){
      const res = await getAppBuildPkg({ appId: this.appId, version:this.version, packageType:1 })
      if(res.code !== 0) return
      if(res.data.length == 0){
        this.timer = setTimeout(() => {
          this.getAppBuildPkg()
        },1000)
        return
      }
      if(this.timer) clearTimeout(this.timer)
      this.packageList = res.data
      if(res.data.some(item=>item.status == 2)){
        this.timer = setTimeout(() => {
          this.getAppBuildPkg()
        },3*60*1000)
        return 
      }
      const isNextStep = this.packageList.some(item=>item.status == 3) && !this.packageList.some(item=>item.status == 2)
      this.$emit('isToPublish',isNextStep)
    },

    // 安装包url处理
    getPckUrl(item){
      if( item.status !== 1 && item.url && !item.hasUpdate){
        const arr = item.url.match(URL_PARAMS) // url是否含参数
        return `${item.url}${arr ? '&' :'?'}attname=${this.appName}${item.urlExt}`
      } else{
        'javascript:void(0);'
      }
    },

    // 重新构建
    async rebuild(item) {
      const res = await getAppBuildCheck({ appId:this.appId, version:this.version })
      if(res.code !== 0) return
      const checkData = res.data
      const status = checkData[item.os]?.isPass
      if(status == 2){
        const tips = `${cause},` + this.$t('building.disabled.text')+this.$DictName('build_package_type', item.os)
        this.$ConfirmCustomModal(this, h=><div style="text-align:center;">{tips}</div>,this.$t('public.warm.prompt'),this.$t('building.app.lack.cert'),this.$t('building.cancel')).then(async() => {
          if(item.os == 2 || item.os == 3){
            // 安卓
            this.$emit('changeTab',{activeStep:3, activeTab:4})
          } else{
            // IOS
            this.$emit('changeTab',{activeStep:3, activeTab:3})
          }
        },()=>{
          this.getAppBuildPkg()
        })
      }
      const res1 = await buildAppPkg({ appId: this.appId, os: [`${item.os}`], version:this.version})
      if(res1.code !== 0) return
      this.getAppBuildPkg()
      this.$emit('sumitBuild')
    },

    // 取消构建
    async cancelBuild(item){
      const res = await buildCancel({ appId: this.appId, os: [`${item.os}`], version:this.version, buildId:item.buildId})
      if(res.code !== 0) return
      this.getAppBuildPkg()
      this.$emit('sumitBuild')
    },

    beforeDestroy() {
      if(this.timer) clearTimeout(this.timer)
    },

  }

}
</script>
<style scoped lang="less">
@import "../../../../../global.less";
.page-content{
  height: 100%;
}
/deep/.steps-bar{
  padding: 0 20px;
}
.building-status{
  overflow-y: auto;
  height: 100%;
  padding: 20px;
  flex: 1;
}

.title{
  padding: 0 0 10px;
  font-size: 15px;
  line-height: 21px;
}
.details,.time-line{
  color: @aithings-text-color-gray;
  line-height: 22px;
}

.card{
  margin-bottom: 20px;
  min-height: 100px;
  padding: 23px 20px;
  border-radius: 4px;
  border: 1px solid @aithings-border-color;
}
.status-content{
  flex: 1;
  padding-left: 20px;
  .name-wrap{
    padding-bottom: 10px;
  }
  .name{
    font-size: 15px;
    line-height: 21px;
  }
  .status{
    color: @aithings-text-color-gray;
    line-height: 22px;
    &.warning{
      color: @aithings-warning-color-FF8E35;
    }
  }
  .status-text{
    display: block;
    margin-left: 10px;
    padding: 0 12px;
    height: 20px;
    font-size: 10px;
    line-height: 18px;
    border-radius: 10px;
    &.error-text{
      color: @aithings-text-tips-color;
      border: 1px solid @aithings-text-tips-color;
    }
    &.success-text{
      color: @aithings-green-color-38CB52;
      border: 1px solid @aithings-green-color-38CB52;
    }
    &.fault-text{
      color: @aithings-color-FF4444;
      border: 1px solid @aithings-color-FF4444;
    }
  }
}
/deep/.ant-btn{
  width: 120px;
  border: 1px solid @primary-color;
  color: @primary-color;
  &:disabled{
    background: @aithings-table-thread-color;
    color: @aithings-text-tips-color;
    border: 1px solid @aithings-color-E9EAEE;
  }
  &.ant-btn-primary{
    background: @primary-color;
    color: #fff;
  }
}
.rebuild-btn:disabled{
  opacity: 0.4;
}
.download-link{
  display: block;
  width: 120px;
  height: 34px;
  color: @primary-color;
  border: 1px solid @primary-color;
  border-radius: 4px;
  line-height: 34px;
  text-align: center;
  &.disabled{
    opacity: 0.4;
    cursor: no-drop;
  }
}
.download-link+.ant-btn{
  margin-top: 10px;
}
.building{
  width: 36px;
  height: 36px;
  animation: turnAround 2s linear infinite;
}

@keyframes turnAround{
  0%{transform:rotate(0deg);}
  100%{transform:rotate(360deg);}
}
.qrcode-wrap{
  width: 350px;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  background: @aithings-table-thread-color;
  border-left: 1px solid @aithings-border-color;
}
.qrcode-image-wrap{
  padding: 50px 0;
}
.qrcode-image-wrap,.time-line{
  text-align: center;
}
</style>