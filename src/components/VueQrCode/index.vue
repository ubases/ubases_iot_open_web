<template>
  <vue-qr :text="text" :size="size"  v-bind="options"></vue-qr>
</template>
<script>
import vueQr from 'vue-qr'
export default {
  name:"VueQrCode",
  props:{
    text: { type: String, default: '' }, // 二维码，即扫描二维码后跳转的页面
    size: { type: Number, default: 200 }, // 尺寸, 长宽一致, 包含外边距
    options:{type: Object, default: ()=>{}}, 
    // 以下是关于options的配置项
    // margin:{ type: String, default: '20px' }, //二维码图像的外边距, 默认 20px
    // dotScale: { type: Number, default: 0.35 }, // dotScale	数据区域点缩小比例,默认为0.35
    // correctLevel: { type: Number, default: 0 }, // 容错级别 0-3
    // whiteMargin: { type: Boolean, default: false }, // 若设为 true, 背景图外将绘制白色边框
    // bindElement: { type: Boolean, default: true },  // 指定是否需要自动将生成的二维码绑定到HTML上
    // colorDark: { type: String, default: '' }, // 实点的颜色
    // colorLight: { type: String, default: '' }, // 空白区的颜色
    // autoColor: { type: Boolean, default: true }, // 若为 true, 背景图的主要颜色将作为实点的颜色, 即 colorDark,
    // bgSrc: { type:String, default:'' }, // 欲嵌入的背景图地址
    // gifBgSrc: { type:String, default:'' }, // 欲嵌入的背景图 gif 地址,设置后普通的背景图将失效。设置此选项会影响性能
    // backgroundColor: { type:String, default:'' }, // 背景色
    // backgroundDimming: { type:String, default:'' },  // 叠加在背景图上的颜色, 在解码有难度的时有一定帮助
    // logoSrc: { type:String, default:'' }, // 嵌入至二维码中心的 LOGO 地址
    // logoScale: { type: Number, default: 0.2 }, // 用于计算 LOGO 大小的值, 过大将导致解码失败, LOGO 尺寸计算公式 logoScale(size-2margin)
    // logoMargin: { type: Number, default: 0 }, // 标识周围的空白边框
    // logoBackgroundColor: { type:String, default:'' }, // 背景色,需要设置 logo
    // logoCornerRadius: { type: Number, default: 0 }, // 标识及其边框的圆角半径
    // binarize: { type: Boolean, default: false }, // 若为 true, 图像将被二值化处理, 未指定阈值则使用默认值
  },
  components:{
    vueQr
  },

}
</script>
<style scoped lang="less">

</style>