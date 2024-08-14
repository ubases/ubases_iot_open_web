<template>
  <section class="config-content flex x-space-between">
    <section class="config-wrap">
      <h4 class="config-title">{{$t('ThemeColor.title')}}</h4>
      <p class="config-tips">{{$t('ThemeColor.tips')}}</p>
      <h4 class="color-title">{{$t('ThemeColor.basicColor')}}</h4>
      <section class="color-list flex y-axis-center">
        <div v-for="(item,index) in basicColorList" :key="index" @click="baseColortips(index)" :class="['basic-color tap-pointer flex y-axis-center',{active:baseColorIndex === index+1},{disabled:editDisabled}]">
          <div class="color-wrap" :style="{background: item.deep}"></div>
          <div class="color-wrap" :style="{background: item.light}"></div>
        </div>
        <a-popover trigger="contextmenu" v-model="popoverVisible">
          <section slot="content" class="popover-wrap">
            <h4 class="config-title">{{$t('ThemeColor.customColor')}}</h4>
            <section class="popover-content flex y-axis-center">
              <div class="color-item">
                <h4>{{$t('ThemeColor.name')}}</h4>
                <color-picker :color="customColorEdit.deep" :size="{width:24,height:24}" @sumitColor="customSumitThemeColor"/>
              </div>
              <div class="color-item">
                <h4>{{$t('ThemeColor.appBackground')}}</h4>
                <color-picker :color="customColorEdit.light" :size="{width:24,height:24}"  @sumitColor="customSumitBgColor"/>
              </div>
            </section>
            <section class="footer">
              <a-button class="cancel-btn" @click="cancelCustomChange">{{$t('public.cancel')}}</a-button>
              <a-button type="primary" :disabled="customSumitBtnDisabled" @click="sumitCustomChange">{{$t('public.ok')}}</a-button>
            </section>
          </section>
          <div :class="['basic-color tap-pointer flex y-axis-center',{active:baseColorIndex == basicColorList.length+1},{disabled:editDisabled}]" @click="baseColortips(basicColorList.length+1)">
            <div class="color-wrap colorfull"></div>
            <p class="color-text">{{$t('ThemeColor.customColor')}}</p>
            <div v-if="baseColorIndex ===basicColorList.length+1" class="selected-color flex y-axis-center">
              <span :style="{background: customColor.deep}" class="custom-color-wrap deep"></span>
              <span :style="{background: customColor.light}" class="custom-color-wrap light"></span>
            </div>
          </div>
        </a-popover>
       
      </section>
      <h4 class="color-title">{{$t('ThemeColor.complementaryColors')}}</h4>
      <section class=" flex y-axis-center">
        <section v-for="(item,index) in subColorList" :key="index" class="sub-color-wrap">
          <color-picker :disabled="editDisabled" :color="subColordata[item.key]" :size="{width:24,height:24}" @sumitColor="e=>sumitSubColor(e,item.key)"/>
          <p class="sub-color-text" v-text="item.text"></p>
        </section>
        <div class="slider-wrap">
          <section class="slider-bar">
            <p class="tooltip" :style="{left:`${modalOpacity*1.4 - 18}px`}" v-text="`${modalOpacity}%`"></p>
            <a-slider :disabled="editDisabled" :tooltipVisible="false" v-model="modalOpacity" @afterChange="modalOpacityChange"/>
          </section>
          <p class="sub-color-text">{{$t('ThemeColor.modal.opacity')}}</p>
        </div>
      </section>
    </section>
    <section class="preview-wrap">
       <h4 class="config-title">{{$t('public.previewResults')}}</h4>
       <section class="preview-phone-wrap iphone-xs-max-shell">
         <section class="phone-bg" :style="{background:previewColor.light}">
           <section class="banner" :style="{background:previewColor.deep}">
             <img :src="require('../../../../../assets/image/app_banner.png')" />
             <span class="tips-circle" :style="{background:subColordata.waringColor}"></span>
           </section>
           <section class="app-device-list">
             <img :src="colorMode? deviceListDeep : deviceListLight" />
             <div class="switch" :style="{background:subColordata.successColor}">
               <span></span>
             </div>
             <div class="line" :style="{background:previewColor.deep}"></div>
           </section>
           <section class="footer-menu" :style="{background: colourBlend}">
             <img :src="colorMode ? footerDeep : footerLight" />
           </section>
         </section>
       </section>
    </section>
  </section>
</template>

<script>
import ColorPicker from "../component/ColorPicker.vue"
import { getAppThemeColors, saveAppThemeColors } from "@/api/appExploit"
import { colorMode,colourBlend } from "@/utils/color"

export default {
  props:{
    appId:{ type:String, default:''},
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false},
  },
  components:{
    ColorPicker
  },
  data (){
    return {
      basicColorList:[
        { deep: "#3B7CFF", light: "#F4F8FE" },
        { deep: "#FF8E35", light: "#F4F8FE" },
        { deep: "#0FC6B9", light: "#F4F8FE" },
      ],
      customColor:{ deep: "#3B7CFF", light: "#F4F8FE" },
      customColorEdit:{},
      previewColor:{deep: "#3B7CFF", light: "#F4F8FE"},
      subColorList:[
        { text: this.$t('ThemeColor.waringColor'), key:"waringColor" },
        { text: this.$t('ThemeColor.successColor'), key:"successColor"  },
        { text: this.$t('ThemeColor.messageColor'), key:"messageColor" },
      ],
      subColordata:{
        waringColor:"#FF4444",
        successColor:"#52C265",
        messageColor:"#3B7CFF"
      },
      modalOpacity:0,
      baseColorIndex:1,
      popoverVisible:false,
      customSumitBtnDisabled:false,
      datas:{},
      footerLight: require('../../../../../assets/image/footer_light.png'),
      footerDeep: require('../../../../../assets/image/footer_deep.png'),
      deviceListLight: require('../../../../../assets/image/app_device_list_light.png'),
      deviceListDeep: require('../../../../../assets/image/app_device_list_deep.png'),
    }
  },
  computed:{
    colorMode(){
      // 浅色模式: false  深色模式：true
      return colorMode( this.previewColor.light )
    },
    colourBlend(){
      return colourBlend( this.previewColor.light, '#ffffff', 0.05)
    }
  },
  mounted(){
    this.getAppThemeColors()
  },
  methods:{
    // 获取数据
    async getAppThemeColors(){
      const res = await getAppThemeColors({appId:this.appId, version:this.version})
      if(res.code !== 0 ) return
      this.datas = res.data
      this.modalOpacity = res.data.lightness
      if(res.data.baseColorIndex == 4) {
        this.customColor = {deep: res.data.baseColor1, light: res.data.baseColor2}
        this.previewColor = {...this.customColor}
        this.baseColorIndex = 4
      } else if(res.data.baseColorIndex){
        this.baseColorIndex = res.data.baseColorIndex
        this.previewColor = this.basicColorList[this.baseColorIndex-1]
      } else {
        this.previewColor = this.basicColorList[0]
      }
      const {waringColor,successColor,messageColor} = res.data
      this.subColordata = {
        waringColor: waringColor || "#FF4444",
        successColor: successColor || "#52C265",
        messageColor: messageColor || "#3B7CFF"
      }
    },

    // 保存主题数据
    async saveAppThemeColors(data){
      const params = {
        ...this.datas,
        appId: this.appId,
        version: this.version,
        ...data
      }
      const res = await saveAppThemeColors(params)
      if(res.code !== 0)return
      this.getAppThemeColors()
    },


    // 切换基础色弹窗提示
    baseColortips(index){
      if(this.baseColorIndex == index+1 || this.editDisabled) return
      if(index >= this.basicColorList.length){
        this.customColorEdit = {...this.customColor}
        this.popoverVisible = true
        return
      }
      this.$WarningModal(this, this.$t('ThemeColor.ischangeTheme')).then(async() => {
        this.saveAppThemeColors({baseColorIndex: index+1, baseColor1:this.basicColorList[index].deep, baseColor2:this.basicColorList[index].light })
        this.$message.success(this.$t('public.update.succeed'))
      })
    },

    // 自定义配色--主题色
    customSumitThemeColor(color){
      this.customColorEdit.deep = typeof(color) === 'string' ? color : color.hex
    },

    // 自定义配色--背景色
    customSumitBgColor(color){
      this.customColorEdit.light = typeof(color) === 'string' ? color : color.hex
    },

    // 取消保存自定义配色
    cancelCustomChange(){
       this.popoverVisible = false
    },

    // 确认保存自定义配色
    sumitCustomChange(){
      this.customSumitBtnDisabled = true
      this.$WarningModal(this, this.$t('ThemeColor.ischangeTheme')).then(async() => {
        this.saveAppThemeColors({baseColorIndex: 4, baseColor1:this.customColorEdit.deep, baseColor2:this.customColorEdit.light })
        this.$message.success(this.$t('public.update.succeed'))
        this.customSumitBtnDisabled = false
      })

    },
    
    // 编辑辅助色
    sumitSubColor(color,key){
      this.saveAppThemeColors({[key] : typeof(color) === 'string' ? color : color.hex })
      this.$message.success(this.$t('public.update.succeed'));
    },

    // 弹框蒙层透明度变化
    modalOpacityChange(){
      this.saveAppThemeColors({lightness:this.modalOpacity })
      this.$message.success(this.$t('public.update.succeed'));
    }
  }

}
</script>

<style lang="less" scoped>
@import "../../../../../global.less";
@import "./common.less";
  .color-title{
    padding: 30px 0 18px;
  }
  
  .basic-color{
    padding: 6px 15px;
    border: 1px solid @aithings-border-color;
    border-radius: 25px;
    &.active{
      box-shadow: 0px 1px 3px 1px rgba(82, 194, 101, 0.14);
      border: 2px solid @aithings-green-color-38CB52;
    }
    .color-wrap+.color-wrap{
      margin-left: 8px;
    }
    .colorfull{
      background: url("../../../../../assets/image/colors-circle.png") no-repeat;
      background-size: 100% 100%;
    }
    &.disabled{
      cursor: no-drop;
    }
  }
  .sub-color{
    padding: 6px 15px;
    border: 1px solid @aithings-border-color;
    border-radius: 25px;
  }
  .color-wrap{
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  .color-text{
    padding-left: 9px;
    color: @aithings-text-color-gray;
  }

  .basic-color+.basic-color{
    margin-left: 15px;
  }
  .sub-color-wrap + .sub-color-wrap {
    margin-left: 30px;
  }
  .sub-color-text{
    padding-top: 10px;
    line-height: 20px;
    color: @aithings-text-color-gray;
  }
  .popover-wrap{
    padding: 13px 9px;
  }
  .popover-content{
    padding: 6px 0 39px;
    h4{
      margin-bottom: 10px;
    }
    .color-item +.color-item{
      margin: 0 53px 0 65px;
    }
  }
  .footer{
    text-align: center;
    .ant-btn{
      height: 26px;
    }
    .cancel-btn{
      border-color: @aithings-text-tips-color;
      color:  @aithings-text-tips-color;
    }
    .ant-btn + .ant-btn{
      margin-left: 25px;
    }
  }
  .selected-color{
    margin-left: 10px;
    height: 24px;
    .custom-color-wrap{
      display: block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .light{
      margin-left: 8px;
    }
  }

  .slider-wrap{
    margin-left: 45px;
  }
  .slider-bar{
    position: relative;
    height: 46px;
    line-height: 46px;
    .tooltip{
      position: absolute;
      top: -8px;
      width: 36px;
      text-align: center;
      color: @aithings-text-color-black;
      line-height: 20px;
    }
  }
  /deep/.ant-slider{
    width: 140px;
    margin: 0;
    padding: 18px 0 0;
    .ant-slider-rail,.ant-slider-track{
      height: 10px;
    }
    .ant-slider-rail{
      background: @aithings-color-E9EAEE;
      border-radius: 5px;
    }
    .ant-slider-track{
      background: @primary-color;
    }
    .ant-slider-handle{
      width: 18px;
      height: 18px;
      margin-top: -4px;
      background: #FFFFFF;
      box-shadow: 0px 0px 4px 0px @primary-color;
      border: 1px solid @primary-color;
    }
  }
  .preview-phone-wrap{
    margin-top: 18px;
    .phone-bg{
      position: relative;
      overflow: hidden;
    }
    .banner{
      height: 108px;
      position: relative;
      img{
        width: 100%;
      }
      .tips-circle{
        display: block;
        width: 5px;
        height: 5px;
        position: absolute;
        top: 20px;
        right: 37px;
        border-radius: 50%;
      }
    }
    .app-device-list{
      position: relative;
      padding-top: 8px;
      img{
        width: 100%;
      }
      .switch{
        position: absolute;
        top: 39px;
        left: 57px;
        width: 19px;
        height: 10px;
        padding: 1px 1px 1px 10px;
        border-radius: 5px;
        span{
          display: block;
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
        }
      }
      .line{
        position: absolute;
        left: 54px;
        top: 21px;
        width: 12px;
        height: 2px;
        border-radius: 1px;
      }
    }
    .footer-menu{
      position: absolute;
      bottom: 0;
      left: 0;
      box-shadow: 0px 4px 11px 3px rgba(184,196,213,0.42);
      img{
        width: 100%;
      }
    }
  }

</style>