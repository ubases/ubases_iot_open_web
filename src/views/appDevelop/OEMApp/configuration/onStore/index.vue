<template>
  <section class="page-content">
    <section class="finish-wrap" v-if="status == 5">
      <div class="flex x-axis-center"><right-green-large /></div>
      <h1>{{$t('onStore.title',{name:appName+' '+version})}}</h1>
      <p class="details">{{$t('onStore.details')}}</p>
    </section>
    <div style="height:30px" class="space"></div>
    <h4 class="title">{{$t('onStore.get.shelf.pack')}}</h4>
    <template v-for="(item,index) in packageList">
      <section :key="index" v-if="item.status == 3" class="pkg-list">
        <h4>{{$DictName('app_store_package_type', item.os)}}</h4>
        <div class="flex row-wrap" v-for="(row,index) in list[item.os]" :key="index">
          <p class="label" v-text="`${row.label}：`"></p>
          <div class="value-wrap" v-if="row.value">
            <p class="value" v-for="(sentence,index) in row.value" :key="index" v-text="sentence"></p>
          </div>
          <div class="value-wrap flex" v-if="row.button">
            <a class="download-link" v-for="(button,index) in row.button" :key="index" :href="getPckUrl(item,button)">{{button.name}}</a>
          </div>
          <div class="value-wrap flex" v-if="row.signCerts">
            <span class="download-link" v-for="(sign,index) in item.signCerts" :key="index" @click="downloadSign(sign.signCertUrl)">{{$DictName('app_sign_cert_market',sign.type)}}</span>
          </div>
        </div>
      </section>
    </template>


  </section>
</template>
<script>
import {InfoIcon, RightGreenLarge} from '@/core/icons'
import { getAppBuildPkg } from '@/api/appExploit'
import { URL_PARAMS } from '@/utils/validate'

export default {
  props:{
    appId:{ type:String, default:'' },
    appName: { type:String, default:'' },
    version:{ type:String, default:''},
    status: { type:Number, default: 1 },
  },
  components:{
    InfoIcon,
    RightGreenLarge
  },
  data (){
    return {
      list:{
        1:[
          {label: this.$t('public.explain'), value:[this.$t('onStore.description.1'), this.$t('onStore.description.2')]},
          {label: this.$t('onStore.market.oriented'), value:[this.$t('onStore.description.3')]},
          {label: this.$t('onStore.onshelf.type'), value:[this.$t('onStore.description.4')]},
          {label: this.$t('public.action'), button:[{name: this.$t('onStore.button.1'),key:"urlIos",pkgType:"urlExt"}]},
        ],
        2:[
          {label: this.$t('public.explain'), value:[this.$t('onStore.description.5')]},
          {label: this.$t('onStore.market.oriented'), value:[this.$t('onStore.description.6')]},
          {label: this.$t('public.action'), button:[{name: this.$t('onStore.button.2'),key:"url",pkgType:"urlExt"}]},
          {label: this.$t('onStore.label.sign'), signCerts:[]}
        ],
        3:[
          {label: this.$t('public.explain'), value:[this.$t('onStore.description.7')]},
          {label: this.$t('public.attention'), value:[this.$t('onStore.description.8')]},
          {label: this.$t('onStore.market.oriented'), value:[this.$t('onStore.description.9')]},
          {label: this.$t('public.action'), button:[{name: this.$t('onStore.button.3'),key:"url",pkgType:"urlExt"},{name: this.$t('onStore.button.4'),key:"urlAab",pkgType:"urlAabExt"}]},
          {label: this.$t('onStore.label.sign'), signCerts:[]}
        ]
    },
      packageList:[],
    }
  },

  mounted(){
    this.getAppBuildPkg()
  },
  methods:{
    async getAppBuildPkg(){
      const res = await getAppBuildPkg({ appId: this.appId, version:this.version, packageType:2 })
      if(res.code !== 0) return
      this.packageList = res.data
    },
    
    getPckUrl(item, button){
      if(item){
        const arr = item[button.key].match(URL_PARAMS) // url是否含参数
        return `${item[button.key]}${arr ? '&' :'?'}attname=${this.appName}${item[button.pkgType]}`
      } else{
        'javascript:void(0);'
      }
    },

    downloadSign(url){
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/open/oem/app/downloadSignCert?signCertUrl=${url}`,
        },
        this.appName +".zip",
        "get"
      );
    }
  }

}
</script>
<style scoped lang="less">
@import "../../../../../global.less";

.page-content{
  padding: 0 20px 140px;
}
.finish-wrap{
  padding: 70px 0 40px;
  border-bottom: 1px solid @aithings-border-color;
  text-align: center;
}
h1{
  padding: 38px 0 15px;
  font-size: 20px;
  font-weight: 600;
  color: @aithings-text-color-black;
  line-height: 28px;
}

.title{
  font-size: 15px;
  line-height: 21px;
}
.details{
  color: @aithings-text-color-gray;
  line-height: 22px;
}

.pkg-list{
  h4{
    padding: 30px 0;
  }
  .label{
    width: 116px;
    text-align: right;
    line-height: 20px;
    color: @aithings-text-color-gray;
  }
  .row-wrap + .row-wrap{
    margin-top: 20px;
  }
  .value-wrap{
    flex: 1;
    padding-left: 10px;
    line-height: 20px;
    color: @aithings-text-color-black;
  }
}
.download-link{
  display: block;
  min-width: 140px;
  height: 34px;
  color: @primary-color;
  border: 1px solid @primary-color;
  border-radius: 4px;
  line-height: 34px;
  text-align: center;
}
.download-link+.download-link{
  margin-left: 20px;
}
</style>