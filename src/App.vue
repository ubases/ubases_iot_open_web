<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <!-- <keep-alive> -->
        <router-view/>
      <!-- </keep-alive> -->
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'

export default {
  components:{},
  data () {
    return {
    }
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  watch:{
  },
  mounted(){
  },
  methods:{
  },

  beforeDestroy() {
  },
}
</script>
<style lang="less">
  @import "./global.less";
  #app{
    position: relative;
  }
// 全局的提示弹窗样式
.global-delete-modal{
  font-size: 14px;
  .ant-modal-content{
    overflow: hidden;
  }
  .ant-modal-body{
    padding: 20px 0 0 !important;
  }
  .ant-modal-confirm-body{
    padding: 0 20px 0;
  }
  .ant-modal-confirm-title{
    padding-bottom: 15px;
    font-size: 18px !important;
    font-weight: 600 !important;
    color: @aithings-text-color-black !important;
    line-height: 25px !important;
    text-align: center;
  }
  .ant-modal-confirm-btns{
    float: none !important;
    height: 62px;
    background: @aithings-search-bg-color;
    text-align: center;
    line-height: 62px;
    .ant-btn{
      min-width: 90px;
      height: 34px;
      border-radius: 4px;
      border: 1px solid @aithings-text-tips-color;
      color: @aithings-text-tips-color;
    }
    .ant-btn-primary{
      border-color: @primary-color;
      background: @primary-color;
      color: #FFFFFF;
    }
     .ant-btn + .ant-btn{
      margin-left: 20px;
    }
  }
}

.ant-select-tree{
  max-height: 400px;
  overflow-y: auto;
}
</style>