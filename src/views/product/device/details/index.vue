<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="$t('device.detail.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <a-tabs v-model="activeTab">
          <a-tab-pane key="1" :tab="$t('device.detail.title')">
            <info :did="did" :activeTab="activeTab"></info>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="$t('device.log.title')">
            <log :did="did" :deviceName="deviceName" :productId="productId" :activeTab="activeTab"></log>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="$t('device.malfunction.title')">
            <malfunction :did="did" :deviceName="deviceName" :activeTab="activeTab"></malfunction>
          </a-tab-pane>
        </a-tabs>
      </section>
    </a-page-header>
 </section>
</template>
<script>
import Info from '../component/Info.vue'
import Log from "../component/Log.vue"
import Malfunction from "../component/Malfunction.vue"

export default {
  name: "DeviceDetails",
  data() {
    return {
      did: 0,
      deviceName:'',
      activeTab:"1",
      productId:''
    };
  },
  components:{
    Info,
    Log,
    Malfunction
  },
  async created() {
    this.did = this.$route.query.did
    this.deviceName = this.$route.query.name
    this.productId = this.$route.query.productId
    this.activeTab = this.$route.query.tab || '1'
  },
  methods: {


  },
};
</script>
<style lang="less" scoped>
  @import "../../../../global.less";
  
</style>
