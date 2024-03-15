<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="$t('setting.voiceControl.verifyGuide.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content" v-html="detailsData">
      </section>
    </a-page-header>
 </section>
</template>
<script>
import { getVoiceDemo } from "@/api/product"

export default {
  name: "VerifyGuide",
  data() {
    return {
      voiceNo: 0,
      detailsData: ''
    };
  },
  async created() {
    this.voiceNo = this.$route.query.voiceNo
    this.getDetails()
  },
  methods: {
    async getDetails(){
      const res = await getVoiceDemo({voiceNo: this.voiceNo})
      if(res.code !== 0) return
      this.detailsData = res.data
    },

  },
};
</script>
<style lang="less" scoped>
  @import "../../../../../../global.less";
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 20px;
  }

</style>
